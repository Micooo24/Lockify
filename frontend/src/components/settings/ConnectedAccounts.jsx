import { useState } from "react";
import SettingSection from "./SettingSection";
import { HelpCircle, Plus, Facebook, Twitter, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

const ConnectedAccounts = () => {
    const [connectedAccounts, setConnectedAccounts] = useState([
        {
            id: 1,
            name: "Google",
            connected: true,
            icon: Mail,
        },
        {
            id: 2,
            name: "Facebook",
            connected: false,
            icon: Facebook,
        },
        {
            id: 3,
            name: "Twitter",
            connected: true,
            icon: Twitter,
        },
    ]);

    const handleToggleConnection = (account) => {
        const newStatus = !account.connected;
        setConnectedAccounts(
            connectedAccounts.map((acc) => {
                if (acc.id === account.id) {
                    return {
                        ...acc,
                        connected: newStatus,
                    };
                }
                return acc;
            })
        );
        toast.success(`${account.name} ${newStatus ? "connected" : "disconnected"}`);
    };

    return (
        <SettingSection icon={HelpCircle} title={"Connected Accounts"}>
            {connectedAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between py-3">
                    <div className="flex gap-2 items-center">
                        <account.icon className="h-10 w-10 text-[#386490]" />
                        <span className="text-[black] font-medium">{account.name}</span>
                    </div>
                    <button
                        className={`px-4 py-2 rounded-lg text-black font-semibold ${
                            account.connected
                                ? "bg-[#CDF5FD] hover:bg-[#A0E9FF] text-[black]"
                                : "bg-[#89CFF3] hover:bg-[#00A9FF] text-[black]"
                        } transition duration-200`}
                        onClick={() => handleToggleConnection(account)}
                    >
                        {account.connected ? "Connected" : "Connect"}
                    </button>
                </div>
            ))}
            <button className="mt-4 flex items-center text-[black] hover:text-[#386490] transition duration-200">
                <Plus size={18} className="mr-2" /> Add Account
            </button>
        </SettingSection>
    );
};

export default ConnectedAccounts;