import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#4B5563"];

const PasswordCompositionChart = () => {
    const [passwordCompositionData, setPasswordCompositionData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/analysis/display");
                const data = response.data;

                const compositionCounts = {};

                data.forEach(password => {
                    const remarks = JSON.parse(password.remarks.replace(/'/g, '"'));
                    remarks.forEach(remark => {
                        const simplifiedRemark = remark
                            .replace(/Password breached \d+ times/, "Password breached")
                            .replace(/Password does not contain repeating characters/, "No repeating characters")
                            .replace(/Password does not contain sequential characters/, "No sequential characters")
                            .replace(/Password does not contain keyboard pattern/, "No keyboard pattern")
                            .replace(/Password is not a mirrored string/, "Not a mirrored string")
                            .replace(/Password contains leetspeak/, "Contains leetspeak");

                        if (compositionCounts[simplifiedRemark]) {
                            compositionCounts[simplifiedRemark] += 1;
                        } else {
                            compositionCounts[simplifiedRemark] = 1;
                        }
                    });
                });

                const compositionData = Object.keys(compositionCounts).map(key => ({
                    name: key,
                    value: compositionCounts[key],
                }));

                setPasswordCompositionData(compositionData);
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
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-black mb-4'>Remarks Composition</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={passwordCompositionData}
                            cx='50%'
                            cy='50%'
                            outerRadius={80}
                            fill='#8884d8'
                            dataKey='value'
                            label={({ name, percent }) => (percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : '')}
                        >
                            {passwordCompositionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default PasswordCompositionChart;