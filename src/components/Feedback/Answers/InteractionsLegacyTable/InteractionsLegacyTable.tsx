import './InteractionsLegacyTable.css'
import { Interaction, Service } from '../../../../api/types/types'
import _ from 'lodash'
import { Icon } from '@iconify/react'

const InteractionsLegacyTable = ({
  service,
  interactions,
}: {
  service: Service
  interactions: Interaction[]
}) => {
  return (
    <div className="InteractionsLegacyTable">
      <div className="InteractionsLegacyTable__row InteractionsLegacyTable__row--headers">
        <div className="InteractionsLegacyTable__row_cell InteractionsLegacyTable__row_cell--header">
          <Icon icon="mdi:note" />
        </div>
        {service.headers.map((header) => (
          <div
            key={`header-${header.name}`}
            className="InteractionsLegacyTable__row_cell InteractionsLegacyTable__row_cell--header"
          >
            <div>{header.displayName}</div>
          </div>
        ))}
      </div>
      {interactions.slice(0, 50).map((i: Interaction, n) => (
        <div key={`row-${n}`} className="InteractionsLegacyTable__row">
          <div className="InteractionsLegacyTable__row_cell"></div>
          {service.headers.map((header, m) => {
            const metaValue = i.meta.find((m) => m.header === header.name)
            return (
              <div
                key={`cell-${n}-${m}`}
                className="InteractionsLegacyTable__row_cell"
              >
                {_.isString(metaValue?.value)
                  ? metaValue?.value
                  : metaValue?.value.tag}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default InteractionsLegacyTable
