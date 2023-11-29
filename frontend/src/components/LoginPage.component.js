import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

function LoginPage() {
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: ''
  });
  let navigate = useNavigate(); 
  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();


    formData.append('name', userInfo.name);
    formData.append('email', userInfo.email);
    formData.append('password', userInfo.password);

    // Send formData to server
    try {
      const response = await axios.post(
        `http://localhost:8081/api/login`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    setUserInfo({
      name: '',
      email: '',
      password: ''
    });
    navigate("/");
    
  };

  return (
    <form
      onSubmit={handleLoginSubmit}
      encType="multipart/form-data"
      className="container"
    >
      <h1> Login </h1>
      <p>Enter your details below</p>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          className="form-control"
          id="email"
          name="email"
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
          value={userInfo.password}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Login
      </button>

      <p>Don't have an account?</p>
      <button type="button" className="btn btn-primary">
        <Link to="/register" >Register</Link>
      </button>
    </form>
  );
}

export default LoginPage;
