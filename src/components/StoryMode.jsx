import React, { useState, useEffect } from 'react';

const CHAPTERS = [
  {
    title: "CHAPTER 1 - BAREFOOT DREAMS",
    image: "/assets/level_1.png",
    text: [
      "A small Indian village. 1950.",
      "Barefoot children are playing football with a stitched cloth ball.",
      "You look at the ball.",
      "\"One day we'll play against the best teams in the world.\""
    ],
    interactionType: "kick_ball"
  },
  {
    title: "CHAPTER 2 - THE NEWS",
    image: "/assets/level_2.png",
    text: [
      "Villagers gather around the crackling radio.",
      "\"India has qualified for the FIFA World Cup.\"",
      "The village erupts in celebration. Tears of happiness.",
      "But then, the announcer continues...",
      "\"However... The team cannot travel. We have no boots. No funds.\"",
      "Everything stops."
    ],
    interactionType: "radio"
  },
  {
    title: "CHAPTER 3 - ONE VILLAGE. ONE DREAM.",
    image: "/assets/level_1.png",
    text: [
      "The dream refuses to die.",
      "Every person in the village contributes.",
      "Collect hope. Not money."
    ],
    interactionType: "collect_hope"
  },
  {
    title: "CHAPTER 4 - THE SHOEMAKER",
    image: "/assets/level_1.png",
    text: [
      "The old shoemaker is stitching boots through the night.",
      "His hands shake as he finishes the final pair.",
      "Help him finish the boots."
    ],
    interactionType: "stitch"
  },
  {
    title: "CHAPTER 5 - FAREWELL",
    image: "/assets/level_6.png",
    text: [
      "The team boards an old passenger ship.",
      "Families wave goodbye from the docks.",
      "A little girl runs toward you."
    ],
    interactionType: "receive_ball"
  },
  {
    title: "CHAPTER 6 - ACROSS THE OCEAN",
    image: "/assets/level_6.png",
    text: [
      "The journey takes weeks.",
      "You train on the deck of the ship.",
      "Storms shake the vessel, but the players continue.",
      "The world was waiting."
    ],
    interactionType: "none"
  }
];

