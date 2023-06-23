import { Icon } from '@iconify/react'
import useMetricsFiltersQuery from '../../../../api/hooks/useMetricsFiltersQuery'
import Loader from '../../../Loader/Loader'
import './DashboardDataFilters2.css'
import MultiSelect from './MultiSelect/MultiSelect'

const DashboardDataFilters2 = () => {
  const { data, isLoading } = useMetricsFiltersQuery()
  return (
    <div className="DashboardDataFilters2">
      <h3 className="DashboardDataFilters2__title">
        <Icon icon="mdi:filter" />
        Filtros
      </h3>
      {isLoading ? (
        <Loader />
      ) : (
        data?.map((property) => (
          <MultiSelect
            key={`DashboardDataFilters2__${property.id}`}
            property={property}
          />
        ))
      )}
    </div>
  )
}

export default DashboardDataFilters2
