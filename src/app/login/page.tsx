'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import '../globals.css';
import Link from 'next/link';

const LoginPage = () => {

  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const router = useRouter()
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/login', user);
      if (response.status === 200 || response.data.success) { 
        router.push('/profile');
      } else {
        toast.error(response.data.message || "login failed");
      }
    } catch (error: any) {
      console.log("login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user])

  return (
    <div className='box'>
    <div className="form-box">
    <form className="form" onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}>
          <span className="title">Login</span>
          <span className="subtitle">Login your account with email.</span>
          <div className="form-container">
          <input id='email'
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })} type="email" className="input" placeholder="Email" />

            <input id='password'
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" className="input" placeholder="Password" />
          </div>
          <button type="submit" disabled={buttonDisabled || loading}>
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
        <div className="form-section">
        <p>don't have an account? <Link href='/signup'>sign up</Link> </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage