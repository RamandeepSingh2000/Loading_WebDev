import React, {Component} from "react";
import logo from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
const helper = require('../helper');

export default class Navigation extends Component{
  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    helper.logout();
    this.props.navigation.navigate("/");
    this.props.setIsLoggedIn(false);
  };

  render(){
    return(
      <div class="header_section">
         <div class="container-fluid">
            <nav class="navbar navbar-expand-lg navbar-light">
               <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
               <span class="navbar-toggler-icon"></span>
               </button>
               <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-item App-logo">
                      <img src={logo} className="App-logo"/>
                    </li>
                    <li class="nav-item">
                      <Link to="/" class="nav-link" >Home</Link>
                    </li>
                    <li class="nav-item">
                    {this.props.isLoggedIn && (
                      // If logged in, show Upload Game link
                      <Link to="/game-upload" className="nav-link">
                        Upload Game
                      </Link>
                    )}
                    </li>
                    <li class="nav-item">
                    {this.props.isLoggedIn ? (
                      // If logged in, show Logout link
                      <Link to="/" onClick={this.handleLogout} className="nav-link">
                        Logout
                      </Link>
                    ) : (
                      // If not logged in, show Login link
                      <Link to="/login" className="nav-link">
                        Login
                      </Link>
                    )}
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