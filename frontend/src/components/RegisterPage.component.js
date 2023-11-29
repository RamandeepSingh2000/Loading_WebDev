import React, { useState, useRef } from 'react';
import { Link, useNavigate  } from 'react-router-dom'
import axios from 'axios';

function RegisterPage() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: ''
  });
  let navigate = useNavigate(); 
  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();


    formData.append('name', userInfo.name);
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
      name: '',
      email: '',
      password: ''
    });
    //login
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
    navigate("/");
  };

  return (
    
    <form
      onSubmit={handleRegisterSubmit}
      encType="multipart/form-data"
      className="container"
    >
      <h1> Create an Account </h1>
      <p>Enter your details below</p>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={userInfo.name}
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
