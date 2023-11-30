import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom'
import axios from 'axios';
const helper = require('../helper');

function RegisterPage(props) {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: ''
  });
  let navigate = useNavigate(); 
  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); 

    let formData = new URLSearchParams();

    formData.append('username', userInfo.username);
    formData.append('email', userInfo.email);
    formData.append('password', userInfo.password);

    // Send formData to server
    try {
      const response = await axios.post(
        `http://localhost:8081/api/register`,
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    

    setUserInfo({
      username: '',
      email: '',
      password: ''
    });
    //login
    try {
      const response = await axios.post(
        `http://localhost:8081/api/login`,
        formData
      );
      var token = response.data.token;
      helper.login(token);
      props.setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
    navigate("/");
  };

  return (
    
    <form
      onSubmit={handleRegisterSubmit}
      className="container"
    >
      <p> Create an Account </p>
      <p>Enter your details below</p>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          required
          value={userInfo.username}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          className="form-control"
          id="email"
          name="email"
          required
          value={userInfo.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          required
          value={userInfo.password}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
      <p>Already have an account?</p>
      <button type="button" className="btn btn-primary">
        <Link to="/login" >Login</Link>
      </button>
    </form>
  );
}

export default RegisterPage;
