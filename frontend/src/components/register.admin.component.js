import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom'
import axios from 'axios';
const helper = require('../helper');

function AdminRegisterPage(props) {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errorMessages, setErrorMessages] = useState([]);
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
    const bearerToken = localStorage.getItem('jwtToken');
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };
    // Send formData to server
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/adminregister`,
        formData,
        config
      );
      console.log(response.data);
    } catch (error) {
      const errors = [];
      const checkErrors = error.response.data.checkErrors;
      if(checkErrors){
        checkErrors.forEach(err => {
          errors.push(err.msg);
        })
      }

      if(error.message){
        errors.push(error.message);
      }
      
      setErrorMessages(errors);
      return;
    }
    

    setUserInfo({
      username: '',
      email: '',
      password: ''
    });

    setErrorMessages([])
    navigate("/admin");
  };

  return (
    
    <form
      onSubmit={handleRegisterSubmit}
      className="container"
      style={{textAlign: 'left'}}
    >
      {
        errorMessages.length > 0 && (
          <div>
            {
              errorMessages.map((error, key) => {
                return(
                  <p class="text-danger" key={key}>{error}</p>);
              })
            }
          </div>          
          )
      }
      <div className='row' style={{marginTop: 1 + "rem"}}>
        <div className='col'>
        <img src="/gaming_image.jpg" className='rounded float-start' style={{ width: 100 + "%", height: "auto" }} alt="Display" /> 
        </div>
        <div className='col'>
        <p style={{fontWeight: 'bold', fontSize: 3 + "em", marginLeft: 0, marginTop: .3 + "rem"}}>Register Admin</p>
        <div className="form-group">
        <label htmlFor="username" style={{fontWeight: 'bolder'}}>Username</label>
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
        <label htmlFor="email" style={{fontWeight: 'bolder'}}>Email</label>
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
        <label htmlFor="password" style={{fontWeight: 'bolder'}}>Password</label>
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
      <button type="submit" className="btn btn-primary" style={{marginTop: 1 + "rem"}}>
        Register
      </button>
        </div>
        </div>      
    </form>
  );
}

export default AdminRegisterPage;
