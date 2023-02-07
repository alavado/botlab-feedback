import { Icon } from '@iconify/react'
import _ from 'lodash'
import { ChangeEventHandler, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAlertTypesQuery from '../../../../api/hooks/useAlertTypesQuery'
import useBranchesQuery from '../../../../api/hooks/useBranchesQuery'
import useServicesQuery from '../../../../api/hooks/useServicesQuery'
import { RootState } from '../../../../redux/ducks'
import {
  toggleAlertType,
  toggleBranch,
  toggleService,
} from '../../../../redux/ducks/alerts'
import Loader from '../../../Loader'
import './AlertsFilters.css'

const AlertsFilters = () => {
  const { data: alertTypes } = useAlertTypesQuery()
  const { data: branches } = useBranchesQuery()
  const { data: services } = useServicesQuery()
  const { hiddenAlertTypes, hiddenBranches, hiddenServices } = useSelector(
    (state: RootState) => state.alerts
  )
  const dispatch = useDispatch()

  const filters: any[] | null = useMemo(() => {
    if (!alertTypes || !branches || !services) {
      return null
    }
    const alertTypeItems = {
      icon: 'mdi:bell',
      title: 'Recibir alertas',
      items: alertTypes.map(({ id, name }) => {
        const hidden = _.includes(hiddenAlertTypes, id)
        return {
          label: name,
          hidden,
          onChange: () => dispatch(toggleAlertType(id)),
        }
      }),
    }
    const branchesItems = {
      icon: 'mdi:map-marker',
      title: 'Sucursales',
      items: branches.map(({ id, name }) => {
        const hidden = _.includes(hiddenBranches, id)
        return {
          label: name,
          hidden,
          onChange: () => dispatch(toggleBranch(id)),
        }
      }),
    }
    const servicesItems = {
      icon: 'mdi:forum',
      title: 'Servicios',
      items: services.map(({ id, name }) => {
        const hidden = _.includes(hiddenServices, id)
        return {
          label: name,
          hidden,
          onChange: () => dispatch(toggleService(id)),
        }
      }),
    }
    return [alertTypeItems, branchesItems, servicesItems]
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
        <div className="ServicesFilter">
          <h3 className="ServicesFilter__title">
            <Icon icon={filter.icon} />
            {filter.title}
          </h3>
          {filter.items.map(
            ({
              label,
              hidden,
              onChange,
            }: {
              label: string
              hidden: boolean
              onChange: ChangeEventHandler<HTMLInputElement>
            }) => {
              return (
                <label key={`AlertTypesFilter-${label}`}>
                  <input
                    type="checkbox"
                    checked={!hidden}
                    onChange={onChange}
                  />
                  {label}
                </label>
              )
            }
          )}
        </div>
      ))}
      {/* <AlertTypesFilter />
      <BranchesFilter />
      <ServicesFilter /> */}
    </div>
  )
}

export default AlertsFilters
