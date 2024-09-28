import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter


export default function Total({ dataProduct, clearProduct, deleteSingleProduct }) {
    const [allPrice, setAllPrice] = useState(0);
    const componentRef = useRef();
    const router = useRouter(); // Initialize useRouter
   
    useEffect(() => {
        const totalPrice = dataProduct.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setAllPrice(totalPrice);
    }, [dataProduct]);

    const navigateToBillPage = () => {
        // Store dataProduct and total price in sessionStorage or localStorage
        
        sessionStorage.setItem('totalPrice', allPrice);
        
        // Navigate to the billing page
        router.push('/billing');  // Replace '/billing' with the route you want to navigate to
    };

    return (
      
        <div className="mt-32 bg-white h-full w-1/4 p-4 rounded-lg shadow-md border-2">
            <h1 className="text-xl font-bold mb-4">รายการที่ซื้อ</h1>
            <section className='h-fit'>
                <table className="h-fit min-w-full border-collapse border border-gray-500 rounded-lg">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">List</th>
                            <th className="border border-gray-300 p-2">Name Product</th>
                            <th className="border border-gray-300 p-2">QTY</th>
                            <th className="border border-gray-300 p-2">Total</th>
                            <th className="border border-gray-300 p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataProduct.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                <td className="border border-gray-300 p-2 text-center">{item.nameProduct}</td>
                                <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                                <td className="border border-gray-300 p-2 text-center">{item.price * item.quantity}</td>
                                <td className="border border-gray-300 p-2 text-center">
                                    <button
                                        onClick={() => deleteSingleProduct(index)}
                                        className='bg-red-600 p-2 text-white rounded-lg'
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='my-4'>
                    <p>รวมทั้งหมด : {allPrice} บาท</p>
                </div>
                <div>
                    <button onClick={navigateToBillPage} className='bg-green-600 p-2 text-white rounded-md mr-2'>
                        เพิ่มบิล
                    </button>
                    <button onClick={clearProduct} className='bg-red-600 text-white p-2 rounded-md'>
                        ลบ
                    </button>
                </div>
            </section>
           
        </div>
    );
}
