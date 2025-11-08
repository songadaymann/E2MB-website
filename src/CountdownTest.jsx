import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react'
import Countdown from './components/Countdown'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'white',
      },
    },
  },
})

function CountdownTest() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="black" display="flex" alignItems="center" justifyContent="center">
        <Box width="512px" height="512px" border="2px solid white">
          <Countdown />
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default CountdownTest
