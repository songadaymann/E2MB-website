import BurnNotesManager from './components/BurnNotesManager'
import BurnLeaderboard from './components/BurnLeaderboard'
import LifespanRevealCalculator from './components/LifespanRevealCalculator'

export const burnSquaresData = [
  {
    id: 1,
    customContent: true,
    content: (
      <div
        style={{
          fontWeight: '900',
          fontSize: '3.2rem',
          lineHeight: '1.1',
          textAlign: 'center',
          padding: '13px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: '-9px',
              width: '231px',
              height: '158px',
              border: '2px solid white',
              zIndex: -1,
            }}
          />
          <div style={{ display: 'block', letterSpacing: '0.30em' }}>BURN</div>
          <div style={{ display: 'block', letterSpacing: '.6em' }}>FOR</div>
          <div style={{ display: 'block', letterSpacing: '0.33em' }}>$TIME</div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            textAlign: 'center',
            lineHeight: 1.2,
            fontSize: '1.5rem',
          }}
        >
          <span>remember:</span>
          <span>
            <span style={{ color: '#FFE797', fontWeight: 700 }}>one note</span>{' '}
             is revealed
          </span>
          <span>every 2 million blocks</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            textAlign: 'center',
            lineHeight: 1.2,
            fontSize: '1.5rem',
          }}
        >
          <span>to hear your note</span>
          <span> before you 
             <span style={{ color: '#A72703', fontWeight: 700 }}> die</span>{' '}
          
          </span>
          <span></span>
          <span>
            you need{' '}
            <span
              style={{
                color: '#FFFFFF',
                fontWeight: 700,
                textDecoration: 'underline',
                textDecorationColor: '#FCB53B',
                textDecorationThickness: '2px',
              }}
            >
              $time
            </span>
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            textAlign: 'center',
            lineHeight: 1.2,
            fontSize: '1.5rem',
          }}
        >
          <span> you get
             <span style={{ color: '#84994F', fontWeight: 700 }}> $time</span>{' '}
          
          </span>
          <span>by burning my</span>
          <span>previous projects</span>
          <span>↙  ↓  ↘</span>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            textAlign: 'center',
            lineHeight: 1.2,
            fontSize: '1.5rem',
          }}
        >
          <span> since 2018</span>
          <span> i've made</span>
          <span></span>
        
          <span>3 nft projects</span>
          <span>2 coins</span>
          <span>8 editions</span>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    customContent: true,
    content: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            textAlign: 'center',
            lineHeight: 1.2,
            fontSize: '1.5rem',
          }}
        >
          <span>(not counting song a day)</span>
          
        </div>
      </div>
    ),
    // Fill in copy
  },
  {
    id: 7,
    refId: 'burn-large-1',
    customContent: true,
    content: <BurnNotesManager />,
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: 8,
    text: '',
    // Fill in copy
    hidden: true,
    rowSpan: 0,
  },
  {
    id: 9,
    customContent: true,
    colSpan: 5,
    content: <LifespanRevealCalculator />,
  },
  {
    id: 10,
    hidden: true,
  },
  {
    id: 11,
    hidden: true,
  },
  {
    id: 12,
    hidden: true,
  },
  {
    id: 13,
    hidden: true,
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
  },
  {
    id: 15,
    hidden: true,
  },{
    id: 16,
    hidden: true,
  },
  {
    id: 17,
    refId: 'burn-large-2',
    customContent: true,
    content: <BurnLeaderboard />,
    colSpan: 1,
    rowSpan: 2,
    clickable: true,
    showLeaderboardModal: true,
  },
  {
    id: 18,
    type: 'image',
    image: '/images/troll.png',
    clickable: true,
    modalKey: 'fuckinTrolls',
    requiresWallet: true,
  },
  {
    id: 19,
    type: 'image',
    image: '/images/goat.png',
    clickable: true,
    modalKey: 'fuckinGoats',
    requiresWallet: true,
  },
  {
    id: 20,
    type: 'image',
    image: '/images/deaf.gif',
    clickable: true,
    modalKey: 'notDeafBeef',
    requiresWallet: true,
  },
  {
    id: 21,
    type: 'image',
    image: '/images/never.png',
    clickable: true,
    modalKey: 'thisSongWillNeverDie',
    requiresWallet: true,
  },
  {
    id: 22,
    type: 'image',
    image: '/images/taxes.png',
    clickable: true,
    modalKey: 'taxesCoin',
    requiresWallet: true,
  },
  {
    id: 23,
    type: 'image',
    image: '/images/zorb.png',
    clickable: true,
    modalKey: 'baseEditions',
    requiresWallet: true,
  },
  {
    id: 24,
    type: 'image',
    image: '/images/merge.jpg',
    clickable: true,
    modalKey: 'merge',
    // Fill in copy
    requiresWallet: true,
  },
  {
    id: 25,
    type: 'image',
    image: '/images/iceking.jpg',
    clickable: true,
    modalKey: 'iceKing',
    // Fill in copy
    requiresWallet: true,
  },
  {
    id: 26,
    type: 'image',
    image: '/images/pmmishigas.gif',
    clickable: true,
    modalKey: 'pmMishegas',
    // Fill in copy
    requiresWallet: true,
  },
  {
    id: 27,
    type: 'image',
    image: '/images/miggles.jpg',
    clickable: true,
    modalKey: 'mrMiggles',
    requiresWallet: true,
  },
  {
    id: 28,
    type: 'image',
    image: '/images/stand.png',
    clickable: true,
    modalKey: 'standWithCrypto',
    // Fill in copy
    requiresWallet: true,
  },
  {
    id: 29,
    type: 'image',
    image: '/images/miggles2.png',
    clickable: true,
    modalKey: 'mrMiggles2',
    requiresWallet: true,
  },
  {
    id: 30,
    type: 'image',
    image: '/images/cbtc.png',
    clickable: true,
    modalKey: 'cbtc',
    requiresWallet: true,
  },
  {
    id: 31,
    type: 'image',
    image: '/images/summer.png',
    clickable: true,
    modalKey: 'summerNeverEnds',
    requiresWallet: true,
  },
  {
    id: 32,
    text: 'YOUR NOTES:',
    // Fill in copy
    requiresWallet: true,
  },
]

export const burnEmptySquaresCount = 0
