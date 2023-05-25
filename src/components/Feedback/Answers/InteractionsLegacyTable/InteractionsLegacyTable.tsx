import './InteractionsLegacyTable.css'
import { Interaction } from '../../../../api/types/types'

const InteractionsLegacyTable = ({
  interactions,
}: {
  interactions: Interaction[]
}) => {
  return (
    <div className="InteractionsLegacyTable">
      {interactions.map((i: Interaction) => (
        <p>{i.patientId}</p>
      ))}
    </div>
  )
}

export default InteractionsLegacyTable
