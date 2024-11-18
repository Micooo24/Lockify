import { useEffect, useState } from "react";
import axios from "axios";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";


const UsersPage = () => {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        newUsersToday: 0,
        activeUsers: 0,
        churnRate: "2.4%",
    });

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/list");
                const totalUsers = response.data.length; // Assuming the response is an array of users
                setUserStats(prevStats => ({
                    ...prevStats,
                    totalUsers: totalUsers,
                    newUsersToday: totalUsers, // Setting new users today to the same count as total users
                    activeUsers: totalUsers, // Setting active users to the same count as total users
                }));
            } catch (error) {
                console.error("Error fetching total users:", error);
            }
        };

        fetchTotalUsers();
    }, []);

    return (
        <div className='flex-1 overflow-auto relative bg-[#ECF9FF]'>
            <Header title='Users' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Total Users'
                        icon={UsersIcon}
                        value={userStats.totalUsers.toLocaleString()}
                        color='#6366F1'
                    />
                    <StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
                    <StatCard
                        name='Active Users'
                        icon={UserCheck}
                        value={userStats.activeUsers.toLocaleString()}
                        color='#F59E0B'
                    />
                    <StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' />
                </motion.div>

                <UsersTable />

                {/* USER CHARTS */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
                    <UserGrowthChart />
                    <UserActivityHeatmap />
              
                </div>
            </main>
        </div>
    );
};

export default UsersPage;