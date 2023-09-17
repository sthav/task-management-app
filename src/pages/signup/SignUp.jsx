import { Link } from "react-router-dom";
import "./SignUp.scss";
// import { auth } from '../../firebase';


// SignUp.js
import { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
// import firebase from 'firebase/app';
// import 'firebase/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth()

    const handleSignUp = async () => {

        signup(email, password)
        // User is signed up

    };

    return (
        <div>
            <h2>Sign Up</h2>
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
            <button onClick={handleSignUp}>Sign Up</button>
            <Link to={'/'}>Have an account? click on login</Link>
        </div>
    );
};

export default SignUp;
