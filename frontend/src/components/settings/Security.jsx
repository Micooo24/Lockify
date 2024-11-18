import { Lock, Eye, EyeOff } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Security = () => {
    const [twoFactor, setTwoFactor] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [password, setPassword] = useState("password");
    const [showPassword, setShowPassword] = useState(false);

    const handleToggleTwoFactor = () => {
        const newStatus = !twoFactor;
        setTwoFactor(newStatus);
        toast.success(`Two-Factor Authentication ${newStatus ? "on" : "off"}`);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <SettingSection icon={Lock} title={"Security"}>
            <ToggleSwitch
                label={"Two-Factor Authentication"}
                isOn={twoFactor}
                onToggle={handleToggleTwoFactor}
            />
            <div className='mt-4'>
                {isChangingPassword ? (
                    <div className='flex flex-col'>
                        <label className='block text-sm font-medium text-gray-700'>New Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                onClick={handleTogglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                        <div className='flex justify-end mt-4'>
                            <button
                                className='bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2'
                                onClick={() => setIsChangingPassword(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className='bg-[#89CFF3] hover:bg-[#00A9FF] text-black font-bold py-2 px-4 rounded'
                                onClick={() => {
                                    toast.success("Password changed successfully!");
                                    setIsChangingPassword(false);
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className='bg-[#89CFF3] hover:bg-[#00A9FF] text-black font-bold py-2 px-4 rounded transition duration-200'
                        onClick={() => setIsChangingPassword(true)}
                    >
                        Change Password
                    </button>
                )}
            </div>
        </SettingSection>
    );
};

export default Security;