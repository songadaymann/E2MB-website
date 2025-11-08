import { Box, Stack, Text, Flex } from '@chakra-ui/react'

const START_YEAR = 2026

export const mockLeaderboard = Array.from({ length: 30 }, (_, index) => {
  const rank = index + 1
  const revealYear = START_YEAR + index
  return {
    rank,
    address: rank % 3 === 0 ? `holder-${rank}.eth` : `0xAB${(1000 + rank).toString(16)}...${(9000 + rank).toString(16)}`,
    revealYear,
    timeAmount: 120 - index * 2,
  }
})

function BurnLeaderboard() {
  const previewEntries = mockLeaderboard.slice(0, 4)

  return (
    <Stack spacing={4} height="100%" px={4} py={4} justify="center">
      <Box textAlign="center">
        <Text fontSize="1.6rem" fontWeight="900" letterSpacing="0.35em" textTransform="uppercase">
          reveal queue
        </Text>
        <Text fontSize="0.85rem" color="rgba(255,255,255,0.7)" letterSpacing="0.3em" textTransform="uppercase">
          tap to open leaderboard
        </Text>
      </Box>

      <Stack spacing={2}>
        {previewEntries.map((entry) => (
          <Flex
            key={entry.rank}
            align="center"
            justify="space-between"
            border="1px solid rgba(255,255,255,0.2)"
            borderRadius="md"
            px={3}
            py={2}
            bg="rgba(255,255,255,0.02)"
          >
            <Box textAlign="left">
              <Text fontSize="xs" letterSpacing="0.2em" textTransform="uppercase" color="#FCB53B">
                {entry.revealYear}
              </Text>
              <Text fontSize="lg" fontWeight="700" noOfLines={1}>
                {entry.address}
              </Text>
            </Box>
            <Text fontSize="sm" color="rgba(255,255,255,0.7)">
              #{entry.rank}
            </Text>
          </Flex>
        ))}
      </Stack>

      <Text textAlign="center" fontSize="xs" color="gray.500">
        (full stats open in modal)
      </Text>
    </Stack>
  )
}

export default BurnLeaderboard
