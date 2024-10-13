import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ManageBus = () => {
    const [buses, setBuses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [busesPerPage] = useState(12);
    const [selectedBus, setSelectedBus] = useState(null); // Store bus for updating
    const [showModal, setShowModal] = useState(false); // Modal visibility

    // Fetch buses data on component mount
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await fetch('http://localhost:5000/buses');
                if (!response.ok) throw new Error('Failed to fetch buses');
                const data = await response.json();
                setBuses(data);
            } catch (error) {
                console.error("Error fetching buses:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Could not load buses. Please try again later.",
                    icon: "error"
                });
            }
        };
        fetchBuses();
    }, []);

    // Handle delete bus action
    const handleDelete = async (bus) => {
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: `You won't be able to revert this! You are deleting the bus ${bus.busName}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (confirmation.isConfirmed) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:5000/buses/${bus._id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const result = await response.json();
                if (result.deletedCount > 0) {
                    Swal.fire({
                        title: "Deleted!",
                        text: `${bus.busName} has been deleted.`,
                        icon: "success"
                    });
                    setBuses(prevBuses => prevBuses.filter(b => b._id !== bus._id));
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete bus",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("Error deleting bus:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Could not delete bus. Please try again.",
                    icon: "error"
                });
            }
        }
    };

    const handleUpdate = (bus) => {
        setSelectedBus(bus);
        setShowModal(true); // 
    };


    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/buses/${selectedBus._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(selectedBus)
            });
            const result = await response.json();
            if (result.modifiedCount > 0) {
                Swal.fire({
                    title: "Updated!",
                    text: `${selectedBus.busName} has been updated successfully.`,
                    icon: "success"
                });
                setBuses(prevBuses => prevBuses.map(b => b._id === selectedBus._id ? selectedBus : b));
                setShowModal(false); // Close modal
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update bus",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Error updating bus:", error);
            Swal.fire({
                title: "Error!",
                text: "Could not update bus. Please try again.",
                icon: "error"
            });
        }
    };

    // Pagination logic
    const indexOfLastBus = currentPage * busesPerPage;
    const indexOfFirstBus = indexOfLastBus - busesPerPage;
    const currentBuses = buses.slice(indexOfFirstBus, indexOfLastBus);
    const totalPages = Math.ceil(buses.length / busesPerPage);

    return (
        <>
            <div className="flex justify-center py-8">
                <h2 className="text-5xl text-primary font-bold">Manage Buses</h2>
            </div>

            <div className="w-full px-4 lg:px-10">
                <div className="flex justify-between">
                    <h2 className="text-2xl lg:text-4xl mb-4 font-semibold">Total Buses: {buses.length}</h2>
                    <Link to="/dashboard/addBus">
                        <button className="button px-5 py-3 mb-6"> Add Bus </button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-auto w-full divide-y divide-gray-300 text-left text-sm lg:text-base">
                        <thead className="bg-slate-700 text-white">
                            <tr>
                                <th className="px-4 py-2">Sl No</th>
                                <th className="px-4 py-2">Bus Name</th>
                                <th className="px-4 py-2">Total Seats</th>
                                <th className="px-4 py-2">Starting Time</th>
                                <th className="px-4 py-2">Estimated Time</th>
                                <th className="px-4 py-2">Starting Point</th>
                                <th className="px-4 py-2">Ending Point</th>
                                <th className="px-4 py-2">Update</th>
                                <th className="px-4 py-2">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentBuses.map((bus, index) => (
                                <tr key={bus._id}>
                                    <td className="px-4 py-2">{index + indexOfFirstBus + 1}</td>
                                    <td className="px-4 py-2">{bus.busName}</td>
                                    <td className="px-4 py-2">{bus.totalSeats}</td>
                                    <td className="px-4 py-2">{bus.startTime}</td>
                                    <td className="px-4 py-2">{bus.estimatedTime}</td>
                                    <td className="px-4 py-2">{bus.startingPoint}</td>
                                    <td className="px-4 py-2">{bus.endingPoint}</td>
                                    <td className="pl-8 py-2">
                                        <MdOutlineSystemUpdateAlt
                                            className="text-xl text-primary cursor-pointer"
                                            onClick={() => handleUpdate(bus)}
                                        />
                                    </td>
                                    <td className="pl-8 py-2">
                                        <button
                                            onClick={() => handleDelete(bus)}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            <FaTrashAlt className="text-red-800 text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-300 text-black'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Update Bus Modal */}
            {showModal && selectedBus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md w-11/12 md:w-1/3">
                        <h2 className="text-2xl font-bold mb-4">Update Bus</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Bus Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={selectedBus.busName}
                                    onChange={(e) => setSelectedBus({ ...selectedBus, busName: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Total Seats</label>
                                <input
                                    type="number"
                                    className="w-full border rounded p-2"
                                    value={selectedBus.totalSeats}
                                    onChange={(e) => setSelectedBus({ ...selectedBus, totalSeats: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Start Time</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={selectedBus.startTime}
                                    onChange={(e) => setSelectedBus({ ...selectedBus, startTime: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Estimated Time</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={selectedBus.estimatedTime}
                                    onChange={(e) => setSelectedBus({ ...selectedBus, estimatedTime: e.target.value })}
                                />
                            </div>
                            {/* Add other input fields as needed */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageBus;
