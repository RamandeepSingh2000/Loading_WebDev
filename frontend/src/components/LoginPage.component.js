import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
const helper = require('../helper');

function LoginPage(props) {
  
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  let navigate = useNavigate(); 
  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', userInfo.username);
    formData.append('password', userInfo.password);

    // Send formData to server
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/login`,
        formData
      );
      var token = response.data.token;
      helper.login(token);
      props.setIsLoggedIn(true);
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }

    setUserInfo({
      username: '',
      password: ''
    });

    if(helper.isUserAdmin()){
      navigate("/admin");
    }
    else{
      navigate("/");
    }   
    
  };

  return (
    <form
      onSubmit={handleLoginSubmit}
      className="container"
      style={{textAlign: 'left'}}
    >
      {
        errorMessage != null && (
          <p class="text-danger">{errorMessage}</p>
          )
      }
      <div className='row' style={{marginTop: 1 + "rem"}}>
        <div className='col'>
        <img src="/gaming_image.jpg" className='rounded float-start' style={{ width: 100 + "%", height: "auto" }} alt="Display" /> 
        </div>
        <div className='col'>
        <p style={{fontWeight: 'bold', fontSize: 3 + "em", marginLeft: 0, marginTop: .3 + "rem"}}> Login </p>
      <div className="form-group">
        <label htmlFor="username" style={{fontWeight: 'bolder'}}>Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={userInfo.username}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" style={{fontWeight: 'bolder'}}>Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={userInfo.password}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{marginTop: 1 + "rem"}}>
        Login
      </button>

      <p style={{fontWeight: 'bold', fontSize: 1 + "em", marginLeft: 0}}>Don't have an account?</p>
      <button type="button" className="btn btn-primary">
        <Link to="/register" >Register</Link>
      </button>
        </div>
      </div>
      
    </form>
  );
}

export default LoginPage;
