import './InteractionDataRow.css'
import { InteractionExtraData } from '../../../../../api/types/domain'
import useAnalytics from '../../../../../hooks/useAnalytics'

const InteractionDataRow = ({
  data,
  originComponentName,
}: {
  data: InteractionExtraData
  originComponentName: string
}) => {
  const { header, value } = data
  const track = useAnalytics()

  return (
    <div className="InteractionDataRow">
      <h4 className="InteractionDataRow__label">{header}</h4>
      <p
        className="InteractionDataRow__value"
        title={`Copiar "${value}"`}
        onClick={() => {
          track('Feedback', originComponentName, 'copy', {
            property: header,
            value: value,
          })
          navigator.clipboard.writeText(value + '')
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default InteractionDataRow
