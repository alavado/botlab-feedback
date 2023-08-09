import './InteractionsLegacyTable.css'
import { Interaction } from '../../../../api/types/domain'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import InteractionDrawer from '../../InteractionDrawer/InteractionDrawer'
import InteractionsLegacyTableRow from './InteractionsLegacyTableRow/InteractionsLegacyTableRow'
import useActiveServiceQuery from '../../../../api/hooks/useActiveServiceQuery'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useMemo } from 'react'
import InteractionsLegacyTablePageSelector from './InteractionsLegacyTablePageSelector/InteractionsLegacyTablePageSelector'

const INTERACTIONS_PER_PAGE = 40

const InteractionsLegacyTable = ({
  interactions,
}: {
  interactions: Interaction[]
}) => {
  const { data: service } = useActiveServiceQuery()
  const { params }: any = useRouteMatch()
  const history = useHistory()

  const activeInteraction: Interaction | undefined = useMemo(() => {
    const { patientId, serviceId } = params
    if (!patientId || !serviceId) {
      return undefined
    }
    return interactions.find(
      (i) =>
        i.id.patientId === Number(patientId) && i.id.serviceId === serviceId
    )
  }, [params, interactions])

  return (
    <div className="InteractionsLegacyTable">
      <div
        className={classNames({
          InteractionsLegacyTable__drawer: true,
          'InteractionsLegacyTable__drawer--hidden': !params?.patientId,
        })}
      >
        {activeInteraction && (
          <InteractionDrawer
            interactionId={activeInteraction.id}
            onCloseClick={() => history.push(`/interacciones/${service?.id}`)}
            originComponentName="InteractionsLegacyTable"
          />
        )}
      </div>
      <div
        className="InteractionsLegacyTable__table_container"
        style={{
          gridTemplate: `repeat(${1 + INTERACTIONS_PER_PAGE}, 2rem) / repeat(${
            1 + (service?.headers.length || 0)
          }, auto)`,
        }}
      >
        {/* <!--- jiji ---> */}
        <div className="InteractionsLegacyTableRow InteractionsLegacyTableRow--headers">
          <div className="InteractionsLegacyTableRow__cell InteractionsLegacyTableRow__cell--header InteractionsLegacyTableRow__cell--notes-header">
            <Icon icon="mdi:note" />
          </div>
          {service?.headers.map((header) => (
            <div
              key={`header-${header.name}`}
              className="InteractionsLegacyTableRow__cell InteractionsLegacyTableRow__cell--header"
              draggable={true}
            >
              <div>{header.displayName}</div>
            </div>
          ))}
        </div>
        {interactions
          .slice(0, INTERACTIONS_PER_PAGE)
          .map((i: Interaction, n) => (
            <InteractionsLegacyTableRow
              interaction={i}
              highlighted={
                i.id.patientId === activeInteraction?.id.patientId &&
                i.id.serviceId === activeInteraction?.id.serviceId
              }
              key={`InteractionsLegacyTableRow-${n}`}
            />
          ))}
      </div>
      <InteractionsLegacyTablePageSelector />
    </div>
  )
}

export default InteractionsLegacyTable
