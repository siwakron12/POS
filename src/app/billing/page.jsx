"use client";
import { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation'; // Import useRouter

const Billing = () => {
    const router = useRouter(); // Initialize useRouter
    const [dataProduct, setDataProduct] = useState([]);
    const [allPrice, setAllPrice] = useState(0);
    const [money, setMoney] = useState('');
    const componentRef = useRef();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const difference = money - allPrice;
    const handleConfirm = async () => {
        if (money < allPrice) {
            Swal.fire({
                icon: 'error',
                title: 'จำนวนเงินไม่เพียงพอ',
                text: `กรุณากรอกจำนวนเงินให้มากกว่าราคาทั้งหมด (${allPrice} บาท)!`,
            });
            return;
        }

        for (const item of dataProduct) {
            const productData = {
                nameProduct: item.nameProduct,
                quantity: item.quantity,
                moneyTotal: allPrice
            };

            try {
                const response = await fetch(`${apiUrl}/sales`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Product added successfully:', result);
                    sessionStorage.removeItem('cartData')
                    // แสดง SweetAlert สำเร็จ
                    Swal.fire({
                        icon: 'success',
                        title: 'ทำรายการสำเร็จ',
                        text: 'สินค้าได้ถูกเพิ่มในระบบแล้ว!',
                        confirmButtonText: 'ตกลง'
                    });

                    router.push('/pos');
                } else {
                    console.error('Failed to add product');

                    // แสดง SweetAlert ล้มเหลว
                    Swal.fire({
                        icon: 'error',
                        title: 'ทำรายการล้มเหลว',
                        text: 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกครั้ง!',
                    });
                }
            } catch (error) {
                console.error('Error:', error);

                // แสดง SweetAlert ข้อผิดพลาด
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่!',
                });
            }
        }
    };



    // Retrieve data from sessionStorage when the component mounts
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCartData = JSON.parse(sessionStorage.getItem('cartData'));
            const storedTotalPrice = parseFloat(sessionStorage.getItem('totalPrice'));

            if (storedCartData && storedTotalPrice) {
                setDataProduct(storedCartData);
                setAllPrice(storedTotalPrice);
            }
        }

    }, []);


    return (
        <div className='p-12 h-full'>
            <div className="bg-white h-full p-12 rounded-lg shadow-md border-2">
                <h1 className="text-4xl mb-4 text-center">ใบเสร็จสินค้า ponmart.com</h1>

                <section className='h-fit'>
                    <table className="h-fit min-w-full border-collapse border border-gray-500 rounded-lg">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">รายการ</th>
                                <th className="border border-gray-300 p-2">ชื่อสินค้า</th>
                                <th className="border border-gray-300 p-2">จำนวน</th>
                                <th className="border border-gray-300 p-2">รวม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataProduct.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 p-2 text-center">{item.nameProduct}</td>
                                    <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                                    <td className="border border-gray-300 p-2 text-center">{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className='my-4'>
                        <p className='text-2xl'>รวมทั้งหมด : {allPrice} บาท</p>
                        <div className='flex items-center space-x-2 mt-2'>
                            <p className='text-2xl'>รับเงินมา : </p>
                            <input
                                onChange={(ev) => setMoney(ev.target.value)}
                                className='border-2 p-2 shadow-md'
                                placeholder='จำนวนเงิน'
                                type="number"
                            />
                        </div>
                        {money >= allPrice ? (
                            <p className='text-blue-600 text-2xl w-fit rounded-md mt-2'>เงินทอน : {difference} บาท</p>
                        ) : (
                            <p className='mt-4 text-red-500'>กรุณาเพิมจำนวนเงิน</p>
                        )}
                    </div>

                    <div>
                        <button
                            className={`mx-2 p-2 rounded-lg ${money >= allPrice ? 'bg-green-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                            disabled={money < allPrice}
                            onClick={handleConfirm}
                        >
                            ยืนยันรายการ
                        </button>
                        <ReactToPrint
                            trigger={() => (
                                <button
                                    className={`p-2 rounded-md ${money >= allPrice ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                                    disabled={money < allPrice}
                                >
                                    พิมพ์ใบเสร็จ
                                </button>
                            )}
                            content={() => componentRef.current}
                        />
                    </div>
                </section>

                {/* This section is for ReactToPrint to print */}
                <div style={{ display: 'none' }}>
                    <div ref={componentRef} className='flex flex-col items-center'>
                        <h1 className='text-4xl mt-8'>ใบเสร็จสินค้า ponmart.com</h1>
                        <table className='mt-8 h-fit min-w-full rounded-lg'>
                            <thead>
                                <tr>
                                    <th className='p-2 text-center'>รายการ</th>
                                    <th className='p-2 text-center'>ชื่อสินค้า</th>
                                    <th className='p-2 text-center'>จำนวน</th>
                                    <th className='p-2 text-center'>รวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataProduct.map((item, index) => (
                                    <tr key={index}>
                                        <td className='p-2 text-center'>{index + 1}</td>
                                        <td className='p-2 text-center'>{item.nameProduct}</td>
                                        <td className='p-2 text-center'>{item.quantity}</td>
                                        <td className='p-2 text-center'>{item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className='text-xl mt-4'>รวมทั้งหมด: {allPrice} บาท</p>
                        {money >= allPrice && (
                            <p className=' text-xl mt-2'>เงินทอน: {difference} บาท</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
