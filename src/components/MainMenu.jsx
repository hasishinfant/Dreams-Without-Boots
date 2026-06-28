import React, { useState, useEffect } from 'react';

export default function MainMenu({ navigateTo, unlockedWorldCup }) {
  const [phase, setPhase] = useState(0); // 0: intro 1, 1: intro 2, 2: main menu

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 3000);
    const t2 = setTimeout(() => setPhase(2), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); }
  }, []);

  return (
    <div className="cinematic-bg" style={{ backgroundColor: '#050505', backgroundImage: phase === 2 ? 'url(/assets/level_1.png)' : 'none' }}>
      <div className="cinematic-overlay" style={{ background: phase === 2 ? 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' : 'transparent', alignItems: phase === 2 ? 'flex-start' : 'center' }}>
        
        {phase === 0 && (
          <div className="dialogue-text">"History remembers the teams that played."</div>
        )}
        
        {phase === 1 && (
          <div className="dialogue-text">"This is the story of the team that never got the chance."</div>
        )}

        {phase === 2 && (
          <div style={{ textAlign: 'left', maxWidth: '600px', marginLeft: '5%' }}>
            <h1 className="title">DREAMS WITHOUT BOOTS</h1>
            <div className="subtitle">A Fictional Alternate History Inspired by Real Events</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <button className="menu-btn" onClick={() => navigateTo('story')}>▶ STORY MODE</button>
              <button className="menu-btn" onClick={() => navigateTo('worldcup')} disabled={!unlockedWorldCup}>
                {unlockedWorldCup ? '▶ REWRITE HISTORY' : '🔒 REWRITE HISTORY'}
              </button>
            </div>

            <div style={{ marginTop: '4rem', fontSize: '0.8rem', color: '#888', fontStyle: 'italic', maxWidth: '80%' }}>
              Disclaimer: This game is a fictional "what if" story inspired by India's qualification and withdrawal from the 1950 FIFA World Cup. It is not intended as a historical recreation.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
