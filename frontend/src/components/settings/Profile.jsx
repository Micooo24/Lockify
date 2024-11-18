import { useState } from "react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { toast } from "react-hot-toast";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Admin");
    const [email, setEmail] = useState("admin@gmail.com");
    const [tempName, setTempName] = useState(name);
    const [tempEmail, setTempEmail] = useState(email);

    const handleEditClick = () => {
        setTempName(name);
        setTempEmail(email);
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setName(tempName);
        setEmail(tempEmail);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    return (
        <>
            <SettingSection icon={User} title={"Profile"}>
                <div className='flex flex-col sm:flex-row items-center mb-6'>
                    <User className='rounded-full w-20 h-20 object-cover mr-4 text-[#386490]' />

                    <div>
                        {isEditing ? (
                            <>
                                <div className='mb-4'>
                                    <label className='block text-sm font-medium text-gray-700'>Name</label>
                                    <input
                                        type='text'
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <label className='block text-sm font-medium text-gray-700'>Email</label>
                                    <input
                                        type='email'
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                        value={tempEmail}
                                        onChange={(e) => setTempEmail(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-end'>
                                    <button
                                        className='bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2'
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className='bg-[#89CFF3] hover:bg-[#00A9FF] text-black font-bold py-2 px-4 rounded'
                                        onClick={handleSaveClick}
                                    >
                                        Save
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className='text-lg font-semibold text-[black]'>{name}</h3>
                                <p className='text-[black]'>{email}</p>
                                <button
                                    className='bg-[#89CFF3] hover:bg-[#00A9FF] text-black font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto mt-4'
                                    onClick={handleEditClick}
                                >
                                    Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </SettingSection>
        </>
    );
};

export default Profile;