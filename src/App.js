import React from 'react';
import VoiceBot from './components/VoiceBot';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Pallab Sar - Voice Interview Bot</h1>
          <p className="subtitle">100x.inc Application</p>
          <p className="tagline">Ask me anything about my background, skills, and experience</p>
        </div>
      </header>
      
      <main className="app-main">
        <VoiceBot />
      </main>
      
      <footer className="app-footer">
        <p>Built with React, Web Speech API, and gpt-oss-120b</p>
        <p className="challenge-badge">⚡ 48-hour build challenge</p>
      </footer>
    </div>
  );
}

export default App;
