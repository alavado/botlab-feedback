import classNames from 'classnames'
import './InteractionsLegacyTableRow.css'
import { Interaction, isTag } from '../../../../../api/types/domain'
import { useHistory, useRouteMatch } from 'react-router-dom'
import useAnalytics from '../../../../../hooks/useAnalytics'
import useActiveServiceQuery from '../../../../../api/hooks/useActiveServiceQuery'
import TagLabel from '../../TagLabel/TagLabel'

const InteractionsLegacyTableRow = ({
  interaction,
  highlighted,
  row,
}: {
  interaction: Interaction
  highlighted: boolean
  row: number
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
        const headerValue = interaction.extraDataDict[header.name] as string
        return (
          <div
            key={`cell-${row}-${m}`}
            className={classNames({
              InteractionsLegacyTableRow__cell: true,
              'InteractionsLegacyTableRow__cell--tag-container':
                isTag(headerValue),
            })}
          >
            {isTag(headerValue) ? <TagLabel tag={headerValue} /> : headerValue}
          </div>
        )
      })}
    </div>
  )
}

export default InteractionsLegacyTableRow
