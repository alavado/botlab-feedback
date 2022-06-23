import { Analytics } from "analytics"
import segmentPlugin from '@analytics/segment'
import { useSelector } from "react-redux"

const analytics = Analytics({
  app: 'Feedback',
  plugins: [
    segmentPlugin({
      writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY,
    }),
  ]
})

function useAnalytics() {
  const { nombreUsuario: usuario, cuenta } = useSelector(state => state.login)
  return (evento, parametros = {}) => {
    analytics.plugins.segment.group(usuario, {
      cuenta
    })
    analytics.track(
      evento,
      {
        usuario,
        cuenta,
        ...parametros
      }
    )
  }
}

export default useAnalytics