import React, { useState } from 'react';
import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navigation from "./components/navigation.component";
import GameUploadForm from './components/upload.component';
import GameInfoPage from './components/GameInfoPage';
import Home from './components/home.component';
import GameEditPage from './components/edit.component';
import OwnedGames from './components/OwnedGames';
import PurchasedGames from './components/PurchasedGames';
import LoginPage from './components/LoginPage.component'
import RegisterPage from './components/RegisterPage.component'
import helper from './helper'
import HomeAdmin from './components/home.admin.component';
import AdminRegisterPage from "./components/register.admin.component";
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(helper.isLoggedIn());

  return (
    <div className="App">
      {/* <Home/> */}    

      <div> 
        <BrowserRouter>
        <Navigation isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn}/>
          <Routes>
            <Route path='/login' element={ <LoginPage isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn}/>}/>
            <Route path='/register' element={ <RegisterPage isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn}/>}/>
            <Route path='/admin/register' element={ <AdminRegisterPage isLoggedIn = {isLoggedIn} setIsLoggedIn = {setIsLoggedIn}/>}/>
            <Route path='/game-info/:id' element={ <GameInfoPage/>}/>
            <Route path='/game-upload' element={ <GameUploadForm/>}/>
            <Route path='/owned-games/:id' element={ <OwnedGames/>}/>
            <Route path='/purchased-games/:id' element={ <PurchasedGames/>}/>
            <Route path='/game-edit/:id' element={ <GameEditPage/>}/>
            <Route path='/' element={ <Home/>}/>
            <Route path='/admin' element={ <HomeAdmin/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
