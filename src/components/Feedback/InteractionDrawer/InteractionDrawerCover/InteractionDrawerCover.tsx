import classNames from 'classnames'
import './InteractionDrawerCover.css'

const InteractionDrawerCover = ({ visible }: { visible: boolean }) => {
  return (
    <div
      className={classNames({
        InteractionDrawerCover: true,
        'InteractionDrawerCover--visible': visible,
      })}
    />
  )
}

export default InteractionDrawerCover
