import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Context from '../../Context';
import config from '../../Config';

const ApiUrl = config[process.env.REACT_APP_NODE_ENV || 'development'].apiUrl;

const Login = () => {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState(null);
  const [loginPass, setLoginPass] = useState(null);
  const [postBody, setPostBody] = useState(null);
  const { setIsSpecificInventory, setRefresh, setCookies } = useContext(Context);

  const handleLoginName = (event) => {
    setLoginName(event.target.value);
  };

  const handleLoginPass = (event) => {
    setLoginPass(event.target.value);
  };

  const clearFields = () => {
    setLoginPass('');
    setLoginName('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let username = postBody.username;
    try {
      const res = await fetch(`${ApiUrl}/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody),
        credentials: 'include',
      });
      if (res.status === 202) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // store token in local storage
        document.cookie = `username=${username}`;
        document.cookie = 'loggedIn=true';
        setTimeout(() => navigate(`/items/${username}`), 500);
        alert('Login successful!'); // display message on successful login
      } else {
        throw new Error('Login failed');
      }
      clearFields();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setPostBody({
      username: loginName,
      password: loginPass,
    });
  }, [loginName, loginPass]);

  return (
    <div className='create-item'>
      <div className='login-header'>
        <h1 className='login-text'>Login</h1>
      </div>
      <form className='create-user'>
        <label htmlFor='username' minLength='1'>
          Username:
        </label>
        <input type='text' required='required' id='username' onChange={handleLoginName} />
        <label htmlFor='password' minLength='1'>
          Password:
        </label>
        <input type='password' required='required' id='password' onChange={handleLoginPass} />
        <div>
          <input type='submit' className='submit-button' defaultValue='Login' onClick={handleSubmit} />
          <Link to='/createAccount'>
            <button type='button'>Create an Account</button>
          </Link>
          <Link to='/itemsGuest'>
            <button type='button'>View as Guest</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
