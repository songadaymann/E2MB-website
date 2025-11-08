import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { burnProjectDetails } from '../burn-projects-data'

import { useBurnWallet } from '../context/BurnWalletContext'

const EMPTY_WORDS = Array(7).fill('')

function BurnNotesManager() {
  const { walletAddress, connectWallet, isConnecting, notes, projectHoldings } = useBurnWallet()
  const [selectedNoteId, setSelectedNoteId] = useState('')
  const [selectedProjectKey, setSelectedProjectKey] = useState('')
  const [burnAmount, setBurnAmount] = useState('')
  const [wordsDraft, setWordsDraft] = useState(EMPTY_WORDS)
  const toast = useToast()

  const selectedNote = useMemo(
    () => notes.find((note) => note.tokenId === selectedNoteId) || null,
    [notes, selectedNoteId]
  )

  const eligibleProjects = useMemo(() => {
    if (!projectHoldings.length) return []
    return projectHoldings
      .map((holding) => {
        const project = burnProjectDetails[holding.key]
        if (!project) return null
        return {
          key: holding.key,
          name: project.name,
          balance: holding.balance,
        }
      })
      .filter(Boolean)
  }, [projectHoldings])

  useEffect(() => {
    if (selectedNote?.hasSevenWords && selectedNote.sevenWords?.length) {
      setWordsDraft(selectedNote.sevenWords)
    } else {
      setWordsDraft(EMPTY_WORDS)
    }
  }, [selectedNote])

  const handleChangeWord = (index, value) => {
    setWordsDraft((current) => {
      const clone = [...current]
      clone[index] = value
      return clone
    })
  }

  const handleCommitSevenWords = () => {
    if (!selectedNote) return
    if (wordsDraft.some((word) => !word.trim())) {
      toast({
        title: 'Seven words required',
        description: 'Please fill in all seven words before committing.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }
    toast({
      title: 'Commit initiated',
      description: 'Trigger on-chain transaction here to set seven words.',
      status: 'info',
      duration: 4000,
      isClosable: true,
    })
  }

  const handleBurn = () => {
    if (!selectedProjectKey) {
      toast({
        title: 'Select a project',
        description: 'Choose which project to burn from the dropdown.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    if (!burnAmount || Number(burnAmount) <= 0) {
      toast({
        title: 'Enter an amount',
        description: 'Specify how many tokens/NFTs you intend to burn.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    toast({
      title: 'Burn initiated',
      description: 'Hook up the burn transaction here to award $TIME points.',
      status: 'info',
      duration: 4000,
      isClosable: true,
    })
  }

  if (!walletAddress) {
    return (
      <Stack spacing={4} align="center" justify="center" height="100%" textAlign="center">
        <Text fontSize="lg" fontWeight="bold">
          Connect your wallet to see your notes
        </Text>
        <Button
          colorScheme="orange"
          variant="outline"
          onClick={connectWallet}
          isLoading={isConnecting}
        >
          Connect Wallet
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={5} height="100%" justify="space-between" px={4} py={3}>
      <Stack spacing={3}>
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          You are holding {notes.length} notes. Please choose a note to apply $TIME to.
        </Text>

        <FormControl>
          <FormLabel fontSize="sm">Select Note</FormLabel>
          <Select
            placeholder="Choose a note"
            value={selectedNoteId}
            onChange={(event) => setSelectedNoteId(event.target.value)}
            bg="rgba(255,255,255,0.05)"
            borderColor="rgba(252, 181, 59, 0.45)"
            color="white"
          >
            {notes.map((note) => (
              <option key={note.tokenId} value={note.tokenId}>
                {note.label}
              </option>
            ))}
          </Select>
        </FormControl>

        {selectedNote && !selectedNote.hasSevenWords && (
          <Stack spacing={3} mt={2}>
            <Text fontWeight="bold">
              You need to set your seven words to get $TIME. These words live forever alongside your
              note and feed the seed that creates it.
            </Text>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
              {wordsDraft.map((word, index) => (
                <Input
                  key={index}
                  placeholder={`Word ${index + 1}`}
                  value={word}
                  onChange={(event) => handleChangeWord(index, event.target.value)}
                  bg="rgba(255,255,255,0.05)"
                  borderColor="rgba(252, 181, 59, 0.45)"
                  color="white"
                />
              ))}
            </SimpleGrid>
            <Button colorScheme="orange" variant="solid" onClick={handleCommitSevenWords}>
              Commit seven words
            </Button>
          </Stack>
        )}

        {selectedNote && selectedNote.hasSevenWords && (
          <Stack spacing={3} mt={2}>
            <Text fontWeight="bold">
              You are holding {eligibleProjects.length} projects that are eligible to burn. Choose one
              and enter how much you want to burn.
            </Text>
            <FormControl>
              <FormLabel fontSize="sm">Eligible projects</FormLabel>
              <Select
                placeholder="Select a project"
                value={selectedProjectKey}
                onChange={(event) => setSelectedProjectKey(event.target.value)}
                bg="rgba(255,255,255,0.05)"
                borderColor="rgba(252, 181, 59, 0.45)"
                color="white"
              >
                {eligibleProjects.map((project) => (
                  <option key={project.key} value={project.key}>
                    {project.name} — holding {project.balance}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Amount to burn</FormLabel>
              <Input
                type="number"
                min="0"
                step="1"
                value={burnAmount}
                onChange={(event) => setBurnAmount(event.target.value)}
                bg="rgba(255,255,255,0.05)"
                borderColor="rgba(252, 181, 59, 0.45)"
                color="white"
              />
            </FormControl>

            <Button colorScheme="orange" variant="solid" onClick={handleBurn}>
              Burn for $TIME
            </Button>
          </Stack>
        )}
      </Stack>

      <Box textAlign="center" fontSize="xs" color="gray.500">
        (Wallet, note data, seven-word commit, and burn flow are placeholders—wire up actual
        contract calls here.)
      </Box>
    </Stack>
  )
}

export default BurnNotesManager
