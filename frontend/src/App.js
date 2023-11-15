import React from 'react';
import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navigation from "./components/navigation.component";
import GameUploadForm from './components/upload.component';
import GameInfoPage from './GameInfoPage';
import Home from './components/home.component';


function App() {
  return (
    <div className="App">
      {/* <Home/> */}
      <Navigation/>

      <div> 
        <BrowserRouter>
          <Routes>
            <Route path='/game-info' element={ <GameInfoPage/>}/>
            <Route path='/game-upload' element={ <GameUploadForm/>}/>
            <Route path='/' element={ <Home/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
