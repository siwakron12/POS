
import { FaHome } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import React from 'react'
import { FaBarsStaggered } from "react-icons/fa6";
import Link from "next/link";
import { AiFillProduct } from "react-icons/ai";

export default function Aside() {
  return (
    <div className=" w-[220px] h-screen rounded-lg bg-white  ">
        <nav className=' flex flex-col p-4'>
           <div className='w-full flex flex-col items-center space-y-12'>
            <div className="flex text-2xl mt-12 items-center space-x-2">
            <FaHome />
            <Link href="/"> <h1 className=''>HOME</h1></Link>
           
            </div>
         
           <div className="flex  text-2xl items-center space-x-2">
           <FaBarsStaggered/>
           <Link href="pos"> <h1>POS</h1></Link>
           </div>
        
       
           <div className="flex  text-2xl items-center space-x-2">
           < AiFillProduct />
           <Link href="stock"> <h1>STOCK</h1></Link>
           </div>
           
           <div className="flex  text-2xl items-center space-x-2">
           < FaMoneyBillTrendUp />
           <Link href="Sales"> <h1>SALES</h1></Link>
           </div>
            

           </div>
        
        </nav>
    </div>
  )
}
