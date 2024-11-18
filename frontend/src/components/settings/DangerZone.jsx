import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const DangerZone = () => {
    const handleDeleteClick = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted!", "Your account has been deleted.", "success");
                // Add your delete logic here
            }
        });
    };

    return (
        <motion.div
            className='bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className='flex items-center mb-4'>
                <Trash2 className='text-red-400 mr-3' size={24} />
                <h2 className='text-xl font-semibold text-gray-100'>Danger Zone</h2>
            </div>
            <p className='text-gray-300 mb-4'>Permanently delete your account and all of your content.</p>
            <button
                className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200'
                onClick={handleDeleteClick}
            >
                Delete Account
            </button>
        </motion.div>
    );
};

export default DangerZone;