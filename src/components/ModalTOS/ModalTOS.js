import Modal from 'react-modal'
import './ModalTOS.css'
// import { Document, Page } from 'react-pdf'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

const ModalTOS = () => {
  return (
    <Modal
      isOpen={true}
      onAfterOpen={true}
      // style={customStyles}
      contentLabel="Example Modal"
      style={customStyles}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2>Términos del servicio</h2>
        <button onClick={() => null}>close</button>
        <div>
          {/* <Document file="empathy.pdf">
            <Page />
          </Document> */}
        </div>
        <form>
          <div>
            Ingresa tu email:
            <input type="email" />
          </div>
          <button>Acepto los términos</button>
        </form>
      </div>
    </Modal>
  )
}

export default ModalTOS
