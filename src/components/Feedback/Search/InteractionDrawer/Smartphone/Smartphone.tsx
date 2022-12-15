import { Interaction } from '../../../../../api/types/servicio'
import './Smartphone.css'

const Smartphone = ({ interaction }: { interaction?: Interaction }) => {
  return (
    <div className="Smartphone">
      <div className="Smartphone__screen">
        <div className="Smartphone__app_bar"></div>
        <div className="Smartphone__messages_container"></div>
      </div>
    </div>
  )
}

export default Smartphone
