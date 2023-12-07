import React, {Component} from "react";
import logo from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
const helper = require('../helper');

export default class Navigation extends Component{
  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    this.props.setIsLoggedIn(false);
    helper.logout();    
    this.props.navigation.navigate("/");    
  };

  render(){
    return(
      
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
              <div class="container-fluid">
               <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
               <span class="navbar-toggler-icon"></span>
               </button>
               <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-item App-logo">
                      <img src={logo} className="App-logo"/>
                    </li>                    
                    <li class="nav-item">
                    {this.props.isLoggedIn && helper.isUserAdmin() ? (
                      <Link to="/admin" className="nav-link">Home</Link>
                    ) : (
                      <Link to="/" className="nav-link">Home</Link>
                    )}
                    </li>
                    {
                      (this.props.isLoggedIn && helper.isUserAdmin()) && (
                        <li class="nav-item">
                          <Link to="/admin/register" className="nav-link">New Admin</Link>
                        </li>
                        )
                    }
                    <li class="nav-item">
                    {(this.props.isLoggedIn && !helper.isUserAdmin()) && (
                        <Link to="/game-upload" className="nav-link">
                          Upload Game
                        </Link>                    
                    )}
                    </li>
                    <li class="nav-item">
                    {(this.props.isLoggedIn && !helper.isUserAdmin()) && (
                        <Link to={"/owned-games/" + helper.getUserId()} className="nav-link">
                          Owned Games
                        </Link>                    
                    )}
                    </li>
                    <li class="nav-item">
                    {(this.props.isLoggedIn && !helper.isUserAdmin()) && (
                        <Link to={"/purchased-games/" + helper.getUserId()} className="nav-link">
                          Purchased Games
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
               </div>
               {this.props.isLoggedIn && (
                      // If logged in, show Logout link
                      <span class="navbar-text text-success" style={{fontWeight: 'bold', fontSize: 1.5 + "em"}}>
                        {
                          helper.getUsername()
                        }
                      </span>
                    )}
               </div>
            </nav>
    )
  }
}