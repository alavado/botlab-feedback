import { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './DateRangeSelector.css'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import { formatRange } from './helpers'

const DateRangeSelector = () => {
  const [calendarVisible, setCalendarVisible] = useState(false)
  const { range } = useSelector((state: RootState) => state.interactions)

  return (
    <div className="DateRangeSelector">
      <div
        className="DateRangeSelector__input"
        onClick={() => setCalendarVisible(true)}
      >
        <InlineIcon
          className="DateRangeSelector__main_icon"
          icon="mdi:calendar"
        />
        <button className="DateRangeSelector__step_button DateRangeSelector__step_button--left">
          <InlineIcon icon="mdi:chevron-left" />
        </button>
        <span>{formatRange(range)}</span>
        <button className="DateRangeSelector__step_button DateRangeSelector__step_button--right">
          <InlineIcon icon="mdi:chevron-right" />
        </button>
      </div>
      <OutsideClickHandler
        disabled={!calendarVisible}
        onOutsideClick={() => {
          setCalendarVisible(false)
        }}
      >
        <div
          className={classNames({
            DateRangeSelector__calendar: true,
            'DateRangeSelector__calendar--visible': calendarVisible,
          })}
        >
          calendario
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default DateRangeSelector
