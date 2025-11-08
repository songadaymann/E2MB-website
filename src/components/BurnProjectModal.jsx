import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Text,
  Link,
  Box,
} from '@chakra-ui/react'
import { useEffect, useMemo, useRef } from 'react'

function formatMintStatus(value) {
  if (value === null || value === undefined) return 'Unknown'
  return value ? 'Yes' : 'No'
}

function parseYouTubeTime(value) {
  if (!value) return null
  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const regex = /(\d+)(h|m|s)/g
  let match
  let totalSeconds = 0

  while ((match = regex.exec(value)) !== null) {
    const amount = Number(match[1])
    const unit = match[2]

    if (unit === 'h') totalSeconds += amount * 3600
    else if (unit === 'm') totalSeconds += amount * 60
    else if (unit === 's') totalSeconds += amount
  }

  return totalSeconds || null
}

function normaliseYouTubeParams(searchParams) {
  const params = new URLSearchParams(searchParams)
  const rawTime = params.get('t')
  if (rawTime) {
    const startSeconds = parseYouTubeTime(rawTime)
    params.delete('t')
    if (startSeconds !== null) {
      params.set('start', String(startSeconds))
    }
  }
  params.delete('si')
  return params.toString()
}

const EMBEDDABLE_HOSTS = new Set([
  'youtube.com',
  'youtu.be',
  'm.youtube.com',
  'music.youtube.com',
  'twitter.com',
  'x.com',
])

function toEmbedUrl(rawUrl) {
  if (!rawUrl) return null

  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace(/^www\./, '')

    if (!Array.from(EMBEDDABLE_HOSTS).some((domain) => host === domain || host.endsWith(`.${domain}`))) {
      return null
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.slice(1)
      const query = normaliseYouTubeParams(parsed.searchParams)
      return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`
    }

    if (host.endsWith('youtube.com')) {
      if (parsed.pathname === '/watch') {
        const videoId = parsed.searchParams.get('v')
        if (videoId) {
          parsed.searchParams.delete('v')
          const query = normaliseYouTubeParams(parsed.searchParams)
          return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`
        }
      } else if (parsed.pathname.startsWith('/shorts/')) {
        const videoId = parsed.pathname.split('/')[2]
        if (videoId) return `https://www.youtube.com/embed/${videoId}`
      } else if (parsed.pathname.startsWith('/embed/')) {
        return rawUrl
      }
    }

    if (host.endsWith('twitter.com') || host.endsWith('x.com')) {
      const tweetId = extractTweetIdFromUrl(parsed)
      if (tweetId) {
        return buildTwitterEmbedUrl(tweetId)
      }
      return null
    }

    return rawUrl
  } catch (error) {
    return rawUrl
  }
}

