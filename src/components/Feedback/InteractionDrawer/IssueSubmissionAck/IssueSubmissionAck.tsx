import classNames from 'classnames'
import { useState } from 'react'
import { useIsMutating } from 'react-query'
import InteractionCommentIcon from '../InteractionComments/InteractionComment/InteractionCommentIcon'
import './IssueSubmissionAck.css'

const IssueSubmissionAck = () => {

  const isMutating = useIsMutating({
    mutationKey: 'issue',
  })

  return (
    <div
      className={classNames({
        IssueSubmissionAck: true,
        'IssueSubmissionAck--visible': isMutating,
      })}
    >
      ¡Gracias por tu reporte! <InteractionCommentIcon emoji="😊" />
    </div>
  )
}

export default IssueSubmissionAck