export default function StoryMode({ onComplete }) {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  
  // Interaction States
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [hopeItems, setHopeItems] = useState([false, false, false, false]);
  const [stitchProgress, setStitchProgress] = useState(0);
  const [radioOn, setRadioOn] = useState(false);
  const [ballPosition, setBallPosition] = useState(0);

  const chapter = CHAPTERS[chapterIdx];
  const currentText = chapter.text[dialogueIdx];
  const isLastDialogue = dialogueIdx === chapter.text.length - 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (chapter.interactionType === 'radio' && isLastDialogue && e.key.toLowerCase() === 'e') {
        setRadioOn(true);
        setTimeout(() => setInteractionComplete(true), 2000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapter.interactionType, isLastDialogue]);

  const handleNextDialogue = () => {
    if (!isLastDialogue) {
      setDialogueIdx(d => d + 1);
    }
  };

  const handleNextChapter = () => {
    if (chapterIdx < CHAPTERS.length - 1) {
      setChapterIdx(c => c + 1);
      setDialogueIdx(0);
      setInteractionComplete(false);
      // Reset interaction states
      setHopeItems([false, false, false, false]);
      setStitchProgress(0);
      setRadioOn(false);
      setBallPosition(0);
    } else {
      onComplete();
    }
  };

  const renderInteraction = () => {
    if (!isLastDialogue) return null;

    switch (chapter.interactionType) {
      case 'kick_ball':
        return (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div 
              onClick={() => {
                setBallPosition(200);
                setTimeout(() => setInteractionComplete(true), 1000);
              }}
              style={{ 
                width: '40px', height: '40px', background: '#ccc', borderRadius: '50%', 
                margin: '0 auto', cursor: 'pointer',
                transform: `translateY(-${ballPosition}px)`, transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)',
                boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.5)'
              }}
            ></div>
            <div style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.8rem' }}>Click the ball to kick</div>
          </div>
        );

      case 'radio':
        return (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div 
              onClick={() => {
                setRadioOn(true);
                setTimeout(() => setInteractionComplete(true), 3000);
              }}
              style={{ 
                width: '100px', height: '60px', background: '#5c4033', border: '2px solid #3e2723',
                margin: '0 auto', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: radioOn ? '0 0 20px rgba(243, 156, 18, 0.5)' : 'none'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#111' }}></div>
            </div>
            <div style={{ marginTop: '1rem', color: '#f39c12', opacity: radioOn ? 1 : 0, transition: 'opacity 0.5s' }}>
              [Static Buzzing... Silence.]
            </div>
            {!radioOn && <div style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.8rem' }}>Press E or Click to turn on radio</div>}
          </div>
        );

      case 'collect_hope':
        const items = [
          { name: "Farmer's Wheat", emoji: "🌾" },
          { name: "Shoemaker's Leather", emoji: "👞" },
          { name: "Mother's Bangles", emoji: "💍" },
          { name: "Child's Coin", emoji: "🪙" }
        ];
        return (
          <div style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: '#f39c12' }}>HOPE METER</div>
            <div style={{ width: '100%', height: '10px', background: '#333', marginBottom: '1rem' }}>
              <div style={{ width: `${(hopeItems.filter(Boolean).length / 4) * 100}%`, height: '100%', background: '#f39c12', transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {items.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    const newItems = [...hopeItems];
                    newItems[i] = true;
                    setHopeItems(newItems);
                    if (newItems.filter(Boolean).length === 4) setInteractionComplete(true);
                  }}
                  style={{ 
                    fontSize: '2rem', cursor: hopeItems[i] ? 'default' : 'pointer',
                    opacity: hopeItems[i] ? 0.2 : 1, transition: 'opacity 0.3s',
                    textAlign: 'center'
                  }}
                  title={item.name}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>Collect contributions from the village</div>
          </div>
        );

      case 'stitch':
        return (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {[0, 1, 2].map(i => (
                <div 
                  key={i}
                  onClick={() => {
                    if (stitchProgress === i) {
                      setStitchProgress(i + 1);
                      if (i === 2) setTimeout(() => setInteractionComplete(true), 500);
                    }
                  }}
                  style={{ 
                    width: '20px', height: '20px', borderRadius: '50%', 
                    background: stitchProgress > i ? '#f39c12' : '#333',
                    border: '2px solid #f39c12', cursor: stitchProgress === i ? 'pointer' : 'default',
                    position: 'relative'
                  }}
                >
                  {stitchProgress > i && <div style={{ position: 'absolute', top: '8px', left: '-20px', width: '20px', height: '2px', background: '#f39c12' }} />}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.8rem' }}>Click the points to stitch the boots</div>
          </div>
        );

      case 'receive_ball':
        return (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div 
              onClick={() => setInteractionComplete(true)}
              style={{ 
                fontSize: '3rem', cursor: 'pointer', 
                transform: interactionComplete ? 'scale(1.5)' : 'scale(1)',
                transition: 'transform 0.5s',
                animation: !interactionComplete ? 'bounce 2s infinite' : 'none'
              }}
            >
              👧🏽⚽
            </div>
            <div style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.8rem' }}>Take the ball. "Bring it home."</div>
          </div>
        );

      default:
        // No interaction needed
        if (!interactionComplete) setInteractionComplete(true);
        return null;
    }
  };

  return (
    <div className="cinematic-bg" style={{ backgroundImage: `url(${chapter.image})` }}>
      <div className="cinematic-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.2) 100%)', justifyContent: 'flex-end', paddingBottom: '10%', alignItems: 'center' }}>
        
        <h2 style={{ position: 'absolute', top: '2rem', left: '2rem', letterSpacing: '0.1em', color: '#f39c12', opacity: 0.8 }}>
          {chapter.title}
        </h2>

        <div className="dialogue-text" key={`${chapterIdx}-${dialogueIdx}`} style={{ textAlign: 'center', maxWidth: '800px' }}>
          {currentText}
        </div>

        {renderInteraction()}

        <button 
          className="menu-btn" 
          onClick={isLastDialogue ? handleNextChapter : handleNextDialogue}
          style={{ 
            width: 'auto', padding: '1rem 2rem', marginTop: '2rem',
            opacity: (!isLastDialogue || interactionComplete) ? 1 : 0,
            pointerEvents: (!isLastDialogue || interactionComplete) ? 'auto' : 'none',
            transition: 'opacity 0.5s'
          }}
        >
          {isLastDialogue ? '▶ CONTINUE' : '▶ NEXT'}
        </button>

      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
