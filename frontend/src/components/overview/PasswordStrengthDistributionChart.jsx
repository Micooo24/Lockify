import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#A0D3FF", "#70B8FF", "#409EFF", "#1E60CC"];

const PasswordStrengthDistributionChart = () => {
    const [strengthData, setStrengthData] = useState([]);

    useEffect(() => {
        const fetchPasswordStrengthData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/analysis/display");
                const data = await response.json();

                const weakCount = data.filter(password => password.entropy < 40).length;
                const moderateCount = data.filter(password => password.entropy >= 40 && password.entropy < 70).length;
                const strongCount = data.filter(password => password.entropy >= 70 && password.entropy < 80).length;
                const veryStrongCount = data.filter(password => password.entropy >= 80).length;

                setStrengthData([
                    { name: "Weak", value: weakCount },
                    { name: "Moderate", value: moderateCount },
                    { name: "Strong", value: strongCount },
                    { name: "Very Strong", value: veryStrongCount }
                ]);
            } catch (error) {
                console.error("Error fetching password strength data:", error);
            }
        };

        fetchPasswordStrengthData();
    }, []);

    return (
        <motion.div
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-lg font-medium mb-4 text-gray-800">Password Strength Distribution</h2>
            <div className="h-80">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <PieChart>
                        <Pie
                            data={strengthData}
                            cx={"50%"}
                            cy={"50%"}
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                        >
                            {strengthData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderColor: "#E5E7EB",
                            }}
                            itemStyle={{ color: "#1F2937" }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default PasswordStrengthDistributionChart;