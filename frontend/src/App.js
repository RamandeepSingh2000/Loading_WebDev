import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameUploadForm from './components/upload.component';
import GameInfoPage from './GameInfoPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p> Landing page </p>
      </header>

      <GameUploadForm />

      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/game-info" element={<GameInfoPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
