import classNames from 'classnames'
import './InteractionsLegacyTableRow.css'
import { Interaction } from '../../../../../api/types/domain'
import { useHistory, useRouteMatch } from 'react-router-dom'
import useAnalytics from '../../../../../hooks/useAnalytics'
import useActiveServiceQuery from '../../../../../api/hooks/useActiveServiceQuery'
import TagLabel from '../../TagLabel/TagLabel'
import _ from 'lodash'

const InteractionsLegacyTableRow = ({
  interaction,
  highlighted,
}: {
  interaction: Interaction
  highlighted: boolean
}) => {
  const { params }: any = useRouteMatch()
  const history = useHistory()
  const track = useAnalytics()
  const { data: service } = useActiveServiceQuery()

  const openChat = () => {
    if (
      (params && Number(params?.patientId)) !== interaction.id.patientId ||
      (params && Number(params?.serviceId)) !== interaction.id.serviceId
    ) {
      history.push(
        `/interacciones/${interaction.id.serviceId}/${interaction.id.patientId}`
      )
      track('Feedback', 'Interactions', 'interactionElementClick', {
        alert,
      })
    }
  }

  return (
    <div
      className={classNames({
        InteractionsLegacyTableRow: true,
        'InteractionsLegacyTableRow--active': highlighted,
      })}
      onClick={openChat}
    >
      <div className="InteractionsLegacyTableRow__cell InteractionsLegacyTableRow__cell--notes-cell"></div>
      {service?.headers.map((header, m) => {
        const metaValue = interaction.extraData.find(
          (m) => m.header === header.name
        )
        return (
          <div
            key={`cell-${header.displayName}-${m}`}
            className={classNames({
              InteractionsLegacyTableRow__cell: true,
              'InteractionsLegacyTableRow__cell--tag-container': !_.isString(
                metaValue?.value
              ),
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
  )
}

export default InteractionsLegacyTableRow
