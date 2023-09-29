import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import useAnalytics from '../../../../hooks/useAnalytics'
import { RootState } from '../../../../redux/ducks'
import { showSettings } from '../../../../redux/ducks/alerts'
import './ToggleSidebarButton.css'

const ToggleSidebarButton = () => {
  const dispatch = useDispatch()
  const { settingsHidden } = useSelector((state: RootState) => state.alerts)
  const track = useAnalytics()

  if (!settingsHidden) {
    return null
  }

  return (
    <button
      className="ToggleSidebarButton"
      onClick={() => {
        track('Feedback', 'Alerts', 'showAlertSettings')
        dispatch(showSettings())
      }}
      title="Abrir configuración"
    >
      <Icon icon="mdi:cog" />
    </button>
  )
}

export default ToggleSidebarButton
