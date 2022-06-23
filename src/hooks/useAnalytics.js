import { Analytics } from "analytics"
import segmentPlugin from '@analytics/segment'
import { useSelector } from "react-redux"
import store from "../redux/store"

const analytics = Analytics({
  app: 'Feedback',
  plugins: [
    segmentPlugin({
      writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY,
    }),
  ]
})
const cuenta = store.getState().login.cuenta
if (cuenta) {
  analytics.identify(cuenta)
}

function useAnalytics() {
  const { nombreUsuario: usuario, cuenta } = useSelector(state => state.login)
  return (app, seccion, evento, parametros = {}) => {
    analytics.track(
      [app, seccion, evento].join('-'),
      {
        usuario,
        cuenta,
        url: window.location.href,
        ...parametros
      }
    )
  }
}

export default useAnalytics