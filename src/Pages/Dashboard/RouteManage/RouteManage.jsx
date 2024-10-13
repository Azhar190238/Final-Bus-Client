import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons for update and delete
import Swal from 'sweetalert2'; // Import SweetAlert2

const RouteManage = () => {
    const [buses, setBuses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({ routeName: '', price: '' });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // You can change this to show more/less items per page

    // Fetch the data from the API
    useEffect(() => {
        const fetchBusData = async () => {
            try {
                const response = await fetch('http://localhost:5000/routes', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token in headers
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch bus data');
                }
                const data = await response.json();
                setBuses(data);
            } catch (error) {
                console.error('Error fetching bus data:', error);
                Swal.fire('Error', 'Unable to fetch bus data. Please try again later.', 'error');
            }
        };
        fetchBusData();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBuses = buses.slice(indexOfFirstItem, indexOfLastItem);

    // Handle updating a route
    const handleUpdate = async () => {
        const { busId, routeIndex } = editingRoute;

        try {
            const response = await fetch(`http://localhost:5000/routes/${busId}/${routeIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token in headers
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', 'Route updated successfully', 'success');
                // Update the local state if necessary or refetch data
                setBuses((prevBuses) => {
                    const updatedBuses = prevBuses.map(bus => {
                        if (bus._id === busId) {
                            const updatedRoutes = bus.routes.map((route, index) =>
                                index === routeIndex ? { ...route, ...formData } : route
                            );
                            return { ...bus, routes: updatedRoutes };
                        }
                        return bus;
                    });
                    return updatedBuses;
                });
                setShowModal(false); // Close modal after updating
            } else {
                Swal.fire('Error', 'Failed to update the route', 'error');
            }
        } catch (error) {
            console.error('Error updating route:', error);
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
    };

    // Handle route deletion
    const handleDelete = (busId, routeIndex) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this route?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Call the DELETE API to remove the route
                fetch(`http://localhost:5000/routes/${busId}/${routeIndex}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token in headers
                    }
                })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error('Failed to delete the route');
                        }
                        return res.json();
                    })
                    .then((data) => {
                        if (data.deletedCount > 0) {
                            // Check if there are still routes left for the bus
                            const remainingRoutes = buses.find(bus => bus._id === busId).routes.length - 1;

                            if (remainingRoutes === 0) {
                                // Delete the bus if there are no remaining routes
                                return fetch(`http://localhost:5000/buses/${busId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token in headers
                                    }
                                });
                            } else {
                                // Update local state to remove the deleted route
                                setBuses((prevBuses) => prevBuses.map(bus => {
                                    if (bus._id === busId) {
                                        return { ...bus, routes: bus.routes.filter((_, i) => i !== routeIndex) };
                                    }
                                    return bus;
                                }));
                                Swal.fire('Deleted!', 'The route has been deleted.', 'success');
                            }
                        } else {
                            Swal.fire('Error!', 'No route was deleted. Please try again.', 'error');
                        }
                    })
                    .then((res) => {
                        // Check if bus deletion response is successful
                        if (res && res.ok) {
                            Swal.fire('Deleted!', 'The bus has been deleted as it has no routes left.', 'success');
                            // Update state to remove the bus from local state
                            setBuses(prevBuses => prevBuses.filter(bus => bus._id !== busId));
                        }
                    })
                    .catch((error) => {
                        console.error('Error deleting the route:', error);
                        Swal.fire('Error!', 'Unable to delete the route.', 'error');
                    });
            }
        });
    };

    // Open the modal and set the editing route
    const openModal = (busId, routeIndex, route) => {
        setEditingRoute({ busId, routeIndex });
        setFormData({ routeName: route.routeName, price: route.price });
        setShowModal(true);
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Pagination buttons
    const totalPages = Math.ceil(buses.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="max-w-[1020px] mx-auto mt-16">
            <h1 className="text-3xl md:text-5xl text-center text-primary mb-6">Bus Routes</h1>

            {buses.length === 0 ? (
                <p className="text-center">Loading...</p>
            ) : (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Bus Name</th>
                                <th className="border px-4 py-2">Routes</th>
                                <th className="border px-4 py-2">Price</th>
                                <th className="border px-4 py-2">Update</th>
                                <th className="border px-4 py-2">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBuses.map((bus) =>
                                bus.routes.map((route, routeIndex) => (
                                    <tr key={`${bus._id}-${routeIndex}`} className="border-b">
                                        {routeIndex === 0 && (
                                            <td
                                                className="border px-4 py-2 text-center"
                                                rowSpan={bus.routes.length} // Span across multiple rows for the same bus
                                            >
                                                {bus.busName}
                                            </td>
                                        )}
                                        <td className="border px-4 py-2">{route.routeName}</td>
                                        <td className="border px-4 py-2">{route.price}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <button
                                                onClick={() => openModal(bus._id, routeIndex, route)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <FaEdit /> {/* Update icon */}
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleDelete(bus._id, routeIndex)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrashAlt /> {/* Delete icon */}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination controls */}
                    <div className="flex justify-center mt-4">
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`mx-1 px-3 py-2 ${currentPage === number ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Update modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-6 rounded-md">
                        <h2 className="text-2xl mb-4">Update Route</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block mb-1">Route Name:</label>
                                <input
                                    type="text"
                                    value={formData.routeName}
                                    onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Price:</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="mr-4 px-4 py-2 bg-gray-300 text-black rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteManage;
