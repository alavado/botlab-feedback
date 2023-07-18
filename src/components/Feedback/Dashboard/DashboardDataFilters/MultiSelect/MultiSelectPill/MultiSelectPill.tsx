import { Icon } from '@iconify/react'
import { getPillStyle } from '../utils'
import './MultiSelectPill.css'

const MultiSelectPill = ({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) => {
  return (
    <span className="MultiSelectPill" style={getPillStyle(label)}>
      {label}{' '}
      <button
        className="MultiSelectPill__button"
        onClick={onRemove}
        title={`Remover "${label}"`}
      >
        <Icon icon="mdi:close" />
      </button>
    </span>
  )
}

export default MultiSelectPill
