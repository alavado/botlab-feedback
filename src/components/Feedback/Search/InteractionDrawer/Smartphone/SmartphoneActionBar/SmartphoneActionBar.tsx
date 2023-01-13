import { Icon } from '@iconify/react'
import useAnalytics from '../../../../../../hooks/useAnalytics'
import Loader from '../../../../../Loader'
import './SmartphoneActionBar.css'

const SmartphoneActionBar = ({
  phone,
  contactName,
}: {
  phone?: string
  contactName?: string
}) => {
  const track = useAnalytics()

  return (
    <div className="Smartphone__actions_bar">
      <div
        className="Smartphone__avatar"
        style={
          {
            '--avatar-hue':
              360 *
              (((contactName?.[0].toLowerCase() ?? 'a').charCodeAt(0) - 97) /
                25),
          } as React.CSSProperties
        }
      >
        {contactName?.[0] || <Loader color="white" />}
      </div>
      <div className="Smartphone__receiver_name">
        {contactName}
        {contactName && (
          <button
            className="Smartphone__copy_button"
            onClick={() => {
              track('Feedback', 'Smartphone', 'copy', {
                property: 'patientName',
                value: contactName,
              })
              navigator.clipboard.writeText(contactName)
            }}
          >
            <Icon icon="mdi:content-copy" /> Copiar
          </button>
        )}
      </div>
      <div className="Smartphone__receiver_status">
        {phone && (
          <>
            <span className="Smartphone__receiver_phone">
              <Icon icon="mdi:phone" /> {phone}
            </span>
          </>
        )}
        {phone && (
          <button
            className="Smartphone__copy_button"
            onClick={() => {
              track('Feedback', 'Smartphone', 'copy', {
                property: 'phone',
                value: phone,
              })
              navigator.clipboard.writeText(phone + '')
            }}
          >
            <Icon icon="mdi:content-copy" /> Copiar
          </button>
        )}
      </div>
      <div className="Smartphone__actions"></div>
    </div>
  )
}

export default SmartphoneActionBar
