import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import useServicesQuery from '../../../../../api/hooks/useServicesQuery'
import { RootState } from '../../../../../redux/ducks'
import { hideService, showService } from '../../../../../redux/ducks/alerts'
import Loader from '../../../../Loader'
import './ServicesFilter.css'

const ServicesFilter = () => {
  const { data: services, isLoading } = useServicesQuery()
  const { hiddenServices } = useSelector((state: RootState) => state.alerts)
  const dispatch = useDispatch()

  if (isLoading) {
    return <Loader />
  }

  if (services && services?.length <= 1) {
    return null
  }

  return (
    <div className="ServicesFilter">
      <h3>Servicios</h3>
      {services?.map(({ id, name }) => {
        const serviceHidden = _.includes(hiddenServices, id)
        return (
          <div key={`AlertTypesFilter-${name}`}>
            <label>
              <input
                type="checkbox"
                checked={!serviceHidden}
                onChange={() =>
                  dispatch(serviceHidden ? showService(id) : hideService(id))
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

export default ServicesFilter
