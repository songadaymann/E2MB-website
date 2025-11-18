import { useEffect, useState } from 'react'
import SongADayTicker from './components/SongADayTicker'
import { assetPath } from './lib/assetPath'


const timeStackLayers = [
  { color: '#FFFFFF', opacity: 1 },
  { color: '#FFFFFF', opacity: 0.5 },
  { color: '#FFFFFF', opacity: 0.2 },
]

// Edit this file to add content to your squares!
// Each square can have:
// - text: simple text string
// - clickable: true (makes it open a modal when clicked)
// - modalContent: text to show in the modal
// - type: 'title' or 'countdown' for special squares

const START_COUNT = 9999999999

function formatCountdown(value) {
  // Format as 9 : 999 : 999 : 999
  return value
    .toString()
    .padStart(10, '0')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ':')
}

function CountdownBlock() {
  const [value, setValue] = useState(START_COUNT)

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (v > 0 ? v - 1 : 0))
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        color: '#0f0',
        letterSpacing: '0.15em',
      }}
    >
      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>
        countdown
      </div>
      <div style={{ fontSize: '1.4rem' }}>
        {formatCountdown(value)}
      </div>
    </div>
  )
}


export const squaresData = [
  {
    id: 1,
    customContent: true,
    content: (
      <div style={{ 
        fontWeight: '900',
        fontSize: '3.2rem',
        lineHeight: '1.1',
        textAlign: 'left',
        padding: '13px',
        position: 'relative',
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'left',
        width: '100%',
        height: '100%'
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute',
            top: '-8px',
            left: '-9px',
            width: '231px',
            height: '158px',
            border: '2px solid white',
            zIndex: -1
          }} />
          <div style={{ display: 'block', letterSpacing: '0.27em' }}>EVERY</div>
          <div style={{ display: 'block', letterSpacing: '0.95em' }}>TWO</div>
          <div style={{ display: 'block', letterSpacing: '0' }}>MILLION</div>
          <div style={{ display: 'block', letterSpacing: '0.065em' }}>BLOCKS</div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', color: '#84994F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '3rem' }}>mint</div>
      </div>
    ),
    clickable: true,
    showMintModal: true,
  },
  {
    id: 3,
    type: 'hover',
    defaultContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: '#FCB53B', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0' }}>readme</div>
      </div>
    ),
    hoverContent: (
      <div style={{ textAlign: 'center', padding: '.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem', fontWeight: 'bold' }}>
        i'd like to make a song with you
      </div>
    ),
    clickable: true,
    showImageModal: true,
    image: assetPath('images/readme.png'),
  },
  {
    id: 4,
    text: 'i am obsessed with time.',
  },
  {
    id: 5,
    text: "in 2000 BCE somebody carved musical instructions into a stone tablet.",
  },
  {
    id: 6,
    type: 'image',
    image: assetPath('images/nippur-cuniform.png'),
    clickable: true,
    modalContent: 'This is a drawing of a cuniform tablet containing musical instructions from Babylonia circa ~2000 BCE. No one can quite agree on how exactly to read it.',
  },
  {
    id: 7,
    text: "i want to make a song that lasts forever.",
  },
  {
    id: 8,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝆶</div>
    
      </div>
    ),
  },
  {
    id: 9,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            letterSpacing: '0.35rem',
            textTransform: 'lowercase',
            background: 'linear-gradient(130deg, #A72703 0%, #FCB53B 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          burn
        </div>
      </div>
    ),
    clickable: true,
    navigateTo: assetPath('burn'),
    
  },
  {
    id: 10,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝇛</div>
    
      </div>
    ),
  },
  {
    id: 11,
    text: "in 1969, Young & Zazeela created dream house. \n\n dream house has now been running continuously in NYC since 1993",
    // Empty square - leave text as empty string
  },
  {
    id: 12,
    type: 'image',
    image: assetPath('images/dream.png'),
    clickable: true,
    modalContent: "the dream house is a long running site specific art piece by La Monte Young and Marian Zazeela. A constantly sounding chord of sine waves has been rinnging out since 1993. There is no set length. It could go forever. <a href=\"https://www.melafoundation.org/\" target=\"_blank\" rel=\"noreferrer\">You can even visit the dream house!</a>",
  },
  {
    id: 13,
    customContent: true,
    content: (
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: '0.25rem',
        }}
      >
        {timeStackLayers.map(({ color, opacity }, index) => (
          <div
            key={index}
            style={{
              fontSize: '4rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.35rem',
              color,
              opacity,
              lineHeight: '1',
            }}
          >
            $time
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 14,
    type: 'hover',
    defaultContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '7rem', fontWeight: 'bold', margin: '0.5rem 0' }}>𝄐</div>
      </div>
    ),
    hoverContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem', fontWeight: 'bold' }}>
        maybe it's a cult
      </div>
    )
  },// Add more squares below - just copy and paste this template:
  {
    id: 15,
    text: "in 1987, John Cage wrote the score for As Slow As Possible.",
    // Empty square - leave text as empty string
  },
  {
    id: 16,
    type: 'image',
    image: assetPath('images/ASLSP.png'),
    clickable: true,
    modalContent: "the score for John Cage's As Slow As Possible",
  },
  {
    id: 17,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝅁</div>
    
      </div>
    ),
  },
  {
    id: 18,
    text: "i've written 146 songs with the word 'time' in the title.",
  },
  {
    id: 19,
    text: "since 1996, Danny Hillis set out to create the Clock of the Long Now. \n\n\ it's meant to operate for 10,000 years",
    // Empty square - leave text as empty string
  },
  {
    id: 20,
    type: 'image',
    image: assetPath('images/clock.png'),
    clickable: true,
    modalTitle: 'the clock is still under construction and has been funded by Jeff Bezos.',
  
  },
  {
    id: 21,
    text: "in 2000, Jem Finer set in motion his song Longplayer, set to last 1000 years.",
    // Empty square - leave text as empty string
  },
  {
    id: 22,
    type: 'image',
    image: assetPath('images/longplayer.png'),
    clickable: true,
    modalTitle: 'Listen: Longplayer has been playing since 1/1/2000',
    modalUrl: 'http://icecast.spc.org:8000/longplayer',
  },
  
  {
    id: 23,
    text: "in 2001, the organ in this church began to play As Slow As Possible. \n\nthe performance is set to end in 2640",
    // Empty square - leave text as empty string
  },
  {
    id: 24,
    type: 'image',
    image: assetPath('images/halberstadt.jpg'),
    clickable: true,
    modalTitle: 'Listen: The note changing on this organ in 2024. The next change is 2026.',
    modalUrl: 'https://youtu.be/L1a1CpaBovQ?si=hmHKMbqE7oUVJdBK&t=1044',
    modalContent: 'The organ in this church has been continuously playing As Slow As Possible by John Cage for the last 24 years.',
  },
  {
    id: 25,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <SongADayTicker />
        <div style={{ fontSize: '0.9rem', marginTop: '0.75rem', opacity: 0.8 }}>
        
        </div>
      </div>
    ),
    clickable: true,
    modalTitle: 'Song a Day Gallery',
    modalUrl: 'https://gallery.songaday.world/embed?zoom=5&x=0.45&y=0.4'
    ,
  },
  {
    id: 26,
    customContent: true,
    content: (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '4px' }}>
        <iframe
          src="https://gallery.songaday.world/embed?zoom=5&x=0.45&y=0.4"
          title="Song a Day Gallery"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            transform: 'scale(1.05)',
            transformOrigin: 'center',
          }}
          allowFullScreen
        />
      </div>
    ),
    clickable: true,
    modalTitle: 'Song a Day Gallery',
    modalUrl: 'https://gallery.songaday.world/embed?zoom=5&x=0.45&y=0.4',
  },
  {
    id: 27,
    text: "i am obsessed with death.",
    // Empty square - leave text as empty string
  },
  {
    id: 28,
    text: "in 2014, Bull of Heaven created a song that can last 3.343 quindecillion years \n\n ",
    // Empty square - leave text as empty string
  },
  {
    id: 29,
    type: 'image',
    image: assetPath('images/bull.jpg'),
    clickable: true,
    modalTitle: "listen to a small sammple of 310: ΩΣPx0(2^18×5^18)p*k*k*k",
    modalUrl: 'https://www.youtube.com/watch?v=OXHhc5PaFXw',
    modalContent: 'Bull of Heaven is a band known for releasing a lot of noise/drone music, much of lasting insanely long periods of time.',
    // Empty square - leave text as empty string
  },
  
  {
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝀸</div>
    
      </div>
    ),
    // Empty square - leave text as empty string
  },
  {
    id: 28,
    text: "in 2021, Alvin Lucier died.\n\n in 2025, a brain organoid grown from his blood sent signals that played music on large brass plates. ",
    // Empty square - leave text as empty string
  },
  {
    id: 29,
    type: 'image',
    image: assetPath('images/organoid.png'),
    clickable: true,
    modalTitle: "Listen: A brain organoid grown from Alvin's blood triggers electical impulses that make sounds on the brass plates.",
    modalUrl: 'https://youtu.be/Xp1wgibBlMU?si=bzd09cp-GXJLMmrH',
    modalContent: 'When learning of this, his daughter said, "That is so my dad"',
    // Empty square - leave text as empty string
  },
  
  {
    id: 30,
    text: "in 2026, the first note of Every Two Million Blocks will begin playing for a year",
    // Empty square - leave text as empty string
  },
  {
    id: 31,
    text: "ethereum adds a new block every 12 seconds",
    // Empty square - leave text as empty string
  },
  {
    id: 32,
    type: 'image',
    image: assetPath('images/notes.png'),
    clickable: true,
    modalContent: 'Note a year',
  },
  {
    id: 33,
    text: "one note is revealed every ~2,628,000 blocks.",
    // Empty square - leave text as empty string
  },
  {
    id: 34,
    type: 'image',
    image: assetPath('images/notes1.png'),
    clickable: true,
    modalContent: 'Note a year',
  },
  {
    id: 35,
    text: "song a day \n: \nnote a year",
    // Empty square - leave text as empty string
  },
  {
    id: 36,
    text: "markov chain\nonchain",
    // Empty square - leave text as empty string
  },
  {
    id: 37,
    text: "this is the 37th block\n\nthe average human lifespan is 73 years",
    // Empty square - leave text as empty string
  },
  {
    id: 38,
    text: "the universe will achieve heat death in 10^100 years",
    // Empty square - leave text as empty string
  },
  {
    id: 33,
    text: "i have nothing to say and i am saying it",
    // Empty square - leave text as empty string
  },
  {
    id: 34,
    text: "(john cage said that)",
    // Empty square - leave text as empty string
  },
  {
    id: 35,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝆰</div>
    
      </div>
    ),
    // Empty square - leave text as empty string
  },
  {
    id: 36,
    text: "vinyl records degrade ~0.001% with each play",
    // Empty square - leave text as empty string
  },
  {
    id: 37,
    text: "ok",
    // Empty square - leave text as empty string
  },
  {
    id: 38,
    text: "[intentionally left blank]",
    // Empty square - leave text as empty string
  },
  {
    id: 39,
    text: "i can't remember what yesterday's song was about",
    // Empty square - leave text as empty string
  },
  {
    id: 40,
    text: "brian eno coined the term generative music",
    // Empty square - leave text as empty string
  },
  {
    id: 41,
    type: 'hover',
    defaultContent: (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '3em',
          fontFamily: 'monospace',
          color: '#0f0',
          textShadow: '2px 2px 0 #f0f, -2px -2px 0 #0ff',
          animation: 'glitch 0.3s infinite',
          letterSpacing: '0.05em'
        }}>
          ẗ̷̯́ỉ̶͇m̸̱̈ë̴́ͅ.̷̺̾ë̸́ͅr̷͉̈r̵̤̈
        </div>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '2px',
          background: '#fff',
          top: '30%',
          animation: 'scanline 4s linear infinite',
          opacity: 0.5
        }} />
        <style>{`
          @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-1px, 1px); }
            40% { transform: translate(1px, -1px); }
            60% { transform: translate(-1px, 0); }
            80% { transform: translate(1px, 0); }
            100% { transform: translate(0); }
          }
          @keyframes scanline {
            0% { top: 0%; }
            100% { top: 100%; }
          }
        `}</style>
      </div>
    ),
    hoverContent: (
      <div style={{ 
        textAlign: 'center', 
        padding: '1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        fontSize: '2rem', 
        fontWeight: 'bold',
        color: '#fff'
      }}>
        breathe
      </div>
    ),
  },
  {
    id: 42,
    text: "cats that glow when exposed to radiation",
    clickable: true,
    modalTitle: 'Ray Cat',
    modalUrl: 'https://en.wikipedia.org/wiki/Ray_cat',
  },
  {
    id: 43,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝆏</div>
    
      </div>
    ),
    // Empty square - leave text as empty string
  },
  {
    id: 44,
    text: "the oldest playable flute is 35,000 years old",
    // Empty square - leave text as empty string
  },
  {
    id: 45,
    text: "i took a class in grad school with morton subotnick",
    // Empty square - leave text as empty string
  },
  {
    id: 46,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #FFFFFF 0%, #111111 60%, #000000 100%)',
        }}
      >
        <div
          style={{
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0,0,0,0.9) inset',
          }}
        >
          <div
            style={{
              width: '18%',
              height: '18%',
              borderRadius: '50%',
              background: '#FFFFFF',
            }}
          />
        </div>
      </div>
    ),
  },
  
  {
    id: 47,
    text: "link rot",
    // Empty square - leave text as empty string
  },
  {
    id: 48,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>∞²</div>
    
      </div>
    ),
  },
  {
    id: 80,
    type: 'hover',
    defaultContent: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
        }}
      >
        this block remembers
      </div>
    ),
    hoverContent: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
        }}
      >
        this block forgets
      </div>
    ),
  },
  {
    id: 50,
    type: 'hover',
    defaultContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>this song lasts forever</div>
      </div>
    ),
    hoverContent: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.6rem', fontWeight: 'bold' }}>
        or until ethereum stops adding blocks
      </div>
    ),
  },
  {
    id: 51,
    text: "SEVEN WORDS",
    // Empty square - leave text as empty string
  },
  {
    id: 52,
    customContent: true,
  content: <CountdownBlock />,
    
  },
  {
    id: 53,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div
          style={{
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          }}
        >
          now
        </div>
        <div
          style={{
            background: 'radial-gradient(circle at top left, #FCB53B, #A72703)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          }}
        >
          later
        </div>
      </div>
    ),
  },
  {
    id: 54,
    text: "a black hole emits Hawking radiation at a temperature of 10^-7 K ",
    // Empty square - leave text as empty string
  },
  {
    id: 55,
    text: "magnetic tape loses 1-2% of signal annually",
    // Empty square - leave text as empty string
  },
  {
    id: 82,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '2px',
              height: i === 3 ? '80%' : '40%',
              background: 'rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 57,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#050509',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '80%',
            borderRadius: '3px',
            border: '1px solid rgba(255,255,255,0.6)',
            overflow: 'hidden',
            fontSize: '0.65rem',
          }}
        >
          <div
            style={{
              padding: '0.25rem 0.4rem',
              background:
                'linear-gradient(90deg, #A72703 0%, #FCB53B 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              404.exe
            </span>
            <span>✕</span>
          </div>
          <div
            style={{
              padding: '0.4rem 0.5rem',
              background: 'rgba(0,0,0,0.85)',
              lineHeight: 1.4,
            }}
          >
            time not found
            <br />
            please try again later
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 58,
    text: "digital files decay when no one maintains them",
    // Empty square - leave text as empty string
  },
  {
    id: 59,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝇟</div>
    
      </div>
    ),
    // Empty square - leave text as empty string
  },
  {
    id: 60,
    text: "cesium atoms vibrate 9,192,631,770 times per second",
    // Empty square - leave text as empty string
  },
  {
    id: 61,
    text: "leave a note to be passed down to future generations",
    // Empty square - leave text as empty string
  },
  {
    id: 62,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '0.9rem',
        }}
      >
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#A72703',
            boxShadow: '0 0 10px #A72703',
          }}
        />
        <span>rec</span>
      </div>
    ),
  },
  {
    id: 63,
    text: "myspace lost 50 million songs uploaded before 2015",
    // Empty square - leave text as empty string
  },
  {
    id: 64,
    text: "every cd i've ever owned has been scratched",
    // Empty square - leave text as empty string
  },
  {
    id: 65,
    text: "the library of alexandria was destroyed by fire in 48 BCE",
    // Empty square - leave text as empty string
  },
  {
    id: 66,
    type: 'hover',
    defaultContent: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          color: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '0.9rem',
          fontWeight: '700',
        }}
      >
        now
      </div>
    ),
    hoverContent: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '0.9rem',
          fontWeight: '700',
        }}
      >
        later
      </div>
    ),
  },
  {
    id: 67,
    text: "attack, sustain, release, silence",
  },
  {
    id: 68,
    customContent: true,
    content: (
      <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(90deg, #fff 0, #fff 1px, #000 1px, #000 2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(0,0,0,0.7)', padding: '0.5rem 0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          this block failed to render
        </div>
      </div>
    ),
  },
  {
    id: 69,
    customContent: true,
    content: (
      <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', color: 'white  ', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ fontSize: '5rem' }}>𝇩</div>
    
      </div>
    ),
    // Empty square - leave text as empty string
  },
  {
    id: 70,
    text: "you'll die someday",
    // Empty square - leave text as empty string
  },
  {
    id: 71,
    customContent: true,
    content: (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTop: '3px solid #FCB53B',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite',
        }}>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    ),
  },
  {
    id: 72,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {['1px,1px', '2px,2px', '3px,3px'].map((offset, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `translate(${offset.split(',')[0]}, ${offset.split(',')[1]})`,
              fontSize: '2.4rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.35em',
              opacity: 0.15 + 0.25 * (3 - i),
            }}
          >
            time
          </div>
        ))}
        <div
          style={{
            fontSize: '2.4rem',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
          }}
        >
          time
        </div>
      </div>
    ),
  },
  {
    id: 73,
    text: "block 73 of 73",
    // Empty square - leave text as empty string
  },
  

  
]

// How many total empty squares to add after your custom ones
export const emptySquaresCount = 0
