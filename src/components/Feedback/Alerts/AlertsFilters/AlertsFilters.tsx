import _ from 'lodash'
import { MouseEventHandler, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAlertTypesQuery from '../../../../api/hooks/useAlertTypesQuery'
import useBranchesQuery from '../../../../api/hooks/useBranchesQuery'
import useServicesQuery from '../../../../api/hooks/useServicesQuery'
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

type AlertFilterItem = {
  label: string
  hidden: boolean
  onChange: MouseEventHandler
}

type AlertFilterSection = {
  icon: string
  title: string
  onTitleClick: MouseEventHandler
  allChecked: boolean
  someChecked: boolean
  countLabel: string
  items: AlertFilterItem[]
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
    const checkedAlertTypesCount = alertTypes.length - hiddenAlertTypes.length
    const alertTypeItems = {
      icon: 'mdi:bell-cog',
      title: 'Recibir alertas',
      allChecked: hiddenAlertTypes.length === 0,
      someChecked: hiddenAlertTypes.length < alertTypes.length,
      countLabel: `${checkedAlertTypesCount} seleccionada${
        checkedAlertTypesCount !== 1 ? 's' : ''
      }`,
      onTitleClick: () =>
        dispatch(hideAlertTypeShowIfAllHidden(alertTypes.map((t) => t.id))),
      items: alertTypes.map(({ id, name }) => {
        const hidden = _.includes(hiddenAlertTypes, id)
        return {
          label: name,
          hidden,
          onChange: () => dispatch(toggleAlertType(id)),
        }
      }),
    }
    const checkedBranchesCount = branches.length - hiddenBranches.length
    const branchesItems = {
      icon: 'mdi:map-marker',
      title: 'Sucursales',
      onTitleClick: () =>
        dispatch(hideBranchesOrShowIfAllHidden(branches.map((b) => b.id))),
      allChecked: hiddenBranches.length === 0,
      someChecked: hiddenBranches.length < branches.length,
      countLabel: `${checkedBranchesCount} seleccionada${
        checkedBranchesCount !== 1 ? 's' : ''
      }`,
      items: branches.map(({ id, name }) => {
        const hidden = _.includes(hiddenBranches, id)
        return {
          label: name,
          hidden,
          onChange: () => dispatch(toggleBranch(id)),
        }
      }),
    }
    const checkedServicesCount = services.length - hiddenServices.length
    const servicesItems = {
      icon: 'mdi:forum',
      title: 'Servicios',
      onTitleClick: () =>
        dispatch(hideServicesOrShowIfAllHidden(services.map((s) => s.id))),
      allChecked: hiddenServices.length === 0,
      someChecked: hiddenServices.length < services.length,
      countLabel: `${checkedServicesCount} seleccionado${
        checkedServicesCount !== 1 ? 's' : ''
      }`,
      items: services.map(({ id, name }) => {
        const hidden = _.includes(hiddenServices, id)
        return {
          label: name,
          hidden,
          onChange: () => dispatch(toggleService(id)),
        }
      }),
    }
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
