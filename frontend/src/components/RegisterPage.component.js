import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom'
import axios from 'axios';

function RegisterPage() {
  const USER_REGEX = new RegExp(/^[A-z][A-z0-9-_]{3,23}$/);
  const EMAIL_REGEX = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/);
  const PWD_REGEX = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [validPwd, setValidPwd] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setValidName(USER_REGEX.test(userInfo.name));
  }, [userInfo.name]);
  
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(userInfo.password));
  }, [userInfo.password]);
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(userInfo.email));
  }, [userInfo.email]);

  useEffect(() => {
    setErrMsg("");
  }, [userInfo.name, userInfo.password, userInfo.email]);

  
  let navigate = useNavigate(); 
  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(userInfo.name);
    const v2 = PWD_REGEX.test(userInfo.password);
    const v3 = PWD_REGEX.test(userInfo.email);
    console.log(v1);
    if (!v1) {
      setErrMsg("Invalid Username. Must be 4 to 24 characters and begin with a letter. " +
      "Letters, numbers, underscores and hyphens are allowed.");
      return;
    }
    if (!v3) {
      setErrMsg("Invalid Email");
      return;
    }
    if (!v2) {
      setErrMsg("Invalid Password. Must be 8 to 24 characters and include uppercase and lowercase letters," +
      " a number and a special character.");
      return;
    }
  

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
          aria-invalid={validName ? "false" : "true"}
          required
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
          aria-invalid={validEmail ? "false" : "true"}
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
          aria-invalid={validPwd ? "false" : "true"}
          required
          value={userInfo.password}
          onChange={handleInputChange}
        />
      </div>
      <p>{errMsg != "" ? errMsg: ""}</p>

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
