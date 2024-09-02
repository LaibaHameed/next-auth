import React from 'react'
import '../../globals.css';

const page = ({params}:any) => {
  return (
    <div className='box'>
    <div className="form-box">
        <form className="form">
          <span className="title"> Profile Page</span>
          <span className="subtitle">{params.id}</span>
        </form>
      </div>
    </div>
  )
}

export default page