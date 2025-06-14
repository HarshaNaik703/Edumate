import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../App';

function Login() {
  const { user, setUser } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { phone, password, role });
      setUser({ userId: res.data.userId, name: phone, role });
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <select onChange={(e) => setRole(e.target.value)} required>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
