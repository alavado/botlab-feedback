import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { MouseEventHandler } from 'react'
import './FilterCheckbox.css'

const FilterCheckbox = ({
  checked,
  partiallyChecked,
  onClick,
  label,
  icon,
  isTitle = false,
  countLabel = '',
}: {
  checked: boolean
  partiallyChecked?: boolean
  onClick: MouseEventHandler
  label: string
  icon?: string
  isTitle?: boolean
  countLabel?: string
}) => {
  let checkboxIcon = <></>
  if (checked) {
    checkboxIcon = (
      <Icon className="FilterCheckbox__square_check" icon="mdi:check-bold" />
    )
  } else if (partiallyChecked) {
    checkboxIcon = (
      <Icon className="FilterCheckbox__square_check" icon="mdi:minus" />
    )
  }

  return (
    <button
      className={classNames({
        FilterCheckbox: true,
        'FilterCheckbox--title': isTitle,
        'FilterCheckbox--filled': checked || partiallyChecked,
      })}
      onClick={onClick}
    >
      <div className="FilterCheckbox__square">{checkboxIcon}</div>
      <span className="FilterCheckbox__label">{label}</span>
      <span className="FilterCheckbox__count">
        {icon && <Icon icon={icon} />} {countLabel}
      </span>
    </button>
  )
}

export default FilterCheckbox
