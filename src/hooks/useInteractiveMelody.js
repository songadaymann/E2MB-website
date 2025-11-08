import { useCallback, useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@chakra-ui/react'
import { generateBeat, mixSeeds } from '../lib/songAlgorithm'

const MIN_RELEASE = 0.12
const MAX_RELEASE = 1.5

function randomUint32() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] >>> 0
  }
  return Math.floor(Math.random() * 0xffffffff) >>> 0
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function midiToFrequency(pitch) {
  return 440 * Math.pow(2, (pitch - 69) / 12)
}

export function useInteractiveMelody(options = {}) {
  const { transpose = 0 } = options
  const prefersReducedMotion = usePrefersReducedMotion()
  const toneRef = useRef(null)
  const instrumentsPromiseRef = useRef(null)
  const leadSynthRef = useRef(null)
  const bassSynthRef = useRef(null)
  const leadFilterRef = useRef(null)
  const leadChorusRef = useRef(null)
  const bassFilterRef = useRef(null)
  const bassFeedbackRef = useRef(null)
  const bassAmpEnvelopeRef = useRef(null)
  const reverbRef = useRef(null)
  const seedRef = useRef(randomUint32())
  const beatRef = useRef(0)
  const lastTriggerAtRef = useRef(null)

  useEffect(() => () => {
    if (leadSynthRef.current) {
      leadSynthRef.current.dispose()
      leadSynthRef.current = null
    }
    if (bassSynthRef.current) {
      bassSynthRef.current.dispose()
      bassSynthRef.current = null
    }
    if (leadFilterRef.current) {
      leadFilterRef.current.dispose()
      leadFilterRef.current = null
    }
    if (leadChorusRef.current) {
      leadChorusRef.current.dispose()
      leadChorusRef.current = null
    }
    if (bassFilterRef.current) {
      bassFilterRef.current.dispose()
      bassFilterRef.current = null
    }
    if (bassFeedbackRef.current) {
      bassFeedbackRef.current.dispose()
      bassFeedbackRef.current = null
    }
    if (bassAmpEnvelopeRef.current) {
      bassAmpEnvelopeRef.current.dispose()
      bassAmpEnvelopeRef.current = null
    }
    if (reverbRef.current) {
      reverbRef.current.dispose()
      reverbRef.current = null
    }
    if (toneRef.current && toneRef.current.getContext) {
      toneRef.current = null
    }
  }, [])

  const ensureInstruments = useCallback(() => {
    if (prefersReducedMotion) return Promise.resolve(null)
    if (leadSynthRef.current && bassSynthRef.current && toneRef.current) {
      return Promise.resolve(toneRef.current)
    }
    if (!instrumentsPromiseRef.current) {
      instrumentsPromiseRef.current = import('tone')
        .then((module) => module.default ?? module)
        .then((Tone) => {
          toneRef.current = Tone

          const leadSynth = new Tone.PolySynth(Tone.FMSynth, {
            harmonicity: 5,
            modulationIndex: 8,
            oscillator: {
              type: 'sine',
            },
            modulation: {
              type: 'triangle',
            },
            envelope: {
              attack: 0.002,
              decay: 0.32,
              sustain: 0.18,
              release: 0.55,
            },
            modulationEnvelope: {
              attack: 0.005,
              decay: 0.22,
              sustain: 0.08,
              release: 0.25,
            },
          })
          leadSynth.volume.value = -12

          const leadFilter = new Tone.Filter({
            type: 'lowpass',
            frequency: 900,
            rolloff: -24,
            Q: 0.7,
          })

          const leadChorus = new Tone.Chorus({
            frequency: 1.1,
            delayTime: 3.2,
            depth: 0.25,
            type: 'sine',
            spread: 60,
          }).start()

          const masterReverb = new Tone.Reverb({
            decay: 1.25,
            preDelay: 0.02,
            wet: 0.15,
          }).toDestination()

          leadSynth.chain(leadFilter, leadChorus, Tone.Destination)
          leadChorus.connect(masterReverb)

          const bassSynth = new Tone.FMSynth({
            harmonicity: 1.5,
            modulationIndex: 4.5,
            oscillator: { type: 'triangle' },
            modulation: { type: 'square' },
            envelope: {
              attack: 0.001,
              decay: 0.19,
              sustain: 0.65,
              release: 0.4,
            },
            modulationEnvelope: {
              attack: 0.006,
              decay: 0.16,
              sustain: 0.12,
              release: 0.25,
            },
          })
          bassSynth.volume.value = -16

          const bassFilter = new Tone.Filter({
            type: 'lowpass',
            frequency: 480,
            rolloff: -24,
            Q: 0.85,
          })

          const bassFeedbackDelay = new Tone.FeedbackDelay({
            delayTime: 0.08,
            feedback: 0.12,
            wet: 0.2,
          })

          const bassAmpEnv = new Tone.AmplitudeEnvelope({
            attack: 0.002,
            decay: 0.16,
            sustain: 0.95,
            release: 6.3,
          })

          const bassDrive = new Tone.Gain(1.35)

          bassSynth.connect(bassAmpEnv)
          bassAmpEnv.connect(bassFilter)
          bassFilter.connect(bassDrive)
          bassDrive.connect(bassFeedbackDelay)
          bassFeedbackDelay.connect(Tone.Destination)
          bassFeedbackDelay.connect(masterReverb)

          leadSynthRef.current = leadSynth
          bassSynthRef.current = bassSynth
          leadFilterRef.current = leadFilter
          leadChorusRef.current = leadChorus
          bassFilterRef.current = bassFilter
          bassFeedbackRef.current = bassFeedbackDelay
          bassAmpEnvelopeRef.current = bassAmpEnv
          reverbRef.current = masterReverb

          return Tone
        })
        .catch((error) => {
          instrumentsPromiseRef.current = null
          throw error
        })
    }
    return instrumentsPromiseRef.current
  }, [prefersReducedMotion])

  return useCallback(
    async (clientX, clientY) => {
      if (prefersReducedMotion) return

      const Tone = await ensureInstruments()
      if (!Tone) return

      const audioContext = Tone.getContext ? Tone.getContext() : Tone.context
      if (audioContext && audioContext.state !== 'running' && typeof Tone.start === 'function') {
        await Tone.start()
      }

      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const last = lastTriggerAtRef.current
      const deltaMs = last !== null ? now - last : 600
      lastTriggerAtRef.current = now
      const release = clamp(deltaMs / 1000, MIN_RELEASE, MAX_RELEASE)

      const coordsKey =
        (((Math.floor(clientX) & 0xffff) << 16) ^ (Math.floor(clientY) & 0xffff)) >>> 0
      seedRef.current = mixSeeds(seedRef.current, coordsKey ^ (deltaMs >>> 0))

      const beatIndex = beatRef.current
      beatRef.current = (beatIndex + 1) % 365

      const { lead, bass } = generateBeat(beatIndex, seedRef.current)
      const leadSynth = leadSynthRef.current
      const bassSynth = bassSynthRef.current

      if (leadSynth && lead.pitch >= 0) {
        const freq = midiToFrequency(lead.pitch + transpose)
        leadSynth.triggerAttackRelease(freq, release)
      }

      if (bassSynth && bass.pitch >= 0) {
        const freq = midiToFrequency(bass.pitch + transpose)
        const bassRelease = clamp(release * 1.3, MIN_RELEASE, MAX_RELEASE * 1.2)
        bassSynth.triggerAttackRelease(freq, bassRelease, undefined, 0.5)
        bassAmpEnvelopeRef.current?.triggerAttackRelease(bassRelease)
      }
    },
    [ensureInstruments, prefersReducedMotion, transpose],
  )
}
