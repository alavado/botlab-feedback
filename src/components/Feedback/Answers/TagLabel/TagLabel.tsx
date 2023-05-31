import { Icon } from '@iconify/react'
import { CSSProperties } from 'react'
import { Tag } from '../../../../api/types/types'
import './TagLabel.css'
import { getPresentationForTag } from './utils'

const TagLabel = ({ tag }: { tag: Tag | unknown }) => {

  

  const { colorVar, icon, label } = getPresentationForTag({ tag })

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
