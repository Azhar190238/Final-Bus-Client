
import { useEffect, useState } from 'react';
import axios from 'axios';

const CounterPayment = () => {
    const [counterData, setCounterData] = useState([]);

    useEffect(() => {
        // Fetch counter data from the API
        const fetchCounterData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/orders'); // Adjust the endpoint as needed
                setCounterData(response.data);
            } catch (error) {
                console.error('Error fetching counter data:', error);
            }
        };

        fetchCounterData();
    }, []);

    // Helper function to calculate total seats and total price
    const calculateTotals = (data) => {
        const totalSeats = data.reduce((sum, item) => sum + item.allocatedSeat.length, 0);
        const totalPrice = data.reduce((sum, item) => sum + item.price, 0);
        return { totalSeats, totalPrice };
    };

    const { totalSeats, totalPrice } = calculateTotals(counterData);

    return (
        <div className="m-10">
            <h2 className="text-2xl font-semibold mb-4">Counter Master Details</h2>

            {counterData.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Counter Master Name</th>
                            <th className="border border-gray-300 px-4 py-2">Bus Name</th>
                            <th className="border border-gray-300 px-4 py-2">Allocated Seats</th>
                            <th className="border border-gray-300 px-4 py-2">Total Seats Sold</th>
                            <th className="border border-gray-300 px-4 py-2">Total Price</th>
                            <th className="border border-gray-300 px-4 py-2">Counter Location</th>
                            <th className="border border-gray-300 px-4 py-2">Reference Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {counterData.map((item) => (
                            <tr key={item._id.$oid} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.busName}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.allocatedSeat.join(', ')}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.allocatedSeat.length}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.price}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.location}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.counterMaster}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No counter data available.</p>
            )}

            {counterData.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-xl font-bold">Total Seats Sold: {totalSeats}</h3>
                    <h3 className="text-xl font-bold">Total Price: {totalPrice}</h3>
                </div>
            )}
        </div>
    );
};

export default CounterPayment;
