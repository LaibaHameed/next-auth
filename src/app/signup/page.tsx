'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import '../globals.css';

const Signuppage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: ""
  });
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSignup = async () => {
    try {
      setLoading(true);
      // is route py poncha do, yaha se sara kam ho k aye ga(functionality)
      const response = await axios.post('/api/users/signup', user);
      // agr signup successfully ho gaya hai toh login route py push kr do
      if (response.status === 200 || response.data.success) {  // adjust based on your API response structure
        router.push('/login');
      } else {
        toast.error(response.data.message || "Signup failed");
      }

    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  //jb tk email, password, or username ki fields empty hon tb tk button diable rkho 
  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
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
          onSignup();
        }}>
          <span className="title">{loading ? "Processing" : "Sign up"}</span>
          <span className="subtitle">Create a free account with your email.</span>
          <div className="form-container">
            
            <input id='username'
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              type="text" className="input" placeholder="User Name" />

            <input id='email'
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              type="email" className="input" placeholder="Email" />

            <input id='password'
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })} 
              type="password" className="input" placeholder="Password" />
          </div>
          {/* agr buttonDisabled ya loading true ho  toh disable*/}
          <button type="submit" disabled={buttonDisabled || loading}>
            {loading ? "Processing..." : "Sign up"}
          </button>
        </form>
        <div className="form-section">
          <p>Have an account? <Link href='/login'>Log in</Link> </p>
        </div>
      </div>
    </div>
  )
}

export default Signuppage