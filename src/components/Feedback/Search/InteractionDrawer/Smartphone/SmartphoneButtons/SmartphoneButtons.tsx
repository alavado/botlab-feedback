import useAnalytics from '../../../../../../hooks/useAnalytics'
import './SmartphoneButtons.css'

const SmartphoneButtons = ({
  phoneColor,
  setPhoneColor,
}: {
  phoneColor: number[]
  setPhoneColor: Function
}) => {
  const track = useAnalytics()

  const setRandomPhoneColor = () =>
    setPhoneColor([
      360 * Math.random(),
      25 + 75 * Math.random(),
      75 * Math.random(),
    ])

  return (
    <div className="SmartphoneButtons">
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--l SmartphoneButtons__button--l1"
        onClick={() => {
          track('Feedback', 'Smartphone', 'colorRandomizer')
          setRandomPhoneColor()
        }}
      />
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--l SmartphoneButtons__button--l2"
        onClick={() => {
          track('Feedback', 'Smartphone', 'colorLightningUp')
          setPhoneColor((c: number[]) => [c[0], c[1], Math.min(75, c[2] + 5)])
        }}
      />
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--l SmartphoneButtons__button--l3"
        onClick={() => {
          track('Feedback', 'Smartphone', 'colorLightningDown')
          setPhoneColor((c: number[]) => [c[0], c[1], Math.min(75, c[2] - 5)])
        }}
      />
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--r SmartphoneButtons__button--r1"
        onClick={() => {
          track('Feedback', 'Smartphone', 'colorReset')
          setPhoneColor([0, 0, 10])
        }}
      />
    </div>
  )
}

export default SmartphoneButtons
