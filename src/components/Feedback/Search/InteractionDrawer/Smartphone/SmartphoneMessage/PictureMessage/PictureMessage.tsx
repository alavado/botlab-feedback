import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useState } from 'react'
import useAnswerMediaQuery from '../../../../../../../api/hooks/useAnswerMediaQuery'
import './PictureMessage.css'

const PictureMessage = ({ answerId }: { answerId: number }) => {
  const [pictureVisible, setVisible] = useState(false)
  const { data, isLoading } = useAnswerMediaQuery(answerId)

  if (isLoading) {
    return <p>cargando...</p>
  }

  return (
    <div className="PictureMessage">
      <button
        className={classNames({
          PictureMessage__close_button: true,
          'PictureMessage__close_button--visible': pictureVisible,
        })}
        onClick={() => setVisible(false)}
        title="Ocultar imagen"
      >
        <Icon icon="mdi:eye-off" />
      </button>
      <div
        className={classNames({
          PictureMessage__warning: true,
          'PictureMessage__warning--visible': !pictureVisible,
        })}
      >
        <Icon icon="mdi:eye-off" />
        <p>Paciente envió imagen</p>
        <p>Haz click para ver</p>
      </div>
      <img
        onClick={() => setVisible(true)}
        className={classNames({
          PictureMessage__image: true,
          'PictureMessage__image--visible': pictureVisible,
        })}
        src={data?.url}
        alt="Imagen enviada por paciente"
      />
    </div>
  )
}

export default PictureMessage
