/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TbArmchair } from "react-icons/tb";
import { GiBusDoors } from "react-icons/gi";
import { LuChevronUpCircle } from "react-icons/lu";
import { useState, useEffect } from "react";
import axios from 'axios';
import { Form, Input } from "antd";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";


const Service = ({ seatPrice, busName }) => {
    const [activeSeats, setActiveSeats] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [discount, setDiscount] = useState(0);
    const [form] = Form.useForm();
    const [allocatedSeats, setAllocatedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const leftSeats = [
        'A1', 'A2',
        'B1', 'B2',
        'C1', 'C2',
        'D1', 'D2',
        'E1', 'E2',
        'F1', 'F2',
        'G1', 'G2',
        'H1', 'H2',
        'I1', 'I2',
        'J1', 'J2'
    ];
    const rightSeats = [
        'A3', 'A4',
        'B3', 'B4',
        'C3', 'C4',
        'D3', 'D4',
        'E3', 'E4',
        'F3', 'F4',
        'G3', 'G4',
        'H3', 'H4',
        'I3', 'I4',
        'J3', 'J4'
    ];

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleClick = (value) => {
        if (activeSeats.includes(value)) {
            setActiveSeats(activeSeats.filter(seat => seat !== value));
        } else {
            setActiveSeats([...activeSeats, value]);
        }
    };

    const applyDiscount = () => {
        const discountValue = parseFloat(inputValue);
        if (!isNaN(discountValue) && discountValue > 0) {
            setDiscount(discountValue);
        } else {
            setDiscount(0);
        }
        setInputValue('');
    };

    const totalPrice = activeSeats.length * seatPrice;
    const grandTotal = totalPrice - discount;


    const payment = {
        price: grandTotal,
        allocatedSeat: activeSeats,
        name: name,
        phone: phone,
        location: location,
        address: address,
        email: email,
        busName: busName
    };

    useEffect(() => {
        const fetchPaidSeats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/allocated-seats/${busName}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Add Authorization header
                    },
                });

                // Check if the response data is an array
                if (Array.isArray(response.data)) {
                    const seats = response.data.map(item => item.allocatedSeat).flat(); // Extract and flatten seat arrays
                    setAllocatedSeats(seats);
                } else {
                    setError('Unexpected response format.');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching paid seats:', error); // Log error details
                setError('Failed to load allocated seats.');
                setLoading(false);
            }
        };

        fetchPaidSeats();
    }, [busName]);

    const navigate = useNavigate();

    const isLoggedIn = () => {
        const token = localStorage.getItem("token");
        return !!token;
    };


    const onFinish = async () => {
        if (!isLoggedIn()) {
            navigate('/signup');
            return;
        }

        try {
            console.log(payment);

            const response = await fetch("http://localhost:5000/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payment),
            });

            const result = await response.json();

            if (response.ok) {
                window.location.replace(result.url);
            } else {
                Swal.fire({
                    title: "Payment Failed",
                    text: result.error || "There was an issue with your payment. Please try again.",
                    icon: "error",
                    confirmButtonText: "Try Again",
                });
            }
        } catch (error) {
            console.error("Error sending payment data:", error);

            Swal.fire({
                title: "Network Error",
                text: "Failed to connect to the server. Please check your internet connection and try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="mt-16 md:mt-32 bus-container">
            </div>
            <div className="bus-container mt-10 md:mt-20 flex flex-col gap-10 md:flex-row">
                <div className="w-full md:w-[60%]">
                    <div className="my-10">
                        <p className="text-center text-5xl">{allocatedSeats.length}</p>
                        <p className="text-center text-5xl">{allocatedSeats.join(', ')}</p>
                    </div>
                    <h3 className="ticket-header">Select your seat</h3>
                    <div className="flex items-center justify-between font-medium text-[16px] md:text-2xl py-5 border-dashed border-b border-black">
                        <div className="select-seat space-x-2 md:space-x-4">
                            <TbArmchair />
                            <p>Available</p>
                        </div>
                        <div className="select-seat !bg-primary !text-white space-x-2 md:space-x-4">
                            <TbArmchair />
                            <p>Selected</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-5">
                        <div className="seat"> <GiBusDoors className="seat-text !text-2xl md:!text-3xl lg:!text-4xl" /></div>
                        <div className="seat"> <LuChevronUpCircle className="seat-text !text-4xl" /></div>
                    </div>
                    <div className="flex items-center justify-between mt-6 md:mt-10">
                        <div className="grid grid-cols-2 gap-3 md:gap-6">
                            {leftSeats.map((seat, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleClick(seat)}
                                    disabled={allocatedSeats.includes(seat)} // Disable the button if seat is allocated
                                    className={`seat seat-text ${activeSeats.includes(seat) ? '!bg-primary !text-white' : ''} ${allocatedSeats.includes(seat) ? '!bg-gray-300 !cursor-not-allowed !border-4 border-red-500' : ''}`}
                                >
                                    {seat}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-6">
                            {rightSeats.map((seat, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleClick(seat)}
                                    disabled={allocatedSeats.includes(seat)} // Disable the button if seat is allocated
                                    className={`seat seat-text ${activeSeats.includes(seat) ? '!bg-primary !text-white' : ''} ${allocatedSeats.includes(seat) ? '!bg-gray-300 !cursor-not-allowed !border-4 border-red-500' : ''}`}
                                >
                                    {seat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[40%] border-none md:border-dashed border-primary border-l-[3px]">
                    <div className="px-0 md:px-10 ">
                        <h3 className="ticket-header">Selected Seats: <span className=" px-4 py-2 bg-primary text-white rounded-full">{activeSeats.length}</span></h3>
                        <div className="bg-[#F7F8F8] rounded-2xl mt-10 px-8">
                            <div className="py-6 flex items-center justify-between border-b border-dashed border-[#03071233]">
                                <p className="description !text-[#030712]">Seat</p>
                                <p className="description !text-[#030712] !text-right">Price</p>
                            </div>
                            {activeSeats.map((seat, index) => (
                                <div key={seat} className={`py-6 flex items-center justify-between ${index === activeSeats.length - 1 ? 'border-b border-dashed border-[#03071233]' : ''}`}>
                                    <p className="description">{seat}</p>
                                    <p className="description !text-right">{seatPrice}</p>
                                </div>
                            ))}
                            <div className="py-6 flex items-center justify-between">
                                <p className="description !text-[#030712]">Total</p>
                                <p className="description !text-[#030712] !text-right">{totalPrice} BDT</p>
                            </div>
                            <div className="flex items-center">
                                <input
                                    className="w-full bg-white text-black p-4 border rounded-l-xl"
                                    placeholder="Enter Discount price"
                                    type="number"
                                    value={inputValue}
                                    onChange={handleChange}
                                />
                                <button
                                    className={`p-4 bg-primary text-white rounded-r-xl ${!inputValue ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    onClick={applyDiscount}
                                    disabled={!inputValue}
                                >
                                    Apply
                                </button>
                            </div>
                            {/* Grand Total */}
                            <div className="py-6 flex items-center justify-between">
                                <p className="description !text-[#030712]">Grand Total</p>
                                <p className="description !text-[#030712] !text-right">{grandTotal >= 0 ? grandTotal : 0} BDT</p>
                            </div>
                        </div>
                        <div className="login-form mt-4 md:mt-8">
                            <Form className="space-y-4" onFinish={onFinish} form={form}>
                                <Form.Item
                                    label="Name: "
                                    name="name"
                                    rules={[{ required: true, message: 'Please input your Name!' }]}
                                >
                                    <Input onChange={(e) => setName(e.target.value)} placeholder='Input your Name' type="text" className="p-4" />
                                </Form.Item>
                                <Form.Item
                                    label="Email: "
                                    name="email"
                                    rules={[{ required: true, message: 'Please input your Email!' }]}
                                >
                                    <Input onChange={(e) => setEmail(e.target.value)} placeholder='Input your Email' type="email" className="p-4" />
                                </Form.Item>
                                <Form.Item
                                    label="Phone Number: "
                                    name="phone"
                                    rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                                >
                                    <Input onChange={(e) => setPhone(e.target.value)} placeholder='Input your Phone Number' type="number" className="p-4" />
                                </Form.Item>
                                <Form.Item
                                    label="Counter Location: "
                                    name="location"
                                    rules={[{ required: true, message: 'Please input your Counter Location!' }]}
                                >
                                    <Input onChange={(e) => setLocation(e.target.value)} placeholder='Input your Counter Location' type="text" className="p-4" />
                                </Form.Item>
                                <Form.Item
                                    label="Address: "
                                    name="address"
                                    rules={[{ required: true, message: 'Please input your Address!' }]}
                                >
                                    <Input onChange={(e) => setAddress(e.target.value)} placeholder='Input your Address' type="text" className="p-4" />
                                </Form.Item>
                                <button type="submit" className="button w-full !mt-10 !rounded-md">Continue</button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Service;