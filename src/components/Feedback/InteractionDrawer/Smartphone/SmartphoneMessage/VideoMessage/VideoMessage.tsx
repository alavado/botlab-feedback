import useAnswerMediaQuery from '../../../../../../api/hooks/useChatAnswerMediaQuery'
import Loader from '../../../../../Loader'
import './VideoMessage.css'

const VideoMessage = ({ answerId }: { answerId: number }) => {
  const { data, isLoading } = useAnswerMediaQuery(answerId)

  if (isLoading) {
    return <Loader color="var(--color-principal)" />
  }

  return (
    <div className="VideoMessage">
      <video src={data?.url} controls={true} />
    </div>
  )
}

export default VideoMessage
