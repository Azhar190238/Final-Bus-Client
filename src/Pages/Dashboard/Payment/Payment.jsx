/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Payment = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [totalSeat, setTotalSeat] = useState(0);

    useEffect(() => {

        axios.get("http://localhost:5000/buses")
            .then(response => {
                setBuses(response.data);
            })
            .catch(error => {
                console.error("Error fetching bus data:", error);
            });
    }, []);

    const fetchPaymentHistory = (busName) => {
        const token = localStorage.getItem('token');
        const selectedBusData = buses.find(bus => bus.busName === busName);  // Get the selected bus data
        if (selectedBusData) {
            setTotalSeat(selectedBusData.totalSeats);  // Set total seats from the selected bus
        }

        axios.get(`http://localhost:5000/order-seats/${busName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                setPaymentHistory(response.data);
                setSelectedBus(busName);
            })
            .catch(error => {
                console.error("Error fetching payment history:", error);
            });
    };



    const handleDeleteSeat = (busName, seatId) => {
        const token = localStorage.getItem('token');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with the delete request
                axios.delete(`http://localhost:5000/order-seats/${busName}/${seatId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(response => {
                        // Refetch the payment history after deletion
                        fetchPaymentHistory(busName);

                        Swal.fire(
                            'Deleted!',
                            'The seat has been deleted.',
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error("Error deleting seat:", error);
                        Swal.fire(
                            'Error!',
                            'There was a problem deleting the seat.',
                            'error'
                        );
                    });
            }
        });
    };


    // Helper function to group data by bus name
    const groupByBusName = (data) => {
        return data.reduce((result, item) => {
            const bus = item.busName;
            if (!result[bus]) {
                result[bus] = [];
            }
            result[bus].push(item);
            return result;
        }, {});
    };

    // Calculate total price and total allocated seats
    const calculateTotals = (payments) => {
        const totalPrice = payments.reduce((sum, payment) => sum + payment.price, 0);
        const totalAllocatedSeats = payments.reduce((sum, payment) => sum + payment.allocatedSeat.length, 0);
        return { totalPrice, totalAllocatedSeats };
    };

    const { totalPrice, totalAllocatedSeats } = calculateTotals(paymentHistory);

    return (
        <div className="m-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buses.map((bus) => (
                    <div
                        key={bus._id}
                        className="border p-4 rounded shadow-lg cursor-pointer"
                        onClick={() => fetchPaymentHistory(bus.busName)}
                    >
                        <h3 className="text-xl font-semibold">{bus.busName}</h3>
                        <p>Total Seats: {bus.totalSeats}</p>
                    </div>
                ))}
            </div>

            {selectedBus && (
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Payment History for {selectedBus}</h2>

                    {paymentHistory.length > 0 ? (
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Bus Name</th>
                                    <th className="px-4 py-2">Allocated Seat</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Phone</th>
                                    <th className="px-4 py-2">Counter</th>
                                    <th className="px-4 py-2">Reference</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Action</th> {/* Add Action column */}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupByBusName(paymentHistory)).map(([busName, busPayments]) => (
                                    busPayments.map((history, index) => (
                                        <tr key={history._id}>
                                            {index === 0 && (
                                                <td className="border px-4 py-2 text-center" rowSpan={busPayments.length}>
                                                    {busName}
                                                </td>
                                            )}
                                            <td className="border px-4 py-2">{history.allocatedSeat.join(', ')}</td>
                                            <td className="border px-4 py-2">{history.price}</td>
                                            <td className="border px-4 py-2">{history.name}</td>
                                            <td className="border px-4 py-2">{history.phone}</td>
                                            <td className="border px-4 py-2">{history.location}</td>
                                            <td className="border px-4 py-2">{history.counterMaster}</td>
                                            <td className="border px-4 py-2">{history.email}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                                    onClick={() => handleDeleteSeat(busName, history._id)} // Call the delete function
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No payment history available.</p>
                    )}

                    <div className="mt-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="px-10 py-5 rounded-xl border border-primary text-[#E67529] bg-[#E675291A]">
                            <h2 className="text-2xl font-bold">Total Price: {totalPrice} </h2>
                        </div>
                        <div className="px-10 py-5 rounded-xl border border-primary text-[#E67529] bg-[#E675291A]">
                            <h2 className="text-2xl font-bold">Allocated Seats: {totalAllocatedSeats} </h2>
                        </div>
                        <div className="px-10 py-5 rounded-xl border border-primary text-[#E67529] bg-[#E675291A]">
                            <h2 className="text-2xl font-bold">Available Seats: {totalSeat - totalAllocatedSeats} </h2>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Payment;
