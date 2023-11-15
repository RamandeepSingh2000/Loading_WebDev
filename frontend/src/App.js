
import React from 'react';
import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import GameInfoPage from './GameInfoPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p> Landing page </p>
        
      </header>

      <div> 
        <BrowserRouter>
        
        <Routes>
                  {/* Log In / Sign Up */}
                  <Route path='/game-info' element={ <GameInfoPage/>}/>

          </Routes>
        </BrowserRouter>
      </div>

    </div>
  );
}

export default App;