function extractTweetUrlFromHtml(html) {
  if (!html) return null
  const match = html.match(/https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^"\s]+\/status\/\d+/)
  return match ? match[0] : null
}

function extractTweetIdFromUrl(urlObjOrString) {
  try {
    const urlObj = typeof urlObjOrString === 'string' ? new URL(urlObjOrString) : urlObjOrString
    const parts = urlObj.pathname.split('/').filter(Boolean)
    const statusIndex = parts.findIndex((segment) => segment === 'status')
    if (statusIndex !== -1 && parts[statusIndex + 1]) {
      const idCandidate = parts[statusIndex + 1].split('?')[0]
      if (/^\d+$/.test(idCandidate)) {
        return idCandidate
      }
    }
  } catch (error) {
    return null
  }
  return null
}

function buildTwitterEmbedUrl(tweetId) {
  const params = new URLSearchParams({
    id: tweetId,
    theme: 'dark',
    dnt: 'true',
  })
  return `https://platform.twitter.com/embed/Tweet.html?${params.toString()}`
}

function ensureTwitterScript(container) {
  if (window.twttr?.widgets?.load) {
    window.twttr.widgets.load(container)
    return
  }

  const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
  if (existing) {
    existing.addEventListener(
      'load',
      () => window.twttr?.widgets?.load(container),
      { once: true }
    )
    return
  }

  const script = document.createElement('script')
  script.src = 'https://platform.twitter.com/widgets.js'
  script.async = true
  script.onload = () => window.twttr?.widgets?.load(container)
  document.body.appendChild(script)
}

function BurnProjectModal({ isOpen, onClose, project, projectKey }) {
  const hasProject = Boolean(project)
  const iframeUrl = project?.iframeUrl ? toEmbedUrl(project.iframeUrl) : null
  const iframeUrlEmbeddable = Boolean(iframeUrl)
  const embedRef = useRef(null)
  const tweetIframeUrl = useMemo(() => {
    if (!project?.embedHtml) return null
    const tweetUrl = extractTweetUrlFromHtml(project.embedHtml)
    if (!tweetUrl) return null
    const tweetId = extractTweetIdFromUrl(tweetUrl)
    if (tweetId) {
      return buildTwitterEmbedUrl(tweetId)
    }
    return null
  }, [project?.embedHtml])

  useEffect(() => {
    if (!project?.embedHtml || !isOpen || tweetIframeUrl) return
    const container = embedRef.current
    if (!container) return

    container.innerHTML = project.embedHtml
    ensureTwitterScript(container)

    return () => {
      container.innerHTML = ''
    }
  }, [project?.embedHtml, isOpen, tweetIframeUrl])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent bg="black" border="2px solid #FCB53B" color="white">
        <ModalHeader letterSpacing="0.3em" textTransform="uppercase">
          {project?.name || projectKey || 'Project details'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {hasProject ? (
            <Stack spacing={6} fontSize="md">
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={{ base: 4, md: 6 }}
                align={{ base: 'center', md: 'flex-start' }}
              >
                {project.image ? (
                  <Box
                    border="1px solid rgba(255,255,255,0.15)"
                    borderRadius="md"
                    overflow="hidden"
                    maxW="110px"
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      style={{ width: '100%', display: 'block' }}
                    />
                  </Box>
                ) : null}

                <Stack spacing={1} color="gray.200" textAlign={{ base: 'center', md: 'left' }}>
                  <Text>
                    <strong>Supply:</strong> {project.supply || 'TBD'}
                  </Text>
                  <Text>
                    <strong>Mint ended:</strong> {formatMintStatus(project.mintEnded)}
                  </Text>
                  <Text>
                    <strong>Type:</strong> {project.assetType || 'TBD'}
                  </Text>
                  <Text>
                    <strong>Contract:</strong>{' '}
                    {project.contractAddress ? (
                      <Link
                        href={`https://etherscan.io/address/${project.contractAddress}`}
                        isExternal
                        color="#FCB53B"
                      >
                        {project.contractAddress}
                      </Link>
                    ) : (
                      <span>TBD</span>
                    )}
                  </Text>
                  {project.openseaUrl ? (
                    <Text>
                      <strong>OpenSea:</strong>{' '}
                      <Link href={project.openseaUrl} isExternal color="#FCB53B">
                        View collection
                      </Link>
                    </Text>
                  ) : (
                    <Text color="gray.500">Add an OpenSea URL in burn-projects-data.js</Text>
                  )}
                </Stack>
              </Stack>

              {!project.image && (
                <Box
                  border="1px dashed rgba(255,255,255,0.2)"
                  borderRadius="md"
                  p={6}
                  textAlign="center"
                  color="gray.400"
                >
                  Drop an image URL in burn-projects-data.js to show artwork here.
                </Box>
              )}

              {tweetIframeUrl ? (
                <Box
                  as="iframe"
                  src={tweetIframeUrl}
                  title={`${project.name} tweet`}
                  style={{ width: '100%', minHeight: '420px', border: 'none' }}
                  allow="fullscreen"
                />
              ) : project?.embedHtml ? (
                <Box
                  ref={embedRef}
                  border="1px solid rgba(255,255,255,0.15)"
                  borderRadius="md"
                  p={4}
                  bg="rgba(255,255,255,0.03)"
                  minH="200px"
                />
              ) : iframeUrlEmbeddable ? (
                <Box
                  as="iframe"
                  src={iframeUrl}
                  title={`${project.name} media`}
                  style={{ width: '100%', minHeight: '400px', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <Box
                  border="1px dashed rgba(255,255,255,0.2)"
                  borderRadius="md"
                  p={6}
                  textAlign="center"
                  color="gray.400"
                >
                  {project?.iframeUrl ? (
                    <Text>
                      This link can’t be embedded due to the site’s security settings.{' '}
                      <Link href={project.iframeUrl} isExternal color="#FCB53B">
                        Open in a new tab
                      </Link>
                      .
                    </Text>
                  ) : (
                    <Text>Set an iframeUrl to embed a Twitter thread or YouTube video.</Text>
                  )}
                </Box>
              )}
            </Stack>
          ) : (
            <Box
              border="1px dashed rgba(255,255,255,0.2)"
              borderRadius="md"
              p={6}
              textAlign="center"
              color="gray.400"
            >
              <Text>
                No project data found. Add an entry for <code>{projectKey}</code> in burn-projects-data.js.
              </Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="outline" colorScheme="orange">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default BurnProjectModal
