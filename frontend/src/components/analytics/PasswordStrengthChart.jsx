import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const PasswordStrengthChart = () => {
    const [passwordStrengthData, setPasswordStrengthData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/analysis/display");
                const data = response.data;

                const weakPasswords = data.filter(password => password.entropy < 40).length;
                const mediumPasswords = data.filter(password => password.entropy >= 40 && password.entropy < 70).length;
                const strongPasswords = data.filter(password => password.entropy >= 70 && password.entropy < 80).length;
                const veryStrongPasswords = data.filter(password => password.entropy >= 80).length;

                const totalEntropy = data.reduce((sum, password) => sum + password.entropy, 0);
                const averageEntropy = totalEntropy / data.length;

                const passwordStrengthData = [
                    { category: "Weak", count: weakPasswords, complexityScore: (weakPasswords / data.length) * 100 },
                    { category: "Moderate", count: mediumPasswords, complexityScore: (mediumPasswords / data.length) * 100 },
                    { category: "Strong", count: strongPasswords, complexityScore: (strongPasswords / data.length) * 100 },
                    { category: "Very Strong", count: veryStrongPasswords, complexityScore: (veryStrongPasswords / data.length) * 100 },
                ];

                setPasswordStrengthData(passwordStrengthData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <motion.div
            className='bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className='bg-white text-xl font-semibold text-black mb-4'>Password Strength Distribution</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={passwordStrengthData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='category' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        <Bar dataKey='count' fill='#8B5CF6' name='Password Count' />
                        <Bar dataKey='complexityScore' fill='#10B981' name='Complexity Score' />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default PasswordStrengthChart;