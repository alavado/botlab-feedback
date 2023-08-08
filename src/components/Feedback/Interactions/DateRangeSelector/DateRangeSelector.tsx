import { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './DateRangeSelector.css'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import { formatRange } from './helpers'
import {
  setNextDay,
  setPreviousDay,
} from '../../../../redux/ducks/interactions'

const DateRangeSelector = () => {
  const [calendarVisible, setCalendarVisible] = useState(false)
  const { range } = useSelector((state: RootState) => state.interactions)
  const dispatch = useDispatch()

  return (
    <div className="DateRangeSelector">
      <div className="DateRangeSelector__input">
        <button
          className="DateRangeSelector__step_button DateRangeSelector__step_button--left"
          onClick={() => dispatch(setPreviousDay())}
        >
          <InlineIcon icon="mdi:chevron-left" />
        </button>
        <span
          className="DateRangeSelector__date"
          onClick={() => setCalendarVisible(true)}
        >
          {formatRange(range)}
        </span>
        <button
          className="DateRangeSelector__step_button DateRangeSelector__step_button--right"
          onClick={() => dispatch(setNextDay())}
        >
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
