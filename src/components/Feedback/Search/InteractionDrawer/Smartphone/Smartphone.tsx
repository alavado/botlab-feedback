import classNames from 'classnames'
import { useState } from 'react'
import { Interaction } from '../../../../../api/types/servicio'
import './Smartphone.css'

const Smartphone = ({ interaction }: { interaction?: Interaction }) => {
  const [phoneColor, setPhoneColor] = useState('var(--whatsapp-color-celular)')

  const setRandomPhoneColor = () =>
    setPhoneColor(
      `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${
        255 * Math.random()
      })`
    )

  return (
    <div
      className="Smartphone"
      style={{ '--phone-color': phoneColor } as React.CSSProperties}
    >
      <div className="Smartphone__screen">
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l1"
          onClick={setRandomPhoneColor}
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l2"
          onClick={setRandomPhoneColor}
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l3"
          onClick={setRandomPhoneColor}
        />
        <button
          className="Smartphone__button Smartphone__button-r Smartphone__button-r1"
          onClick={() => setPhoneColor('var(--whatsapp-color-celular)')}
        />
        <div className="Smartphone__app_bar">
          <div>
            <div>10:10</div>
            <div>iconos</div>
          </div>
          <div>
            <div>{interaction?.botName}</div>
            <div>en línea</div>
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
