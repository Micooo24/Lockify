import { useState } from "react";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { toast } from "react-hot-toast";

const Notifications = () => {
    const [notifications, setNotifications] = useState({
        push: true,
        email: false,
        sms: true,
    });

    const handleTogglePush = () => {
        const newStatus = !notifications.push;
        setNotifications({ ...notifications, push: newStatus });
        toast.success(`Push notifications ${newStatus ? "on" : "off"}`);
    };

    const handleToggleEmail = () => {
        const newStatus = !notifications.email;
        setNotifications({ ...notifications, email: newStatus });
        toast.success(`Email notifications ${newStatus ? "on" : "off"}`);
    };

    return (
        <SettingSection icon={Bell} title={"Notifications"}>
            <ToggleSwitch
                label={"Push Notifications"}
                isOn={notifications.push}
                onToggle={handleTogglePush}
            />
            <ToggleSwitch
                label={"Email Notifications"}
                isOn={notifications.email}
                onToggle={handleToggleEmail}
            />
            <ToggleSwitch
                label={"SMS Notifications"}
                isOn={notifications.sms}
                onToggle={() => setNotifications({ ...notifications, sms: !notifications.sms })}
            />
        </SettingSection>
    );
};

export default Notifications;