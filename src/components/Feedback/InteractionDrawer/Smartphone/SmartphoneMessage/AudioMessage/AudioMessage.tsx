import useAnswerMediaQuery from '../../../../../../api/hooks/useAnswerMediaQuery'
import Loader from '../../../../../Loader'
import './AudioMessage.css'

const AudioMessage = ({ answerId }: { answerId: number }) => {
  const { data, isLoading } = useAnswerMediaQuery(answerId)

  if (isLoading) {
    return <Loader color="var(--color-principal)" />
  }

  return (
    <div className="AudioMessage">
      <audio className="MensajeWhatsapp__audio" src={data?.url} controls />
    </div>
  )
}

export default AudioMessage
