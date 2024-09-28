'use client';  // This is necessary for Next.js Client Components
import { SiPrestashop } from "react-icons/si";
import React, { useEffect, useState } from 'react';
// Ensure correct path to Total component
import Swal from 'sweetalert2';
import Total from '../compornent/Total';
import { Select } from '@chakra-ui/react';
import { FaShoppingBasket } from "react-icons/fa";
export default function Page() {
    let [selectedValue, setSelectedValue] = useState();
    let [data, setData] = useState(() => {
        const savedData = sessionStorage.getItem('cartData');
        return savedData ? JSON.parse(savedData) : [];
    });
    let [product, setProduct] = useState([])
    // Save cart data to sessionStorage when 'data' changes
    useEffect(() => {
        sessionStorage.setItem('cartData', JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        fetchProduct();
    }, []);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Function to fetch products
    async function fetchProduct() {
        try {
            let res = await fetch(`${apiUrl}/products`);
            let data = await res.json();
            setProduct(data); // Update to set the fetched data
            console.log(data);
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }



    const filteredProduct = selectedValue
        ? product.filter(item => item.type === selectedValue)
        : product;

    const deleteProduct = () => {
        setData([]);
        sessionStorage.removeItem('cartData');  // Correctly clear sessionStorage
    };

    const deleteSingleProduct = (indexToDelete) => {
        setData(prevData => prevData.filter((_, index) => index !== indexToDelete));
    };

    const handleType = (event) => {
        setSelectedValue(event.target.value);
    };

    const showAlert = async (item) => {
        try {
            const result = await Swal.fire({
                title: item.nameProduct,
                text: 'จำนวน',
                input: 'number',
                inputAttributes: {
                    min: 1,
                    step: 1
                },
                inputValue: 1,
                showCancelButton: true,
                confirmButtonText: 'OK'
            });

            if (result.isConfirmed) {
                const quantity = parseInt(result.value);

                setData(prevData => [
                    ...prevData,
                    {
                        id: item.id,
                        type: item.type,
                        nameProduct: item.nameProduct,
                        price: item.price,
                        quantity: quantity
                    }
                ]);

                await Swal.fire({
                    title: `Added ${quantity} x ${item.nameProduct} to cart!`,
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("Error showing alert:", error);
        }
    };

    const addToCart = (product) => {
        showAlert(product);
    };

    return (
        <div className='p-8 flex space-x-6'>
            <div className='w-3/4 '>
                <div className='w-fit'>
                    <h1 className='bg-blue-600 text-white   shadow-sm rounded-lg p-4 border-2 border-gray-200 shadow-white text-3xl flex  '>
                        PONMART.COM <SiPrestashop className="mx-4 text-4xl" />
                    </h1>
                    <div className='mt-4 w-2/4'>
                        <Select variant='ทั้งหมด' className='' onChange={handleType} placeholder='ทั้งหมด'>
                            {Array.isArray(product) && product.length > 0 ? (
                                [...new Set(product
                                    .map(item => item?.type)
                                    .filter(type => type !== null && type !== undefined)
                                )].map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No product types available</option>
                            )}
                        </Select>
                    </div>

                </div>

                <section className='mt-4 grid grid-cols-4 gap-2 bg-white p-4 rounded-lg shadow-lg border-2 w-full'>
  {Array.isArray(filteredProduct) && filteredProduct.length > 0 ? (
    filteredProduct.map((item, index) => (
      <div className='bg-white rounded-lg w-fit shadow-lg border-8' key={index}>
        <img className='p-2 w-[325px] h-[325px] object-cover' src={`${process.env.NEXT_PUBLIC_IMG_URL}${item.imgUrl}`} alt={item.nameProduct} />
        <p className='text-center my-2'>ชื่อสินค้า : {item.nameProduct}</p>
        <p className="text-center my-2">ราคา : {item.price}</p>
        <p className="text-center my-2">ประเภท : {item.type}</p>
        <hr className="border-t-2 border-gray-300 mx-4" />
        <div className='mx-4 flex justify-center'>
          <button
            className='text-center flex items-center bg-green-500 text-white p-2 rounded-lg my-2'
            onClick={() => addToCart(item)}
          >
            เพิ่มข้อมูลในตะกร้า
            <FaShoppingBasket className="ml-2 text-xl" />
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center col-span-4">No products available</p>
  )}
</section>
            </div>
            <Total
                dataProduct={data}
                deleteSingleProduct={deleteSingleProduct}
                clearProduct={deleteProduct}
            />
        </div>
    );
}
