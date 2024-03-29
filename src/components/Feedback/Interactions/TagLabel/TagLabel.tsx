import { Icon } from '@iconify/react'
import { CSSProperties } from 'react'
import './TagLabel.css'
import { getPresentationForTag } from './utils'

const TagLabel = ({ tag }: { tag?: string }) => {
  const { colorVar, icon, label } = getPresentationForTag({ tag })

  if (!label) {
    return null
  }

  return (
    <div
      className="TagLabel"
      style={{ background: `var(${colorVar})` } as CSSProperties}
    >
      <Icon icon={icon} /> {label}
    </div>
  )
}

export default TagLabel
