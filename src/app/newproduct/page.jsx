"use client";
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function NewProduct() {
  const [nameProduct, setNameProduct] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Handle file selection
  const handleFileChange = (e) => {
    setImgFile(e.target.files[0]); // Set selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object
    const formData = new FormData();
    formData.append('nameProduct', nameProduct);
    formData.append('price', price);
    formData.append('type', type);
    formData.append('productImage', imgFile); // Append the selected image file

    try {
      const response = await fetch(`${apiUrl}/product/uploads`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload product.');
      }

      const data = await response.json();
      console.log('Product uploaded successfully:', data);
      
      // Show success alert
      await Swal.fire({
        title: 'สำเร็จ!',
        text: 'สินค้าเพิ่มสำเร็จ',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      
      // Optionally reset the form after successful submission
      setNameProduct('');
      setPrice('');
      setType('');
      setImgFile(null);
      
    } catch (error) {
      console.error('Error:', error);
      
      // Show error alert
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'การอัปโหลดล้มเหลว โปรดลองอีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  return (
    <div className='p-12'>
      <div className='w-full h-full bg-white shadow-md rounded-lg p-4'>
        <h1 className='text-3xl px-6 pt-4'>เพิ่มสินค้า</h1>

        <form onSubmit={handleSubmit} className='px-8 pt-4 space-y-4'>
          <div>
            <label className='block mb-2'>ชื่อสินค้า</label>
            <input
              type='text'
              value={nameProduct}
              onChange={(e) => setNameProduct(e.target.value)}
              className='p-2 border border-gray-300 rounded-lg w-full'
              required
            />
          </div>

          <div>
            <label className='block mb-2'>ราคา</label>
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='p-2 border border-gray-300 rounded-lg w-full'
              required
            />
          </div>

          <div>
            <label className='block mb-2'>ประเภทสินค้า</label>
            <input
              type='text'
              value={type}
              onChange={(e) => setType(e.target.value)}
              className='p-2 border border-gray-300 rounded-lg w-full'
              required
            />
          </div>

          <div>
            <label className='block mb-2'>รูปภาพ</label>
            <input
              type='file'
              onChange={handleFileChange}
              className='p-2 border border-gray-300 rounded-lg w-full'
              accept='image/*'
              required
            />
          </div>

          <button type='submit' className='bg-green-600 text-white p-2 rounded-lg'>
            เพิ่มสินค้า
          </button>
        </form>
      </div>
    </div>
  );
}
