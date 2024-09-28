"use client";
import { useState } from 'react';
import Aside from "./compornent/Aside"; // Ensure the path is correct
import Login from "./compornent/Login"; // Ensure the path is correct
import { Providers } from './providers';
import './globals.css'; // Ensure this path is correct
import { Prompt } from '@next/font/google';

const prompt = Prompt({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify the weights you want
});

export default function RootLayout({ children }) {
  // Check if 'Bool' is true in sessionStorage initially
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('Bool') === 'true');

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('Bool', 'true'); // Set 'Bool' to true in sessionStorage on login
  };

  return (
    <html lang="en">
      <body className={prompt.className}>
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} /> // Pass handleLogin to set auth state
        ) : (
          <Providers>
            <div className="flex">
              <Aside />
              <div className="w-full bg-gray-700">
                {children}
              </div>
            </div>
          </Providers>
        )}
      </body>
    </html>
  );
}
