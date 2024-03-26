import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { App } from './App'
import { setupStore } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={setupStore()}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App/>
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>,
)
