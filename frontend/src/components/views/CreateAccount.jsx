import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import { Link, useNavigate } from "react-router-dom";
import config from "../../Config";
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;


function CreateAccount() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [postDaddy, setPostDaddy] = useState(null);
  

  const handleFNChange = (event) => {
    setFirstName(event.target.value)
    return;
  }

  const handleLNChange = (event) => {
    setLastName(event.target.value)
    return;
  }

  const handleUNChange = (event) => {
    setUsername(event.target.value)
    return;
  }

  const handlePWChange = (event) => {
    setPassword(event.target.value)
    return;
  }

  const clearFields = () => {
    setLastName('');
    setFirstName('')
    setPassword('')
    setUsername('')
  }

  const validateInputs = () =>{
    const { firstName, lastName, username, password } = postDaddy;
    let validFirst = firstName ? (firstName.length ? true : false) : false;
    let validLast = lastName ? (lastName.length ? true : false) : false;
    let validPassword = password ? (password.length > 7 ? true : alert('Password must be at least 8 characters.')) : false;
    let validUsername = username ? (username.length ? true : false) : false;

    if(validFirst && validLast&& validPassword && validUsername) return true;
    else return false;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if(validateInputs()){
      fetch(ApiUrl +'/CreateAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postDaddy)
      })
      .then(res => res.json())
      .then(res => {
        clearFields();
        alert(res);
        navigate(`/Login`);
        navigate("/");
        })
      .catch(err => {
        console.log(err);
      })
    }else{
      alert('All highlighted fields must be filled out.')
    }
  }

  //SET THE POST BODY EACH TIME A FIELD CHANGES
  useEffect(() => {
    setPostDaddy({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password
    })
  }, [password, username, firstName, lastName])


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="first_name">First Name:</label>
        <input type="text" id="first_name" value={firstName} onChange={handleFNChange} />
      </div>
      <div>
        <label htmlFor="last_name">Last Name:</label>
        <input type="text" id="last_name" value={lastName} onChange={handleLNChange} />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" value={username} onChange={handleUNChange}/>
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handlePWChange} />
      </div>
      <div>
        <Link to="/"><button type ="submit"> Back to Login</button></Link>
        <button input type='submit' className='submit-button' value='Create User' onClick={handleSubmit}>Create Account</button>
      </div>
    </form>
  );
  
}

export default CreateAccount;
