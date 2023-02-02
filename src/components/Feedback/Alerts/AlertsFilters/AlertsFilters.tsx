import './AlertsFilters.css'
import AlertTypesFilter from './AlertTypesFilter'
import BranchesFilter from './BranchesFilter'
import ServicesFilter from './ServicesFilter'

const AlertsFilters = () => {
  return (
    <div className="AlertsFilters">
      <AlertTypesFilter />
      <BranchesFilter />
      <ServicesFilter />
    </div>
  )
}

export default AlertsFilters
