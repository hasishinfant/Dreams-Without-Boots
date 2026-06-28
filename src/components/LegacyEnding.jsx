import React, { useState, useEffect } from 'react';

const TIMELINE = [
  "1950 - India inspires Asia.",
  "1958 - National Football Academies.",
  "1965 - Professional League begins.",
  "1974 - Indian clubs compete internationally.",
  "1982 - Millions of children play football.",
  "1994 - World-class stadiums built.",
  "2002 - Indian players move to Europe.",
  "2010 - India hosts FIFA tournaments.",
  "2026 - India reaches the FIFA World Cup.",
  "2042 - A child watches India lift the World Cup."
];

export default function LegacyEnding({ onComplete }) {
  const [phase, setPhase] = useState(-3);

  // Phases:
  // -3: "History cannot be rewritten."
  // -2: "But..."
  // -1: "Dreams can."
  // 0 to length-1: Timeline
  // length: Final scene

  useEffect(() => {
    let timeout;
    
    if (phase < 0) {
      timeout = setTimeout(() => {
        setPhase(p => p + 1);
      }, 3000);
    } else if (phase < TIMELINE.length) {
      timeout = setTimeout(() => {
        setPhase(p => p + 1);
      }, 1500);
    } else if (phase === TIMELINE.length) {
      timeout = setTimeout(() => {
        setPhase(p => p + 1);
      }, 6000);
    }

    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <div className="cinematic-bg" style={{ backgroundColor: '#050505', backgroundImage: phase > TIMELINE.length ? 'url(/assets/level_1.png)' : 'none', filter: phase > TIMELINE.length ? 'sepia(50%)' : 'none' }}>
      <div className="cinematic-overlay" style={{ background: phase > TIMELINE.length ? 'rgba(0,0,0,0.8)' : 'transparent', justifyContent: 'center' }}>
        
        {phase === -3 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 2s ease forwards' }}>
            <div className="dialogue-text">"History cannot be rewritten."</div>
          </div>
        )}

        {phase === -2 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 2s ease forwards' }}>
            <div className="dialogue-text">"But..."</div>
          </div>
        )}

        {phase === -1 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 2s ease forwards' }}>
            <div className="dialogue-text">"Dreams can."</div>
          </div>
        )}

        {phase >= 0 && phase < TIMELINE.length && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {TIMELINE.slice(0, phase + 1).map((text, idx) => (
              <div key={idx} style={{ 
                color: idx === phase ? '#fff' : '#555', 
                fontSize: idx === phase ? '2rem' : '1.2rem',
                margin: '1rem 0',
                transition: 'all 0.5s ease',
                textShadow: idx === phase ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
              }}>
                {idx > 0 && idx === phase && <div style={{ fontSize: '1rem', color: '#555', marginBottom: '1rem', textAlign: 'center' }}>↓</div>}
                {text}
              </div>
            ))}
          </div>
        )}

        {phase >= TIMELINE.length && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 3s ease forwards' }}>
            <div style={{ fontSize: '4rem' }}>⚽</div>
            <div className="dialogue-text" style={{ marginTop: '2rem' }}>Every dream begins somewhere.</div>
            
            <div style={{ marginTop: '4rem', color: '#aaa', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              Dedicated to every Indian footballer who dreamed beyond history.
            </div>

            {phase > TIMELINE.length && (
              <button className="menu-btn" style={{ marginTop: '4rem' }} onClick={onComplete}>
                MAIN MENU
              </button>
            )}
          </div>
        )}

      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
