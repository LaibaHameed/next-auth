'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '../globals.css';

const ProfilrPage = () => {
  const router = useRouter();
  const [data, setData] = useState("");

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me");
      console.log("User ID:", response.data?.data?._id);
      setData(response.data.data._id);
    } catch (error: any) {
      console.log("Error:", error);
      toast.error(error.message);
    }
  }


  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className='box'>
      <div className="form-box">
        <form className="form">
          <span className="title">Profile</span>
          <span className="subtitle">
            {data ? <Link href={`/profile/${data}`}>{data}</Link> : "nothing to display"}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              getUserDetails();
            }}>
            Get Details
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}>
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilrPage