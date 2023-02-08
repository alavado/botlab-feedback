import useAnalytics from '../../../../../hooks/useAnalytics'
import './SmartphoneButtons.css'

const phoneColorLightningVariation = 5

const SmartphoneButtons = ({ setPhoneColor }: { setPhoneColor: Function }) => {
  const track = useAnalytics()

  const setRandomPhoneColor = () => {
    track('Feedback', 'Smartphone', 'colorRandomizer')
    setPhoneColor([
      360 * Math.random(),
      25 + 75 * Math.random(),
      75 * Math.random(),
    ])
  }

  const changeLightning = (amount: number) => {
    track(
      'Feedback',
      'Smartphone',
      `colorLightning${amount > 0 ? 'Up' : 'Down'}`
    )
    setPhoneColor((c: number[]) => [c[0], c[1], Math.min(75, c[2] + amount)])
  }

  const increaseLightning = () => changeLightning(phoneColorLightningVariation)
  const decreaseLightning = () => changeLightning(-phoneColorLightningVariation)

  const resetPhoneColor = () => {
    track('Feedback', 'Smartphone', 'colorReset')
    setPhoneColor([0, 0, 10])
  }

  return (
    <div className="SmartphoneButtons">
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--l SmartphoneButtons__button--l1"
        onClick={setRandomPhoneColor}
      />
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--l SmartphoneButtons__button--l2"
        onClick={increaseLightning}
      />
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--l SmartphoneButtons__button--l3"
        onClick={decreaseLightning}
      />
      <button
        className="SmartphoneButtons__button SmartphoneButtons__button--r SmartphoneButtons__button--r1"
        onClick={resetPhoneColor}
      />
    </div>
  )
}

export default SmartphoneButtons
