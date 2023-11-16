import React from 'react';
import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navigation from "./components/navigation.component";
import GameUploadForm from './components/upload.component';
import GameInfoPage from './components/GameInfoPage';
import Home from './components/home.component';
import GameEditPage from './components/edit.component';

function App() {
  return (
    <div className="App">
      {/* <Home/> */}    

      <div> 
        <BrowserRouter>
        <Navigation/>
          <Routes>
            <Route path='/game-info/:id' element={ <GameInfoPage/>}/>
            <Route path='/game-upload' element={ <GameUploadForm/>}/>
            <Route path='/game-edit/:id' element={ <GameEditPage/>}/>
            <Route path='/' element={ <Home/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
