"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useParams } from 'next/navigation'; 
import Swal from 'sweetalert2';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams(); // ดึงค่า ID จาก URL
  const [product, setProduct] = useState({
    nameProduct: '',
    price: '',
    type: '',
    imgUrl: null // เปลี่ยนเป็น null เพื่อรองรับการอัปโหลดไฟล์
  });

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Function to fetch product details
  async function fetchProduct(id) {
    try {
      const res = await fetch(`${apiUrl}/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // สร้าง FormData ใหม่

    // เพิ่มข้อมูลผลิตภัณฑ์ไปยัง FormData
    formData.append('nameProduct', product.nameProduct);
    formData.append('price', product.price);
    formData.append('type', product.type);
    if (product.imgUrl) {
      formData.append('productImage', product.imgUrl); // เพิ่มไฟล์รูปภาพถ้ามี
    }

    try {
      const response = await fetch(`${apiUrl}/products/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

    
      Swal.fire('Updated!', 'Your product has been updated.', 'success');
      router.push('/stock'); // Navigate back to the product list after update
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Failed to update product', 'error');
    }
  };

  return (
    <div className='py-8 px-24 h-full'>
      <div className='bg-white rounded-xl shadow-md w-full h-full'>
        <h1 className='text-4xl p-4'>Edit Product</h1>
        <form onSubmit={handleSubmit} className='p-4'>
          <div className='mb-4'>
            <label className='block text-gray-700'>Product Name</label>
            <input
              type='text'
              value={product.nameProduct}
              onChange={(e) => setProduct({ ...product, nameProduct: e.target.value })}
              className='border p-2 w-full'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Price</label>
            <input
              type='number'
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className='border p-2 w-full'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Type</label>
            <input
              type='text'
              value={product.type}
              onChange={(e) => setProduct({ ...product, type: e.target.value })}
              className='border p-2 w-full'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Upload Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setProduct({ ...product, imgUrl: e.target.files[0] })} // เก็บไฟล์ที่เลือก
              className='border p-2 w-full'
            />
          </div>
          <button type='submit' className='bg-blue-600 text-white p-2 rounded-lg'>Update Product</button>
        </form>
      </div>
    </div>
  );
}
