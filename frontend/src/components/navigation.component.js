import React, {Component} from "react";
import logo from '../images/logo.png'

export default class Navigation extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div class="header_section">
         <div class="container-fluid">
            <nav class="navbar navbar-expand-lg navbar-light">
               <a class="navbar-brand"href="index.html"></a>
               <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
               <span class="navbar-toggler-icon"></span>
               </button>
               <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-item App-logo">
                      <img src={logo} className="App-logo"/>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="my-games">My Games</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="login">Login</a>
                    </li>
                  </ul>
                  <form class="form-inline my-2 my-lg-0">
                     <div class="search_icon"><i class="fa fa-search" aria-hidden="true"></i></div>
                  </form>
               </div>
            </nav>
         </div>
      </div>
    )
  }
}