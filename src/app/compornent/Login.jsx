"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Swal from 'sweetalert2';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize router
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data)
      if (data.message == "Login successful") {
        Swal.fire({
          title: "Welcome to ponmart",
          text: "Let’s go",
          icon: "success"
        });
        onLogin(); // Trigger login success
        sessionStorage.setItem('Bool', true);
        router.push('/pos'); // Redirect to the home page
      } else {
        Swal.fire({
          title: "Invalid credentials",
          text: data.message || "Please try again.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error"
      });
    }
  };

  return (
    <div className='w-full h-screen bg-gray-800 p-12'>
      <div className='mx-auto bg-white w-2/4 h-full border shadow-lg rounded-lg p-8'>
        <form className='flex flex-col items-center h-full justify-center' onSubmit={handleSubmit}>
          <h1 className='text-4xl font-bold my-4'>PONMART</h1>
          <div className='mb-4 w-2/4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
              Username
            </label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='mb-6 w-2/4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border-gray-400 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
