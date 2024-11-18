import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Edit, Trash, User } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user for the modal
    const [editUser, setEditUser] = useState({}); // State to hold the editable user details

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/list");
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(
            (user) => user.fname.toLowerCase().includes(term) || user.email.toLowerCase().includes(term) || user.phone.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/users/delete/${id}`);
                    setUsers(users.filter(user => user.id !== id));
                    setFilteredUsers(filteredUsers.filter(user => user.id !== id));
                    toast.success("User deleted successfully");
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            }
        });
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/users/edit/${id}`);
            setSelectedUser(response.data); // Set the selected user for the modal
            setEditUser({
                ...response.data,
                role: response.data.role // Ensure role is set correctly
            }); // Set the editable user details
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser({ ...editUser, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            const updatedUser = {
                ...editUser,
                role: editUser.role // Send role as a string
            };
            await axios.put(`http://127.0.0.1:8000/api/users/update/${editUser.id}`, updatedUser);
            setUsers(users.map(user => (user.id === editUser.id ? updatedUser : user)));
            setFilteredUsers(filteredUsers.map(user => (user.id === editUser.id ? updatedUser : user)));
            toast.success("User updated successfully");
            closeModal();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const closeModal = () => {
        setSelectedUser(null); // Close the modal
        setEditUser({}); // Reset the editable user details
    };

    return (
        <motion.div
            className='bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-black'>Users</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search users...'
                        className='bg-gray-700 text-white placeholder-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-black' size={18} />
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
                                ID
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
                                Name
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
                                Email
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
                                Phone
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
                                Role
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {filteredUsers.map((user) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-black'>{user.id}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0 h-10 w-10'>
                                        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                                            <User size={20} />
                                        </div>
                                        </div>
                                        <div className='ml-4'>
                                            <div className='text-sm font-medium text-black'>{user.fname}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-black'>{user.email}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-black'>{user.phone}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
                                        {user.role}
                                    </span>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>
                                    <button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEdit(user.id)}>
                                        <Edit size={18} />
                                    </button>
                                    <button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(user.id)}>
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Render the UserModal component */}
            {selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-50">
                        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fname">
                                Name
                            </label>
                            <input
                                type="text"
                                name="fname"
                                value={editUser.fname || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={editUser.email || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={editUser.phone || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                Role
                            </label>
                            <select
                                name="role"
                                value={editUser.role || ''}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleUpdate}>Update</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default UsersTable;