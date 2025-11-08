import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App'
import Burn from './Burn'

const theme = extendTheme({
  fonts: {
    heading: '"Martel Sans", sans-serif',
    body: '"Martel Sans", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'white',
      },
    },
  },
})

const normalisedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const RootComponent = normalisedPath === '/burn' ? Burn : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RootComponent />
    </ChakraProvider>
  </React.StrictMode>,
)
