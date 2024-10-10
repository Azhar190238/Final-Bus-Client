import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Swal from "sweetalert2";

const AllMaster = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(12); // Number of users per page
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', location: '', role: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5000/users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => {
                console.error("Error fetching users:", error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to fetch users",
                    icon: "error",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (user) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete ${user.name}. This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                fetch(`http://localhost:5000/users/${user._id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response => response.json())
                .then(result => {
                    if (result.message === 'User deleted successfully') {
                        Swal.fire("Deleted!", `${user.name} has been deleted.`, "success");
                        // Update the state to remove the deleted user from the list
                        setUsers(prevUsers => prevUsers.filter(u => u._id !== user._id));
                    } else {
                        Swal.fire("Error!", "Failed to delete the user.", "error");
                    }
                })
                .catch(error => {
                    console.error("Error deleting user:", error);
                    Swal.fire("Error!", "An error occurred while deleting the user.", "error");
                });
            }
        });
    };

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setFormData({ name: user.name, phone: user.phone, location: user.location, role: user.role });
        setIsModalOpen(true);
    };

    const handleUpdate = () => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/users/${selectedUser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) {
                    Swal.fire({
                        title: "Updated!",
                        text: `${formData.name} has been updated.`,
                        icon: "success",
                    });
                    setUsers((prevUsers) =>
                        prevUsers.map((user) => (user._id === selectedUser._id ? { ...user, ...formData } : user))
                    );
                    setIsModalOpen(false);
                    setFormData({ name: '', phone: '', location: '', role: '' }); // Reset form data
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: result.message || "Failed to update user",
                        icon: "error",
                    });
                }
            })
            .catch((error) => {
                console.error("Error updating user:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to update user",
                    icon: "error",
                });
            });
    };

    const memberUsers = users.filter((user) => user.role === "master");

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = memberUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(memberUsers.length / usersPerPage);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="flex justify-center py-8">
                <h2 className="text-4xl font-bold">Manage Masters</h2>
            </div>

            <div className="w-full px-4 lg:px-10">
                <h2 className="text-2xl lg:text-4xl mb-4 font-semibold">Total Masters: {memberUsers.length}</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full divide-y divide-gray-300 text-left text-sm lg:text-base">
                        <thead className="bg-slate-700 text-white">
                            <tr>
                                <th className="px-4 py-2">Sl No</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Phone Number</th>
                                <th className="px-4 py-2">Location</th>
                                <th className="px-4 py-2">Role</th>
                                <th className="px-4 py-2">Update</th>
                                <th className="px-4 py-2">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers.map((user, index) => (
                                <tr key={user._id}>
                                    <td className="px-4 py-2">{index + indexOfFirstUser + 1}</td>
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.phone}</td>
                                    <td className="px-4 py-2">{user.location}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="pl-8 py-2">
                                        <button onClick={() => handleOpenModal(user)} className="text-blue-600">
                                            <MdOutlineSystemUpdateAlt className="text-xl text-primary" />
                                        </button>
                                    </td>
                                    <td className="pl-8 py-2">
                                        <button onClick={() => handleDelete(user)} className="btn btn-ghost btn-sm">
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
                            className={`mx-1 px-3 py-1 rounded ${
                                currentPage === index + 1 ? "bg-primary text-white" : "bg-gray-300 text-black"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal for updating user */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md">
                        <h3 className="text-lg font-bold mb-4">Update User</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="border border-gray-300 rounded w-full px-2 py-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="border border-gray-300 rounded w-full px-2 py-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="border border-gray-300 rounded w-full px-2 py-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="border border-gray-300 rounded w-full px-2 py-1"
                                    required
                                >
                                    <option value="master">Master</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
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

export default AllMaster;
