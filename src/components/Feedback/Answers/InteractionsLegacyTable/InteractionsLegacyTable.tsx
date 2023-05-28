import './InteractionsLegacyTable.css'
import { Interaction, Service } from '../../../../api/types/types'
import _ from 'lodash'

const InteractionsLegacyTable = ({
  service,
  interactions,
}: {
  service: Service
  interactions: Interaction[]
}) => {
  return (
    <div className="InteractionsLegacyTable">
      <div className="InteractionsLegacyTable__headers">
        {service.headers.map((header) => (
          <div
            key={`header-${header.name}`}
            className="InteractionsLegacyTable__header"
          >
            <div>{header.displayName}</div>
          </div>
        ))}
      </div>
      <div>
        {interactions.map((i: Interaction, n) => (
          <div key={`row-${n}`} className="InteractionsLegacyTable__row">
            {service.headers.map((header, m) => {
              const metaValue = i.meta.find((m) => m.header === header.name)
              if (!metaValue) {
                return null
              }
              return (
                <div
                  key={`cell-${n}-${m}`}
                  className="InteractionsLegacyTable__cell"
                >
                  {_.isString(metaValue.value)
                    ? metaValue.value
                    : metaValue.value.tag}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InteractionsLegacyTable
