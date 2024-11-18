import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";
import axios from "axios";

const OverviewCards = () => {
    const [overviewData, setOverviewData] = useState([
        { name: "Passwords Analyzed", value: "0", change: 0, icon: Eye },
        { name: "Weak Passwords", value: "0", change: 0, icon: AlertTriangle },
        { name: "Medium Passwords", value: "0", change: 0, icon: Shield },
        { name: "Strong Passwords", value: "0", change: 0, icon: CheckCircle },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/analysis/display");
                const data = response.data;

                const passwordsAnalyzed = data.length;
                const weakPasswords = data.filter(password => password.entropy < 40).length;
                const mediumPasswords = data.filter(password => password.entropy >= 40 && password.entropy < 70).length;
                const strongPasswords = data.filter(password => password.entropy >= 70).length;
                const totalEntropy = data.reduce((sum, password) => sum + password.entropy, 0);
                const averageEntropy = (totalEntropy / data.length).toFixed(2);

                setOverviewData([
                    { name: "Passwords Analyzed", value: passwordsAnalyzed.toString(), change: 10.2, icon: Eye },
                    { name: "Weak Passwords", value: weakPasswords.toString(), change: -5.6, icon: AlertTriangle },
                    { name: "Medium Passwords", value: mediumPasswords.toString(), change: 3.4, icon: Shield },
                    { name: "Strong Passwords", value: strongPasswords.toString(), change: 1.2, icon: CheckCircle },
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
            {overviewData.map((item, index) => (
                <motion.div
                    key={item.name}
                    className='bg-white backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-sm font-medium text-black'>{item.name}</h3>
                            <p className='mt-1 text-xl font-semibold text-black'>{item.value}</p>
                        </div>

                        <div
                            className={`p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}`}
                        >
                            <item.icon className={`size-6 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`} />
                        </div>
                    </div>
                    <div className={`mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {item.change >= 0 ? <ArrowUpRight size='20' /> : <ArrowDownRight size='20' />}
                        <span className='ml-1 text-sm font-medium'>{Math.abs(item.change)}%</span>
                        <span className='ml-2 text-sm text-black'>vs last period</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default OverviewCards;