import _ from 'lodash'
import { MouseEventHandler, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAlertTypesQuery from '../../../../api/hooks/useAlertTypesQuery'
import useBranchesQuery from '../../../../api/hooks/useBranchesQuery'
import useServicesQuery from '../../../../api/hooks/useServicesQuery'
import {
  AlertType,
  AlertTypeId,
  Branch,
  BranchId,
  Service,
  ServiceId,
} from '../../../../api/types/types'
import { RootState } from '../../../../redux/ducks'
import {
  hideAlertTypeShowIfAllHidden,
  hideBranchesOrShowIfAllHidden,
  hideServicesOrShowIfAllHidden,
  toggleAlertType,
  toggleBranch,
  toggleService,
} from '../../../../redux/ducks/alerts'
import Loader from '../../../Loader'
import './AlertsFilters.css'
import FilterCheckbox from './FilterCheckbox'

type AlertFilterSection = {
  icon: string
  title: string
  onTitleClick: MouseEventHandler
  allChecked: boolean
  someChecked: boolean
  countLabel: string
  items: AlertFilterItem[]
}

type AlertFilterItem = {
  label: string
  hidden: boolean
  onChange: MouseEventHandler
}

const buildFilterItemsList = ({
  icon,
  title,
  itemGender,
  filter,
  onTitleClick,
  onItemChange,
}: {
  icon: string
  title: string
  itemGender: 'a' | 'o'
  filter:
    | { all: Branch[]; exclude: BranchId[] }
    | { all: Service[]; exclude: ServiceId[] }
    | { all: AlertType[]; exclude: AlertTypeId[] }
  onTitleClick: MouseEventHandler
  onItemChange: Function
}) => {
  const checkedCount = filter.all.length - filter.exclude.length
  return {
    icon,
    title,
    allChecked: filter.exclude.length === 0,
    someChecked: filter.exclude.length < filter.all.length,
    countLabel: `${checkedCount} seleccionad${itemGender}${
      checkedCount !== 1 ? 's' : ''
    }`,
    onTitleClick: onTitleClick,
    items: filter.all.map(({ id, name }) => {
      const hidden = _.includes(filter.exclude, id)
      return {
        label: name,
        hidden,
        onChange: onItemChange(id),
      }
    }),
  }
}

const AlertsFilters = () => {
  const { data: alertTypes } = useAlertTypesQuery()
  const { data: branches } = useBranchesQuery()
  const { data: services } = useServicesQuery()
  const { hiddenAlertTypes, hiddenBranches, hiddenServices } = useSelector(
    (state: RootState) => state.alerts
  )
  const dispatch = useDispatch()

  const filters: AlertFilterSection[] | null = useMemo(() => {
    if (!alertTypes || !branches || !services) {
      return null
    }
    const alertTypeItems = buildFilterItemsList({
      icon: 'mdi:bell-cog',
      title: 'Recibir alertas',
      itemGender: 'a',
      filter: { all: alertTypes, exclude: hiddenAlertTypes },
      onTitleClick: () =>
        dispatch(hideAlertTypeShowIfAllHidden(alertTypes.map((t) => t.id))),
      onItemChange: (id: AlertTypeId) => () => dispatch(toggleAlertType(id)),
    })
    const branchesItems = buildFilterItemsList({
      icon: 'mdi:map-marker',
      title: 'Sucursales',
      itemGender: 'a',
      filter: { all: branches, exclude: hiddenBranches },
      onTitleClick: () =>
        dispatch(hideBranchesOrShowIfAllHidden(branches.map((b) => b.id))),
      onItemChange: (id: BranchId) => () => dispatch(toggleBranch(id)),
    })
    const servicesItems = buildFilterItemsList({
      icon: 'mdi:forum',
      title: 'Servicios',
      itemGender: 'o',
      filter: { all: services, exclude: hiddenServices },
      onTitleClick: () =>
        dispatch(hideServicesOrShowIfAllHidden(services.map((s) => s.id))),
      onItemChange: (id: ServiceId) => () => dispatch(toggleService(id)),
    })
    return [alertTypeItems, branchesItems, servicesItems].filter(
      (f) => f.items.length > 1
    )
  }, [
    hiddenAlertTypes,
    hiddenBranches,
    hiddenServices,
    alertTypes,
    branches,
    services,
    dispatch,
  ])

  if (!filters) {
    return <Loader />
  }

  return (
    <div className="AlertsFilters">
      {filters.map((filter) => (
        <div
          className="AlertsFilters__section_container"
          key={`AlertsFilters-section-${filter.title}`}
        >
          <FilterCheckbox
            isTitle
            checked={filter.allChecked}
            partiallyChecked={filter.someChecked}
            onClick={filter.onTitleClick}
            label={filter.title}
            icon={filter.icon}
            countLabel={filter.countLabel}
          />
          {filter.items.map(({ label, hidden, onChange }) => (
            <FilterCheckbox
              key={`AlertsFilters-filter-${label}`}
              checked={!hidden}
              onClick={onChange}
              label={label}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default AlertsFilters
