'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../globals.css';
// import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {

  // const router = useRouter();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async ()=>{
  try {
      axios.post("/api/users/verifyemail", {token});
      setVerified(true);
      setError(false);
  } catch (error:any) {
    setError(true);
    console.log(error.response.data);
    toast.error(error.message);
  }
  }
  
  useEffect(() => {
    setError(false);
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
    // const {query} = router;
    // const urlTokenTwo = query.token;
  }, []);

  useEffect(() => {
    setError(false);
    if(token.length > 0){
      verifyUserEmail();
    }
  }, [token])
  
  
  return (
    <div className='box'>
    <div className="form-box">
        <form className="form">
          <span className="title"> Veify Email</span>
          <span className="subtitle">Token</span>
          <span className="subtitle">{token ? `${token}` : "No Token"}</span>
          {verified && (
            <>
            <h2>verified</h2>
            <p>you can login to your account? <Link href='/login'>login</Link> </p>
            </>
        )}
          {error && (
            <>
            <h2 className='text-red-600'>Error</h2>
            </>
        )}
        </form>
      </div>
    </div>
  )
}

export default VerifyEmailPage