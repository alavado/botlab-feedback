import { useEffect, useRef, useState } from 'react'
import './ReportIssueDialog.css'
import useReportIssueMutation from '../../../../../api/hooks/useReportIssueMutation'
import useAnalytics from '../../../../../hooks/useAnalytics'
import logoCero from '../../../../../assets/images/logo.png'
import { Icon } from '@iconify/react'
import classNames from 'classnames'

const ReportIssueDialog = ({
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

  const reportIssue = () => {
    onClose()
    mutate({
      description,
    })
  }

  return (
    <form
      className={classNames({
        ReportIssueDialog: true,
        'ReportIssueDialog--visible': visible,
      })}
      onSubmit={(e) => {
        e.preventDefault()
        track('Feedback', originComponentName, 'reportIssue')
        reportIssue()
      }}
    >
      <button
        className="ReportIssueDialog__close_button"
        onClick={() => onClose()}
        type="button"
      >
        <Icon icon="mdi:close" />
      </button>
      <h2 className="ReportIssueDialog__title">
        Reportar problema a{' '}
        <img src={logoCero} alt="CERO" className="ReportIssueDialog__logo" />
      </h2>
      <textarea
        className="ReportIssueDialog__input"
        ref={inputRef}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Por favor descríbenos el problema que encontraste en esta interacción"
      />
      <button className="ReportIssueDialog__submit_button" type="submit">
        <Icon icon="mdi:alert" /> Reportar problema
      </button>
    </form>
  )
}

export default ReportIssueDialog
