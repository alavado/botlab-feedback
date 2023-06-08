import unreachableImage from '../../../../../assets/images/unreachable.png'
import './SmartphoneUnreachableMessage.css'

const SmartphoneUnreachableMessage = () => {
  return (
    <div className="SmartphoneUnreachableMessage">
      <div className="SmartphoneUnreachableMessage__image_container">
        <img
          className="SmartphoneUnreachableMessage__image"
          src={unreachableImage}
          alt="No pudimos contactar a este paciente"
        />
      </div>
      <div>
        <h3 className="SmartphoneUnreachableMessage__title">
          No pudimos contactar a este paciente
        </h3>
        <p className="SmartphoneUnreachableMessage__content">
          El número asociado no tiene Whatsapp
        </p>
      </div>
    </div>
  )
}

export default SmartphoneUnreachableMessage
