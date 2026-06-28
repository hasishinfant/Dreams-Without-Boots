import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import StoryMode from './components/StoryMode';
import WorldCupMode from './components/WorldCupMode';
import LegacyEnding from './components/LegacyEnding';

export default function App() {
  const [currentMode, setCurrentMode] = useState('menu'); // menu, story, worldcup, ending
  const [unlockedWorldCup, setUnlockedWorldCup] = useState(false);

  const navigateTo = (mode) => {
    setCurrentMode(mode);
  };

  const handleStoryComplete = () => {
    setUnlockedWorldCup(true);
    setCurrentMode('menu'); // Go back to menu so they can select World Cup Mode
  };

  return (
    <div className="app-container">
      {currentMode === 'menu' && (
        <MainMenu 
          navigateTo={navigateTo} 
          unlockedWorldCup={unlockedWorldCup} 
        />
      )}
      {currentMode === 'story' && (
        <StoryMode onComplete={handleStoryComplete} />
      )}
      {currentMode === 'worldcup' && (
        <WorldCupMode onComplete={() => navigateTo('ending')} />
      )}
      {currentMode === 'ending' && (
        <LegacyEnding onComplete={() => navigateTo('menu')} />
      )}
    </div>
  );
}
