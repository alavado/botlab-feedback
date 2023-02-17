import { Icon } from '@iconify/react'
import useAnalytics from '../../../../../hooks/useAnalytics'
import Loader from '../../../../Loader'
import './SmartphoneActionBar.css'

const SmartphoneActionBar = ({
  phone,
  contactName,
}: {
  phone?: string
  contactName?: string
}) => {
  const track = useAnalytics()

  const copyContactName = () => {
    if (!contactName) {
      return
    }
    track('Feedback', 'Smartphone', 'copy', {
      property: 'patientName',
      value: contactName,
    })
    navigator.clipboard.writeText(contactName)
  }

  const copyPhone = () => {
    if (!phone) {
      return
    }
    track('Feedback', 'Smartphone', 'copy', {
      property: 'phone',
      value: phone,
    })
    navigator.clipboard.writeText(phone + '')
  }

  const avatarHue =
    360 * (((contactName?.[0]?.toLowerCase() ?? 'a').charCodeAt(0) - 97) / 25)

  return (
    <div className="SmartphoneActionBar">
      <div
        className="SmartphoneActionBar__avatar"
        style={
          {
            '--avatar-hue': avatarHue,
          } as React.CSSProperties
        }
      >
        {contactName?.[0] || <Loader color="white" />}
      </div>
      <div
        className="SmartphoneActionBar__receiver_name"
        onClick={copyContactName}
      >
        {contactName}
        <button
          className="SmartphoneActionBar__copy_button"
          title={`Copiar "${contactName}"`}
        >
          Copiar
        </button>
      </div>
      <div
        className="SmartphoneActionBar__receiver_status"
        onClick={copyPhone}
        title={`Copiar "${phone}"`}
      >
        <span className="SmartphoneActionBar__receiver_phone">
          <Icon icon="mdi:phone" /> {phone}
        </span>
        <button
          className="SmartphoneActionBar__copy_button"
          title={`Copiar "${phone}"`}
        >
          Copiar
        </button>
      </div>
      <div className="SmartphoneActionBar__actions"></div>
    </div>
  )
}

export default SmartphoneActionBar
