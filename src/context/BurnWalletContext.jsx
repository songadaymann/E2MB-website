import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useToast } from '@chakra-ui/react'

const BurnWalletContext = createContext(null)

const EMPTY_WORDS = Array(7).fill('')

const mockNotes = [
  {
    tokenId: '1001',
    label: 'Note #1001',
    revealYear: 2040,
    hasSevenWords: true,
    sevenWords: ['time', 'keeps', 'slipping', 'forward', 'into', 'bright', 'futures'],
  },
  {
    tokenId: '1450',
    label: 'Note #1450',
    revealYear: 2045,
    hasSevenWords: false,
    sevenWords: EMPTY_WORDS,
  },
]

const mockProjectHoldings = [
  { key: 'fuckinTrolls', balance: 2 },
  { key: 'taxesCoin', balance: 15 },
  { key: 'soundEditions', balance: 1 },
]

export function BurnWalletProvider({ children }) {
  const toast = useToast()
  const [walletAddress, setWalletAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [notes, setNotes] = useState([])
  const [projectHoldings, setProjectHoldings] = useState([])

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: 'Wallet not found',
        description: 'Install MetaMask or another web3 wallet to continue.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    try {
      setIsConnecting(true)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const [account] = accounts
      setWalletAddress(account)
      setNotes(mockNotes)
      setProjectHoldings(mockProjectHoldings)
    } catch (error) {
      toast({
        title: 'Unable to connect',
        description: error?.message || 'User rejected connection request',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsConnecting(false)
    }
  }, [toast])

  const value = useMemo(
    () => ({
      walletAddress,
      isConnecting,
      connectWallet,
      notes,
      projectHoldings,
    }),
    [walletAddress, isConnecting, connectWallet, notes, projectHoldings]
  )

  return <BurnWalletContext.Provider value={value}>{children}</BurnWalletContext.Provider>
}

export function useBurnWallet() {
  const context = useContext(BurnWalletContext)
  if (!context) {
    throw new Error('useBurnWallet must be used within a BurnWalletProvider')
  }
  return context
}
