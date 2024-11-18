import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const AccountActivityOverview = () => {
    const [userActivityData, setUserActivityData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/account/display");
                const accounts = response.data;

                // Process the data to show user activity
                const activityData = accounts.map((account) => ({
                    name: account.name,
                    value: 1, // Each account represents one activity
                }));

                // Aggregate the data by account name
                const aggregatedData = activityData.reduce((acc, curr) => {
                    const existing = acc.find(item => item.name === curr.name);
                    if (existing) {
                        existing.value += 1;
                    } else {
                        acc.push(curr);
                    }
                    return acc;
                }, []);

                setUserActivityData(aggregatedData);
            } catch (error) {
                console.error("Error fetching user activity data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <motion.div
            className='bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className='text-xl font-semibold text-black mb-4'>Account Activity Overview</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={userActivityData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='name' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        <Bar dataKey='value' fill='#6366F1' />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default AccountActivityOverview;