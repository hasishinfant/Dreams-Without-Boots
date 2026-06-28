import React, { useState, useEffect, useRef } from 'react';

const MATCHES = [
  { title: "GROUP STAGE - MATCH 1", opponent: "TEAM A", difficulty: 1 },
  { title: "GROUP STAGE - MATCH 2", opponent: "TEAM B", difficulty: 2 },
  { title: "QUARTER FINAL", opponent: "TEAM C", difficulty: 3 },
  { title: "SEMI FINAL", opponent: "TEAM D", difficulty: 4 }
];

export default function WorldCupMode({ onComplete }) {
  const [matchIdx, setMatchIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFreeze, setShowFreeze] = useState(false);
  const [showAudienceCutaway, setShowAudienceCutaway] = useState(false);
  
  const canvasRef = useRef(null);
  const requestRef = useRef();

  const match = MATCHES[matchIdx];

  // Game State
  const gameState = useRef({
    player: { x: 200, y: 300, radius: 15, speed: 5, hasBall: true },
    ball: { x: 200, y: 280, radius: 8, vx: 0, vy: 0 },
    opponent: { x: 600, y: 300, radius: 15, speed: (match?.difficulty || 1) * 1.5 },
    goal: { x: 750, y: 200, w: 20, h: 200 }, // Huge goal for easy arcade feel
    keys: {},
    isScored: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => { gameState.current.keys[e.key] = true; };
    const handleKeyUp = (e) => { gameState.current.keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetPositions = (nextMatchIdx) => {
    const state = gameState.current;
    state.player.x = 200;
    state.player.y = 300;
    state.ball.x = 220;
    state.ball.y = 300;
    state.ball.vx = 0;
    state.ball.vy = 0;
    state.player.hasBall = true;
    state.opponent.x = 600;
    state.opponent.y = 300;
    if (MATCHES[nextMatchIdx]) {
      state.opponent.speed = MATCHES[nextMatchIdx].difficulty * 1.5;
    }
    state.isScored = false;
  };

  const handleGoal = () => {
    if (gameState.current.isScored) return;
    gameState.current.isScored = true;

    if (matchIdx === 3) {
      // Semi final freeze frame!
      setShowFreeze(true);
      setIsPlaying(false);
      setTimeout(() => {
        onComplete();
      }, 5000);
      return;
    }
    
    setIsPlaying(false);
    setShowAudienceCutaway(true);

    if (matchIdx < 3) {
      setTimeout(() => {
        setMatchIdx(m => m + 1);
        resetPositions(matchIdx + 1);
        setShowAudienceCutaway(false);
      }, 4000); // 4 seconds of audience cutaway
    }
  };

  const update = () => {
    if (!isPlaying) return;
    const state = gameState.current;
    const { player, ball, opponent, goal, keys } = state;

    // Player movement
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;

    // Keep player in bounds
    player.x = Math.max(player.radius, Math.min(800 - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(600 - player.radius, player.y));

    // Ball Logic
    if (player.hasBall) {
      ball.x = player.x + 18;
      ball.y = player.y;
      
      // Shoot
      if (keys[' ']) {
        player.hasBall = false;
        ball.vx = 15; // Fast arcade shot
        ball.vy = (goal.y + goal.h/2 - ball.y) * 0.03; // Aim assist
      }
    } else {
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= 0.98; // friction
      ball.vy *= 0.98;

      // Ball out of bounds -> reset
      if (ball.x > 850 || ball.x < -50 || ball.y < -50 || ball.y > 650) {
        resetPositions(matchIdx);
      }

      // Check Goal
      if (ball.x > goal.x && ball.y > goal.y && ball.y < goal.y + goal.h) {
        handleGoal();
      }
      
      // Player re-collects ball
      const dx = player.x - ball.x;
      const dy = player.y - ball.y;
      if (Math.sqrt(dx*dx + dy*dy) < player.radius + ball.radius) {
        player.hasBall = true;
      }
    }

    // Opponent Logic (Simple block path to goal)
    if (ball.x > 300 || !player.hasBall) {
      // Move Y towards ball
      if (opponent.y < ball.y - 10) opponent.y += opponent.speed;
      if (opponent.y > ball.y + 10) opponent.y -= opponent.speed;
      
      // Keep opponent between player and goal
      const targetX = Math.max(500, ball.x + 50);
      if (opponent.x < targetX) opponent.x += opponent.speed * 0.5;
      if (opponent.x > targetX) opponent.x -= opponent.speed * 0.5;
    }

    // Steal ball
    const ox = opponent.x - ball.x;
    const oy = opponent.y - ball.y;
    if (Math.sqrt(ox*ox + oy*oy) < opponent.radius + ball.radius && player.hasBall) {
       resetPositions(matchIdx);
    }
  };

  const draw = (ctx) => {
    // Painted stylized pitch
    ctx.fillStyle = '#2d4c1e'; // Deep cinematic green
    ctx.fillRect(0, 0, 800, 600);
    
    // Artistic grass texture (simple lines)
    ctx.fillStyle = '#345722';
    for (let i = 0; i < 800; i += 40) {
      ctx.fillRect(i, 0, 20, 600);
    }
    
    // Pitch lines (slightly transparent for painted feel)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 560);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(400, 20);
    ctx.lineTo(400, 580);
    ctx.stroke();
    
    // Center circle
    ctx.beginPath();
    ctx.arc(400, 300, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Goal Area (Right)
    const { goal, player, opponent, ball } = gameState.current;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.strokeRect(760, 150, 40, 300);
    
    // Actual Goal net
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(goal.x, goal.y, goal.w, goal.h);

    // Shadows
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath(); ctx.arc(player.x, player.y + 10, player.radius, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(opponent.x, opponent.y + 10, opponent.radius, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ball.x, ball.y + 5, ball.radius, 0, Math.PI*2); ctx.fill();

    // Player Sprite (Stylized Circle)
    ctx.fillStyle = '#2980b9';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1abc9c';
    ctx.stroke();

    // Opponent Sprite
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(opponent.x, opponent.y, opponent.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e74c3c';
    ctx.stroke();

    // Cloth Football (Textured)
    ctx.fillStyle = '#d3b88c'; // Leather/cloth color
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    // Stitch lines
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ball.x - ball.radius, ball.y);
    ctx.lineTo(ball.x + ball.radius, ball.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y - ball.radius);
    ctx.lineTo(ball.x, ball.y + ball.radius);
    ctx.stroke();
  };

  const loop = () => {
    update();
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      draw(ctx);
    }
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
    } else if (canvasRef.current && !isPlaying && !showFreeze && !showAudienceCutaway) {
      // Draw first frame when paused before start
      draw(canvasRef.current.getContext('2d'));
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, showAudienceCutaway]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* 2D Canvas Layer with Grain overlay */}
      <div style={{ position: 'relative' }}>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          style={{ 
            borderRadius: '8px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            opacity: (isPlaying || showFreeze) ? 1 : 0.4,
            transition: 'opacity 0.5s',
            filter: 'sepia(30%) contrast(110%)' // Cinematic filter
          }} 
        />
        {/* Grain Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png)',
          opacity: 0.1, pointerEvents: 'none', mixBlendMode: 'overlay'
        }} />
      </div>

      {/* 2D Overlay UI Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {!isPlaying && !showFreeze && !showAudienceCutaway && match && (
          <div style={{ textAlign: 'center', pointerEvents: 'auto' }}>
            <h2 style={{ fontSize: '3rem', color: '#f39c12', marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{match.title}</h2>
            <div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#fff', letterSpacing: '0.2em' }}>INDIA vs {match.opponent}</div>
            <button className="menu-btn" onClick={() => setIsPlaying(true)}>▶ PLAY MATCH</button>
            <div style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.9rem', letterSpacing: '0.1em' }}>Arrow Keys / WASD to move. Spacebar to kick.</div>
          </div>
        )}

        {showFreeze && (
          <div className="cinematic-overlay" style={{ background: 'rgba(0,0,0,0.8)', pointerEvents: 'auto' }}>
            <div style={{ fontSize: '3rem', color: '#fff', letterSpacing: '0.2em', textShadow: '0 0 20px #fff' }}>
              THE SHOT THAT CHANGED EVERYTHING.
            </div>
          </div>
        )}
      </div>

      {/* Cinematic Cutaway Layer (Audience) */}
      <div 
        className="cinematic-bg" 
        style={{ 
          backgroundImage: 'url(/assets/audience_cheering.png)', 
          zIndex: 20, 
          opacity: showAudienceCutaway ? 1 : 0, 
          pointerEvents: showAudienceCutaway ? 'auto' : 'none',
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <div className="cinematic-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 100%)', justifyContent: 'flex-end', paddingBottom: '10%' }}>
          <div className="dialogue-text" style={{ fontSize: '2.5rem', color: '#f39c12', textAlign: 'center' }}>
            "A ROAR HEARD ACROSS THE OCEAN!"
          </div>
          <div style={{ fontSize: '1.5rem', color: '#ccc', letterSpacing: '0.1em', textAlign: 'center' }}>
            Every goal makes the sacrifice worth it.
          </div>
        </div>
      </div>

    </div>
  );
}
