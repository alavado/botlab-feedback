import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useIsMutating } from 'react-query'
import InteractionCommentIcon from '../InteractionComments/InteractionComment/InteractionCommentIcon'
import './IssueSubmissionAck.css'

const IssueSubmissionAck = () => {
  const isMutating = useIsMutating({
    mutationKey: 'issue',
  })

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isMutating) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [isMutating])

  return (
    <div
      className={classNames({
        IssueSubmissionAck: true,
        'IssueSubmissionAck--visible': visible,
      })}
    >
      ¡Gracias por tu reporte! <InteractionCommentIcon emoji="😊" />
      <button
        className="IssueSubmissionAck__close_button"
        onClick={() => setVisible(false)}
      >
        <Icon icon="mdi:close" />
      </button>
    </div>
  )
}

export default IssueSubmissionAck
