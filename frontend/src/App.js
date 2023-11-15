
import React from 'react';
import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from "./components/navigation.component";
import GameInfoPage from './GameInfoPage';
import Home from './components/home.component';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App">
      {/* <Home/> */}
      <Navigation/>

      <div> 
        <BrowserRouter>
        
          <Routes>
                 
            <Route path='/game-info' element={ <GameInfoPage/>}/>
            <Route path='/' element={ <Home/>}/>

          </Routes>
        </BrowserRouter>
      </div>

    </div>
  );
}

export default App;
