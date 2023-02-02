import { Icon } from '@iconify/react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import useAlertTypesQuery from '../../../../../api/hooks/useAlertTypesQuery'
import { RootState } from '../../../../../redux/ducks'
import { hideAlertType, showAlertType } from '../../../../../redux/ducks/alerts'
import Loader from '../../../../Loader'
import './AlertTypesFilter.css'

const AlertTypesFilter = () => {
  const { data: alertTypes, isLoading } = useAlertTypesQuery()
  const { hiddenAlertTypes } = useSelector((state: RootState) => state.alerts)
  const dispatch = useDispatch()

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="AlertTypesFilter">
      <h3 className="AlertTypesFilter__title">
        <Icon icon="mdi:bell-cog" />
        Recibir alertas
      </h3>
      {alertTypes?.map(({ id, name }) => {
        const alertTypeHidden = _.includes(hiddenAlertTypes, id)
        return (
          <div key={`AlertTypesFilter-${name}`}>
            <label>
              <input
                type="checkbox"
                checked={!alertTypeHidden}
                onChange={() =>
                  dispatch(
                    alertTypeHidden ? showAlertType(id) : hideAlertType(id)
                  )
                }
              />
              {name}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default AlertTypesFilter
