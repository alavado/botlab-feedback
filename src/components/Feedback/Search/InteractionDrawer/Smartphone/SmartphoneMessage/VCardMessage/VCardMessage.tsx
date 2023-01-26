import useVCardQuery from '../../../../../../../api/hooks/useVCardQuery'
import Loader from '../../../../../../Loader'
import './VCardMessage.css'

const VCardMessage = ({ answerId }: { answerId: number }) => {
  const { data, isLoading } = useVCardQuery(answerId)

  if (isLoading) {
    return <Loader color="var(--color-principal)" />
  }

  return <div className="VCardMessage">{data?.phone}</div>
}

export default VCardMessage
