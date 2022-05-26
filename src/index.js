import React from 'react'
import ReactDOM from 'react-dom'
import './assets/fonts/fonts.css'
import './reset.css'
import './colores.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
