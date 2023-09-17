import "./Login.scss";
import { useState } from 'react';
// import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth()

    const navigate = useNavigate();

    const handleLogin = async () => {
        login(email, password)
        navigate('/tasks');

    };

    return (
        <div>
            <h2>Log In</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <Link to={'/signup'}>dont have an account? click to signup</Link>
            <Link to={'/signup'}>forgot password?</Link>
        </div>
    );
};

export default Login
