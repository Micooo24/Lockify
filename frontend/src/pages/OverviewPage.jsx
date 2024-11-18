import { useEffect, useState } from "react";
import { Activity, Shield, Users, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import PasswordStrengthOverviewChart from "../components/overview/PasswordStrengthOverviewChart";
import PasswordStrengthDistributionChart from "../components/overview/PasswordStrengthDistributionChart";

const OverviewPage = () => {
    const [newUsersCount, setNewUsersCount] = useState(0);
    const [totalPasswordsAnalyzed, setTotalPasswordsAnalyzed] = useState(0);
    const [averageEntropy, setAverageEntropy] = useState(0);
    const [weakPasswordsCount, setWeakPasswordsCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/list");
                const data = await response.json();
                setNewUsersCount(data.length);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchPasswordsAnalyzed = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/analysis/display");
                const data = await response.json();
                setTotalPasswordsAnalyzed(data.length);

                const totalEntropy = data.reduce((sum, password) => sum + password.entropy, 0);
                const avgEntropy = totalEntropy / data.length;
                setAverageEntropy((avgEntropy * 100).toFixed(2));

                const weakPasswords = data.filter(password => password.entropy < 40).length;
                setWeakPasswordsCount(weakPasswords);
            } catch (error) {
                console.error("Error fetching passwords analyzed:", error);
            }
        };

        fetchUsers();
        fetchPasswordsAnalyzed();
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10 bg-[#ECF9FF]'>
            <Header title='Overview' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='New Users' icon={Users} value={newUsersCount} color='#8B5CF6' />
                    <StatCard 
                        name='Total Passwords Analyzed' 
                        icon={Shield} 
                        value={totalPasswordsAnalyzed} 
                        color='#6366F1' 
                    />

                    <StatCard 
                        name='Average Strength Score' 
                        icon={Activity} 
                        value={`${averageEntropy}%`} 
                        color='#10B981' 
                    />

                    <StatCard 
                        name='Weak Passwords Detected' 
                        icon={AlertCircle} 
                        value={weakPasswordsCount} 
                        color='#F87171' 
                    />

                </motion.div>

                {/* CHARTS */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <PasswordStrengthOverviewChart />
                    <PasswordStrengthDistributionChart />
                </div>
            </main>
        </div>
    );
};

export default OverviewPage;