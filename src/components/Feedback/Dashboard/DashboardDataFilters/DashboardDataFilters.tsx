import { Icon } from '@iconify/react'
import useMetricsFiltersQuery from '../../../../api/hooks/useMetricsFiltersQuery'
import Loader from '../../../Loader/Loader'
import './DashboardDataFilters.css'
import MultiSelect from './MultiSelect/MultiSelect'

const DashboardDataFilters = () => {
  const { data, isLoading } = useMetricsFiltersQuery()
  return (
    <div className="DashboardDataFilters">
      <h3 className="DashboardDataFilters__title">
        <Icon icon="mdi:filter" />
        Filtros
      </h3>
      {isLoading ? (
        <Loader />
      ) : (
        data?.map((property) => (
          <MultiSelect
            key={`DashboardDataFilters__${property.id}`}
            property={property}
          />
        ))
      )}
    </div>
  )
}

export default DashboardDataFilters
