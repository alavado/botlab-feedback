import './InteractionsLegacyTable.css'
import { Interaction, Service } from '../../../../api/types/domain'
import _ from 'lodash'
import { Icon } from '@iconify/react'
import TagLabel from '../TagLabel/TagLabel'
import classNames from 'classnames'
import InteractionDrawer from '../../InteractionDrawer/InteractionDrawer'
import { useState } from 'react'

const InteractionsLegacyTable = ({
  service,
  interactions,
}: {
  service: Service
  interactions: Interaction[]
}) => {
  const [activeInteraction, setActiveInteraction] = useState<
    Interaction | undefined
  >()

  return (
    <div className="InteractionsLegacyTable">
      <div
        className={classNames({
          InteractionsLegacyTable__drawer: true,
          'InteractionsLegacyTable__drawer--hidden': !activeInteraction,
        })}
      >
        {activeInteraction && (
          <InteractionDrawer
            interactionId={activeInteraction.id}
            onCloseClick={() => setActiveInteraction(undefined)}
            originComponentName="InteractionsLegacyTable"
          />
        )}
      </div>
      <div className="InteractionsLegacyTable__row InteractionsLegacyTable__row--headers">
        <div className="InteractionsLegacyTable__row_cell InteractionsLegacyTable__row_cell--header InteractionsLegacyTable__row_cell--notes-header">
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
        <div
          key={`row-${n}`}
          className={classNames({
            InteractionsLegacyTable__row: true,
            'InteractionsLegacyTable__row--active':
              i.id.patientId === activeInteraction?.id.patientId &&
              i.id.serviceId === activeInteraction.id.serviceId,
          })}
          onClick={() => setActiveInteraction(i)}
        >
          <div className="InteractionsLegacyTable__row_cell InteractionsLegacyTable__row_cell--notes-cell"></div>
          {service.headers.map((header, m) => {
            const metaValue = i.extraData.find((m) => m.header === header.name)
            return (
              <div
                key={`cell-${n}-${m}`}
                className={classNames({
                  InteractionsLegacyTable__row_cell: true,
                  'InteractionsLegacyTable__row_cell--tag-container':
                    !_.isString(metaValue?.value),
                })}
              >
                {_.isString(metaValue?.value) ? (
                  metaValue?.value
                ) : (
                  <TagLabel tag={metaValue?.value.tag} />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default InteractionsLegacyTable
