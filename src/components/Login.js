import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  
//   useEffect(() => {
//     axios.get('http://localhost:8080/csrf-token', { withCredentials: true })
//         .then(response => {
//             setCsrfToken(response.data.token);
//         })
//         .catch(error => {
//             console.error('Error fetching CSRF token:', error);
//         });
// }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
    //   const response = axios.post('http://localhost:8080/auth/login', { email, password }, {
    //     headers: {
    //         'X-CSRF-TOKEN': csrfToken
    //     },
    //     withCredentials: true
    // })
    const response = await axios.post('http://localhost:8080/auth/login', { email, password });
      if (response.data === "User logged in successfully") {
        console.log('Login successful: ', response.data);
        navigate('/join-room', { state: { email } });
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Login failed: ', error);
    }
  };

  return (
    <div className="login-container centered-page">
      <form onSubmit={handleLogin} className="form-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
