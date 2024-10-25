import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBusAlt } from 'react-icons/fa';

const CounterPayment = () => {
    const [counterData, setCounterData] = useState([]);
    const [approvedMasters, setApprovedMasters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Loading state
    const rowsPerPage = 15; // Show 15 rows per page

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch approved counter master data with token verification
                const mastersResponse = await axios.get('https://api.koyrabrtc.com/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const masters = mastersResponse.data.filter(user => user.role === 'master' && user.status === 'approved');
                setApprovedMasters(masters);

                // Fetch counter data from the orders API
                const counterResponse = await axios.get('https://api.koyrabrtc.com/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setCounterData(counterResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Stop loading once data is fetched
            }
        };

        fetchData();
    }, []);

    // Helper function to calculate totals for a specific counter master
    const calculateTotals = (data) => {
        const totalSeats = data.reduce((sum, item) => sum + item.allocatedSeat.length, 0);
        const totalPrice = data.reduce((sum, item) => sum + item.price, 0);
        const buses = [...new Set(data.map(item => item.busName))].join(', ');
        const seats = data.map(item => item.allocatedSeat.join(', ')).join(', ');
        return { totalSeats, totalPrice, buses, seats };
    };

    const currentMasters = approvedMasters.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(approvedMasters.length / rowsPerPage);

    // Loading Spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-4xl animate-spin">
                    <FaBusAlt className="text-primary" />
                </div>
                <p className="ml-4 text-2xl text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="m-10">
            <h2 className="text-2xl font-semibold mb-4">Counter Master Details</h2>

            {approvedMasters.length > 0 ? (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Counter Master Name</th>
                                <th className="border border-gray-300 px-4 py-2">Bus Name(s)</th>
                                <th className="border border-gray-300 px-4 py-2">Allocated Seats</th>
                                <th className="border border-gray-300 px-4 py-2">Total Seats Sold</th>
                                <th className="border border-gray-300 px-4 py-2">Total Price</th>
                                <th className="border border-gray-300 px-4 py-2">Counter Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMasters.map((master) => {
                                const masterOrders = counterData.filter(order => order.counterMaster === master.name && order.status === 'paid');

                                if (masterOrders.length > 0) {
                                    const { totalSeats, totalPrice, buses, seats } = calculateTotals(masterOrders);

                                    return (
                                        <tr key={master._id.$oid} className="hover:bg-gray-100 text-center">
                                            <td className="border border-gray-300 px-4 py-2">{master.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{buses}</td>
                                            <td className="border border-gray-300 px-4 py-2">{seats}</td>
                                            <td className="border border-gray-300 px-4 py-2">{totalSeats}</td>
                                            <td className="border border-gray-300 px-4 py-2">{totalPrice}</td>
                                            <td className="border border-gray-300 px-4 py-2">{master.location}</td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr key={master._id.$oid} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">{master.name}</td>
                                            <td className="border text-center border-gray-300 px-4 py-2" colSpan="5">No transactions available</td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="mt-4 flex justify-center space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p>No approved counter masters found.</p>
            )}
        </div>
    );
};

export default CounterPayment;
