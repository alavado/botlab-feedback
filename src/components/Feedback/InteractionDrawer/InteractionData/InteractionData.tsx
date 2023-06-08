import { Icon } from '@iconify/react'
import useInteractionDataQuery from '../../../../api/hooks/useInteractionDataQuery'
import { InteractionId } from '../../../../api/types/domain'
import Loader from '../../../Loader'
import './InteractionData.css'
import InteractionDataRow from './InteractionDataRow/InteractionDataRow'

const InteractionData = ({
  interactionId,
  originComponentName,
}: {
  interactionId?: InteractionId
  originComponentName: string
}) => {
  const { data } = useInteractionDataQuery({
    interactionId,
  })

  return (
    <div className="InteractionData">
      <h3 className="InteractionData__title">
        <Icon icon="mdi:format-list-bulleted" />
        Datos de la cita
      </h3>
      {data ? (
        data.map((data, i) => (
          <InteractionDataRow
            key={`interaction-data-${i}`}
            data={data}
            originComponentName={originComponentName}
          />
        ))
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default InteractionData
