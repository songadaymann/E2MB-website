import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App'
import Burn from './Burn'

const theme = extendTheme({
  fonts: {
    heading: '"Martel Sans", "Noto Music", sans-serif',
    body: '"Martel Sans", "Noto Music", sans-serif',
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

const basePathRaw = import.meta.env.BASE_URL || '/'
const basePath = basePathRaw === '/' ? '/' : basePathRaw.replace(/\/+$/, '')
const rawPath = window.location.pathname

const relativePath = (() => {
  if (basePath && basePath !== '/' && rawPath.startsWith(basePath)) {
    const stripped = rawPath.slice(basePath.length) || '/'
    return stripped.startsWith('/') ? stripped : `/${stripped}`
  }
  return rawPath
})()

const normalisedPath = relativePath.replace(/\/+$/, '') || '/'
const RootComponent = normalisedPath === '/burn' ? Burn : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RootComponent />
    </ChakraProvider>
  </React.StrictMode>,
)
