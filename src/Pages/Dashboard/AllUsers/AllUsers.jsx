import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(12);

    // Fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        const token = localStorage.getItem('token'); // Fetch the token for authorization
        fetch('http://localhost:5000/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Error fetching users:", error));
    };

    // Handle user deletion
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
    

    // Pagination logic
    const memberUsers = users.filter(user => user.role === "member");
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = memberUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(memberUsers.length / usersPerPage);

    return (
        <>
            <div className="flex justify-center py-8">
                <h2 className="text-4xl font-bold">Manage Members</h2>
            </div>

            <div className="w-full px-4 lg:px-10">
                <h2 className="text-2xl lg:text-4xl mb-4 font-semibold">Total Members: {memberUsers.length}</h2>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full divide-y divide-gray-300 text-left text-sm lg:text-base">
                        <thead className="bg-slate-700 text-white">
                            <tr>
                                <th className="px-4 py-2">Sl No</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Phone Number</th>
                                <th className="px-4 py-2">Location</th>
                                <th className="px-4 py-2">Role</th>
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
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(user)}
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

                {/* Pagination controls */}
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
        </>
    );
};

export default AllUsers;
