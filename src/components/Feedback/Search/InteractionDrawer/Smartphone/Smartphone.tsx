import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useState } from 'react'
import { Interaction } from '../../../../../api/types/servicio'
import './Smartphone.css'

const Smartphone = ({ interaction }: { interaction?: Interaction }) => {
  const [phoneColor, setPhoneColor] = useState([0, 0, 10])

  const setRandomPhoneColor = () =>
    setPhoneColor([
      360 * Math.random(),
      25 + 75 * Math.random(),
      75 * Math.random(),
    ])

  return (
    <div
      className="Smartphone"
      style={
        {
          '--phone-color': `hsl(${phoneColor[0]}, ${phoneColor[1]}%, ${phoneColor[2]}%)`,
        } as React.CSSProperties
      }
    >
      <div className="Smartphone__screen">
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l1"
          onClick={setRandomPhoneColor}
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l2"
          onClick={() =>
            setPhoneColor((c) => [c[0], c[1], Math.min(75, c[2] + 5)])
          }
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l3"
          onClick={() =>
            setPhoneColor((c) => [c[0], c[1], Math.min(75, c[2] - 5)])
          }
        />
        <button
          className="Smartphone__button Smartphone__button-r Smartphone__button-r1"
          onClick={() => setPhoneColor([0, 0, 10])}
        />
        <div className="Smartphone__app_bar">
          <div className="Smartphone__nav_bar">
            <div className="Smartphone__nav_bar_time">15:40</div>
            <div className="Smartphone__camera">
              {interaction?.pollId} / {interaction?.userId}
            </div>
            <div className="Smartphone__nav_bar_icons">
              <Icon icon="mdi:wifi" />
              <Icon icon="mdi:signal" />
              <Icon icon="mdi:battery" />
            </div>
          </div>
          <div className="Smartphone__actions_bar">
            <div className="Smartphone__avatar" />
            <div className="Smartphone__receiver_name">
              {interaction?.botName || '...'}
            </div>
            <div className="Smartphone__receiver_status">en línea</div>
            <div className="Smartphone__actions"></div>
          </div>
        </div>
        <div className="Smartphone__messages_container">
          {interaction?.messages?.map((message) => (
            <div
              className={classNames({
                Smartphone__message: true,
                'Smartphone__message--outbound': message.sender === 'USER',
              })}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Smartphone
