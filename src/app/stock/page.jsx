"use client";
import React, { useEffect, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { useRouter } from 'next/navigation'; // Import useRouter
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Page() {
  let [products, setProducts] = useState([]);
  const router = useRouter(); // Initialize useRouter
  
  // Fetch products on component mount
  useEffect(() => {
    fetchProduct();
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Function to fetch products
  async function fetchProduct() {
    try {
      let res = await fetch(`${apiUrl}/products`);
      let data = await res.json();
      setProducts(data); // Update to set the fetched data
      console.log(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }

  // Navigate to new product page
  const navigate = () => {
    router.push('/newproduct');
  };

  // Function to remove a product
  const removeProduct = async (id) => {
    // Use SweetAlert2 for confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}/products/remove/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the product');
        }

        const data = await response.json();
        console.log('Product deleted:', data);
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );

        // Re-fetch products after deletion
        fetchProduct();
      } catch (error) {
        console.error('Error:', error);
        Swal.fire(
          'Error!',
          'Failed to remove product',
          'error'
        );
      }
    }
  };

  return (
    <div className='py-8 px-24 h-full'>
      <div className='bg-white rounded-xl shadow-md w-full h-full'>
        <div className='items-center flex justify-between h-[75px] px-12'>
          <h1 className='text-4xl'>จัดการสินค้า</h1>
          <button onClick={navigate} className='text-xl bg-green-600 text-white p-2 rounded-lg flex items-center'>
            เพิ่มสินค้า <IoIosAddCircle className='' />
          </button>
        </div>

        {/* Table Header */}
        <section className='p-4'>
          <div className='p-2 w-full bg-slate-600 text-white grid grid-cols-6 place-items-center'>
            <p>ชื่อสินค้า</p>
            <p>ราคา</p>
            <p>ประเภท</p>
            <p>รูปภาพ</p>
            <p className="col-span-2 text-center">การจัดการ</p> {/* Spanning 2 columns for Edit and Remove */}
          </div>
        </section>

        {/* Table Body */}
       {/* Conditional check to ensure products is an array before mapping */}
{Array.isArray(products) && products.length > 0 ? (
  products.map((product) => (
    <section className='p-2' key={product.id}>
      <div className='p-2 w-full bg-gray-100 text-black grid grid-cols-6 place-items-center'>
        <p>{product.nameProduct}</p>
        <p>{product.price}</p>
        <p>{product.type}</p>
        <img className="w-16 h-16" src={`${process.env.NEXT_PUBLIC_IMG_URL}${product.imgUrl}`} alt={product.nameProduct} />
        <div className='flex space-x-2 col-span-2'>
          <button
            className='w-fit text-center bg-blue-600 text-white p-2 rounded-lg'
            onClick={() => router.push(`/editproduct/${product.id}`)} // Navigate to edit page
          >
            Edit
          </button>
          <button
            className='w-fit text-center bg-red-500 text-white p-2 rounded-lg'
            onClick={() => removeProduct(product.id)} // Call removeProduct with product ID
          >
            Remove
          </button>
        </div>
      </div>
    </section>
  ))
) : (
  <p className="text-center">No products available</p>
)}

      </div>
    </div>
  );
}
