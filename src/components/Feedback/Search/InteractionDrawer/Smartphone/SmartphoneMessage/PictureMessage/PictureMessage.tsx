import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useState } from 'react'
import useAnswerMediaQuery from '../../../../../../../api/hooks/useAnswerMediaQuery'
import './PictureMessage.css'

const PictureMessage = ({ answerId }: { answerId: number }) => {
  const [visible, setVisible] = useState(false)
  const { data, isLoading } = useAnswerMediaQuery(answerId)

  if (isLoading) {
    return <p>cargando...</p>
  }

  return (
    <div className="PictureMessage">
      <button
        className={classNames({
          PictureMessage__close_button: true,
          'PictureMessage__close_button--visible': visible,
        })}
        onClick={() => setVisible(false)}
        title="Ocultar imagen"
      >
        <Icon icon="mdi:eye-off" />
      </button>
      <img
        onClick={() => setVisible(true)}
        className={classNames({
          PictureMessage__image: true,
          'PictureMessage__image--visible': visible,
        })}
        src={data?.url}
        alt="Imagen enviada por paciente"
      />
    </div>
  )
}

export default PictureMessage
