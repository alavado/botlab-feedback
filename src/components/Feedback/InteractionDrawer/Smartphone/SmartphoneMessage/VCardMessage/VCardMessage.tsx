import { Icon } from '@iconify/react'
import useVCardQuery from '../../../../../../api/hooks/useVCardQuery'
import Loader from '../../../../../Loader'
import './VCardMessage.css'

const VCardMessage = ({ answerId }: { answerId: number }) => {
  const { data, isLoading } = useVCardQuery(answerId)

  if (isLoading) {
    return <Loader color="var(--color-principal)" />
  }

  return (
    <div className="VCardMessage">
      <div className="VCardMessage__top">
        <Icon icon="mdi:user-circle" className="VCardMessage__avatar" />
        <span className="VCardMessage__phone">{data?.phone}</span>
      </div>
      <div>
        <a
          href={`https://web.whatsapp.com/send/?phone=${data?.phone.replace(
            /[^0-9]/g,
            ''
          )}`}
          target="_blank"
          rel="noreferrer noopener"
          className="VCardMessage__link_whatsapp"
        >
          Contactar por Whatsapp
        </a>
      </div>
    </div>
  )
}

export default VCardMessage
