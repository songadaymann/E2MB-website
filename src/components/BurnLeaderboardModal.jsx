import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Stack,
  Badge,
} from '@chakra-ui/react'
import { mockLeaderboard } from './BurnLeaderboard'

function BurnLeaderboardModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent bg="#111" color="white" border="1px solid rgba(255,255,255,0.2)">
        <ModalHeader textTransform="uppercase" letterSpacing="0.35em">
          leaderboard
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={3}>
            <Text fontSize="sm" color="gray.400">
              mock data until points overlay connects.
            </Text>
            <Box overflow="auto" border="1px solid rgba(255,255,255,0.1)" borderRadius="md">
              <Table size="sm" variant="simple">
                <Thead bg="rgba(255,255,255,0.05)">
                  <Tr>
                    <Th color="#FCB53B" textTransform="uppercase" letterSpacing="0.25em" fontSize="xs">
                      Rank
                    </Th>
                    <Th color="#FCB53B" textTransform="uppercase" letterSpacing="0.25em" fontSize="xs">
                      Name
                    </Th>
                    <Th color="#FCB53B" textTransform="uppercase" letterSpacing="0.25em" fontSize="xs" isNumeric>
                      Reveal Year
                    </Th>
                    <Th color="#FCB53B" textTransform="uppercase" letterSpacing="0.25em" fontSize="xs" isNumeric>
                      $Time
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mockLeaderboard.map((entry) => (
                    <Tr key={entry.rank} _hover={{ bg: 'rgba(255,255,255,0.04)' }}>
                      <Td>{entry.rank}</Td>
                      <Td>
                        <Stack direction="row" spacing={2} align="center">
                          <Badge colorScheme={entry.rank <= 3 ? 'orange' : 'gray'} variant={entry.rank <= 3 ? 'solid' : 'subtle'}>
                            {entry.rank <= 3 ? 'Top' : 'Rank'} {entry.rank}
                          </Badge>
                          <Text noOfLines={1}>{entry.address}</Text>
                        </Stack>
                      </Td>
                      <Td isNumeric>{entry.revealYear}</Td>
                      <Td isNumeric>{entry.timeAmount}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default BurnLeaderboardModal
