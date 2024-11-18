import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const PasswordStrengthOverviewChart = () => {
    const [passwordStrengthData, setPasswordStrengthData] = useState([]);

    useEffect(() => {
        const fetchPasswordStrengthData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/analysis/display");
                const data = await response.json();

                const weakCount = data.filter(password => password.entropy < 40).length;
                const mediumCount = data.filter(password => password.entropy >= 40 && password.entropy < 70).length;
                const strongCount = data.filter(password => password.entropy >= 70).length;

                setPasswordStrengthData([
                    { name: "Weak", count: weakCount },
                    { name: "Medium", count: mediumCount },
                    { name: "Strong", count: strongCount }
                ]);
            } catch (error) {
                console.error("Error fetching password strength data:", error);
            }
        };

        fetchPasswordStrengthData();
    }, []);

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-lg font-medium mb-4 text-gray-800">Password Strength Distribution</h2>

            <div className="h-80">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={passwordStrengthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            dataKey={"name"}
                            stroke="black"
                            tick={{ fill: "black", fontWeight: "bold" }} // Set the default tick text color to black
                            activeTick={{ fill: "black", fontWeight: "bold" }} // Ensure the tick is bold when active
                        />
                        <YAxis stroke="black" label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderColor: "#E5E7EB",
                            }}
                            itemStyle={{ color: "#4B5563" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#1D4ED8" // Dark blue for the line
                            strokeWidth={3}
                            dot={{ fill: "#1D4ED8", strokeWidth: 2, r: 6 }}
                            activeDot={{
                                r: 8,
                                strokeWidth: 2,
                                fill: "#1D4ED8", // Color of the dot when hovered
                                stroke: "black", // Border color when hovered
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default PasswordStrengthOverviewChart;