import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import { toggleAlertsSettings } from '../../../../redux/ducks/alerts'
import './ToggleSidebarButton.css'

const ToggleSidebarButton = () => {
  const dispatch = useDispatch()
  const { sidebarHidden } = useSelector((state: RootState) => state.alerts)

  if (!sidebarHidden) {
    return null
  }

  return (
    <button
      className="ToggleSidebarButton"
      onClick={() => dispatch(toggleAlertsSettings())}
      title="Abrir configuración"
    >
      <Icon icon="mdi:cog" />
    </button>
  )
}

export default ToggleSidebarButton
