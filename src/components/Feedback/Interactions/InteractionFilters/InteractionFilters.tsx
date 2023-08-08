import { InlineIcon } from '@iconify/react'
import useActiveServiceQuery from '../../../../api/hooks/useActiveServiceQuery'
import useInteractionsQuery from '../../../../api/hooks/useInteractionsQuery'
import Loader from '../../../Loader/Loader'
import './InteractionFilters.css'

const InteractionFilters = () => {
  const { data } = useActiveServiceQuery()
  const { data: interactions } = useInteractionsQuery({ applyFilters: false })

  const elegibleHeaders = data?.headers.filter(
    (header) => header.levels.length < (interactions?.length || 0) / 2
  )

  return (
    <div className="InteractionFilters">
      <h2 className="InteractionFilters__title">
        <InlineIcon icon="mdi:filter-variant" /> Filtros
      </h2>
      <div className="InteractionFilters__filters_container">
        {interactions && elegibleHeaders ? (
          <>
            {elegibleHeaders.map((header, i) => (
              <div
                className="InteractionFilters__filter"
                key={`filter-title-${header.name}-${i}`}
              >
                <h3 className="InteractionFilters__filter_title">
                  {header.displayName}
                </h3>
                {header.levels.map((level, j) => (
                  <label
                    className="InteractionFilters__filter_checkbox"
                    key={`filter-title-${header.name}-${level}-${j}`}
                  >
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
