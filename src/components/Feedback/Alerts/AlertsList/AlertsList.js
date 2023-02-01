import useAlertsQuery from '../../../../api/hooks/useAlertsQuery'
import './AlertsList.css'

const AlertsList = () => {
  const { data } = useAlertsQuery()

  return <div className="AlertsList">AlertsList</div>
}

export default AlertsList
