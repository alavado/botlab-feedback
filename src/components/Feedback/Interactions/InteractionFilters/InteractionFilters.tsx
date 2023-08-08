import { InlineIcon } from '@iconify/react'
import useActiveServiceQuery from '../../../../api/hooks/useActiveServiceQuery'
import useInteractionsQuery from '../../../../api/hooks/useInteractionsQuery'
import Loader from '../../../Loader/Loader'
import './InteractionFilters.css'

const InteractionFilters = () => {
  const { data } = useActiveServiceQuery()
  const { data: interactions } = useInteractionsQuery({ applyFilters: false })

  return (
    <div className="InteractionFilters">
      <h2 className="InteractionFilters__title">
        <InlineIcon icon="mdi:filter-variant" /> Filtros
      </h2>
      <div className="InteractionFilters__filters_container">
        {data && interactions ? (
          <>
            {data.headers
              .filter(
                (header) => header.levels.length < interactions.length / 2
              )
              .map((header) => (
                <div className="InteractionFilters__filter">
                  <h3 className="InteractionFilters__filter_title">
                    {header.displayName}
                  </h3>
                  {header.levels.map((level) => (
                    <label className="InteractionFilters__filter_checkbox">
                      <input type="checkbox" />
                      <p>{level}</p>
                    </label>
                  ))}
                </div>
              ))}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  )
}

export default InteractionFilters
