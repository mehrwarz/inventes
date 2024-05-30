"use client"
import React, { useState } from 'react'

const SysAdmin = async(data) => {
  const onButtonClick = () => {
    console.log("Button clicked");
    console.log(data);
  }

  return (
   <main>
    <h1>Login</h1>
    <button type="button" onClick={onButtonClick}>Click</button>
    <p>Data: {data.message}</p>
   </main>
  )
}

export default SysAdmin