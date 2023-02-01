import useAlertTypesQuery from '../../../../../api/hooks/useAlertTypesQuery'
import Loader from '../../../../Loader'
import './AlertTypesFilter.css'

const AlertTypesFilter = () => {
  const { data: alertTypes, isLoading } = useAlertTypesQuery()

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="AlertTypesFilter">
      <h3>Tipos de alertas</h3>
      {alertTypes?.map((alertType) => (
        <div key={`AlertTypesFilter-${alertType.name}`}>
          <label>
            <input type="checkbox" />
            {alertType.name}
          </label>
        </div>
      ))}
    </div>
  )
}

export default AlertTypesFilter
