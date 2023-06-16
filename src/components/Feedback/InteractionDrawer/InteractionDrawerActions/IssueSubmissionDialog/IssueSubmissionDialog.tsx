import { useEffect, useRef, useState } from 'react'
import './IssueSubmissionDialog.css'
import useReportIssueMutation from '../../../../../api/hooks/useReportIssueMutation'
import useAnalytics from '../../../../../hooks/useAnalytics'
import logoCero from '../../../../../assets/images/logo.png'
import { Icon } from '@iconify/react'
import classNames from 'classnames'

const IssueSubmissionDialog = ({
  originComponentName,
  visible,
  onClose,
}: {
  originComponentName: string
  visible: boolean
  onClose: Function
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { mutate } = useReportIssueMutation()
  const [description, setDescription] = useState('')
  const track = useAnalytics()

  useEffect(() => {
    inputRef.current?.focus()
  }, [visible])

  const reportIssue = async () => {
    mutate({
      description,
    })
    onClose()
  }

  return (
    <form
      className={classNames({
        IssueSubmissionDialog: true,
        'IssueSubmissionDialog--visible': visible,
      })}
      onSubmit={(e) => {
        e.preventDefault()
        track('Feedback', originComponentName, 'reportIssue')
        reportIssue()
      }}
    >
      <button
        className="IssueSubmissionDialog__close_button"
        onClick={() => onClose()}
        type="button"
      >
        <Icon icon="mdi:close" />
      </button>
      <h2 className="IssueSubmissionDialog__title">
        Reportar problema a{' '}
        <img src={logoCero} alt="CERO" className="IssueSubmissionDialog__logo" />
      </h2>
      <textarea
        className="IssueSubmissionDialog__input"
        ref={inputRef}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Por favor descríbenos el problema que encontraste en esta interacción"
      />
      <button className="IssueSubmissionDialog__submit_button" type="submit">
        <Icon icon="mdi:alert" /> Reportar problema
      </button>
    </form>
  )
}

export default IssueSubmissionDialog
