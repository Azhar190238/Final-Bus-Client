/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import moment from 'moment';
import { DatePicker } from "antd";

const Payment = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [totalSeat, setTotalSeat] = useState(0);

    useEffect(() => {
        axios.get("https://api.koyrabrtc.com/buses")
            .then(response => {
                setBuses(response.data);
            })
            .catch(error => {
                console.error("Error fetching bus data:", error);
            });
    }, []);

    const dateFormatList = ['DD/MM/YYYY'];
    const [selectedDate, setSelectedDate] = useState(moment().format('DD/MM/YYYY'));

    const handleDateChange = (date) => {
        const select = date ? date.format('DD/MM/YYYY') : null;
        setSelectedDate(select);
    };

    const disableDates = (current) => {
        const minDate = moment().subtract(15, 'days').startOf('day');
        const maxDate = moment().add(15, 'days').endOf('day');
        return current && (current < minDate || current > maxDate);
    };

    // Define fetchPaymentHistory outside of useEffect so it can be used elsewhere
    const fetchPaymentHistory = (busName) => {
        const token = localStorage.getItem('token');
        const selectedBusData = buses.find(bus => bus.busName === busName);  // Get the selected bus data
        if (selectedBusData) {
            setTotalSeat(selectedBusData.totalSeats);  // Set total seats from the selected bus
        }

        axios.get(`https://api.koyrabrtc.com/order-seats/${busName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            params: {
                selectedDate // Send selected date as a query parameter
            }
        })
            .then(response => {
                setPaymentHistory(response.data);
                console.log('date = ', selectedDate)
                setSelectedBus(busName);
            })
            .catch(error => {
                console.error("Error fetching payment history:", error);
            });
    };

    useEffect(() => {
        if (selectedBus) {
            fetchPaymentHistory(selectedBus);
        }
    }, [selectedDate]);

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
                axios.delete(`https://api.koyrabrtc.com/order-seats/${busName}/${seatId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(() => {
                        fetchPaymentHistory(busName);
                        Swal.fire('Deleted!', 'The seat has been deleted.', 'success');
                    })
                    .catch(error => {
                        console.error("Error deleting seat:", error);
                        Swal.fire('Error!', 'There was a problem deleting the seat.', 'error');
                    });
            }
        });
    };

    const handleClearAllSeats = (busName) => {
        const token = localStorage.getItem('token');
        Swal.fire({
            title: 'Are you sure?',
            text: "This will clear all allocated seats for this bus!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear all seats!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://api.koyrabrtc.com/orders/clear-ala/${busName}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(response => {
                        fetchPaymentHistory(busName);  // Refresh payment history after clearing seats
                        Swal.fire('Cleared!', `All allocated seats for bus ${busName} have been cleared.`, 'success');
                    })
                    .catch(error => {
                        console.error("Error clearing seats:", error);
                        Swal.fire('Error!', 'There was a problem clearing all allocated seats.', 'error');
                    });
            }
        });
    };

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
                    <div className="flex justify-center mt-5">
                        <DatePicker
                            className="p-3 w-full md:w-1/2 lg:w-[20%]"
                            onChange={handleDateChange}
                            format={dateFormatList}
                            disabledDate={disableDates} // Disable dates before today and after 15 days
                        />
                    </div>

                    {paymentHistory.length > 0 ? (
                        <div>
                          
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mb-4"
                                onClick={() => handleClearAllSeats(selectedBus)}
                            >
                                Clear All Seats
                            </button>

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
                                        <th className="px-4 py-2">Action</th> 
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
                        </div>
                    ) : (
                        <p>No payment history available.</p>
                    )}

                    <div className="mt-10 flex flex-col md:flex-row items-center gap-10">
                        <h3 className="text-lg">Total Allocated Seats: {totalAllocatedSeats}</h3>
                        <h3 className="text-lg">Total Price: {totalPrice}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;

