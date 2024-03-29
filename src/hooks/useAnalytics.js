import { Analytics } from "analytics"
import segmentPlugin from '@analytics/segment'
import { useSelector } from "react-redux"
import store from "../redux/store"
import { useCallback } from "react"

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
  analytics.identify(cuenta.toLowerCase())
}

function useAnalytics() {
  const { nombreUsuario: cliente, cuenta } = useSelector(state => state.login)
  return useCallback((app, seccion, evento, parametros = {}) => {
    if (!cuenta || cuenta.endsWith('cero') || cuenta.endsWith('botlab')) {
      return
    }
    analytics.track(
      [app, seccion, evento].join('-'),
      {
        cliente,
        cuenta: cuenta.toLowerCase(),
        url: window.location.href,
        ...parametros
      }
    )
  }, [cliente, cuenta])
}

export default useAnalytics