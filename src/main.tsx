import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Toaster position="top-right" />
            <App />
        </Provider>
    </React.StrictMode>
)
