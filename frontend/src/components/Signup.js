import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../App';

function Signup() {
    const { user, setUser } = useContext(AuthContext);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [usn, setUsn] = useState('');
    const [className, setClassName] = useState('');
    const [branch, setBranch] = useState('');
    const [role, setRole] = useState('student');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/signup', {
                phone,
                name,
                password,
                usn,
                class: className,
                branch,
                role
            });
            setUser({ userId: res.data.userId, name, role });
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
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="USN" onChange={(e) => setUsn(e.target.value)} required />
                <input type="text" placeholder="Class" onChange={(e) => setClassName(e.target.value)} required />
                <input type="text" placeholder="Branch" onChange={(e) => setBranch(e.target.value)} required />
                <select onChange={(e) => setRole(e.target.value)} required>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;
