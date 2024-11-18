import { motion } from "framer-motion";
import { ShieldCheck, Key, UserCheck, AlertTriangle } from "lucide-react";

const INSIGHTS = [
	{
		icon: ShieldCheck,
		color: "text-green-500",
		insight: "80% of users have passwords classified as 'Strong' or 'Very Strong,' indicating good adherence to security policies.",
	},
	{
		icon: Key,
		color: "text-blue-500",
		insight: "Password complexity has increased by 12% due to recent security awareness initiatives.",
	},
	{
		icon: UserCheck,
		color: "text-purple-500",
		insight: "Multi-factor authentication adoption has improved by 20%, reducing reliance on password strength alone.",
	},
	{
		icon: AlertTriangle,
		color: "text-yellow-500",
		insight: "Common patterns like '123' and 'password' are still observed in 5% of passwords, suggesting the need for stricter policies.",
	},
];

const AIPoweredInsights = () => {
	return (
		<motion.div
			className='bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1.0 }}
		>
			<h2 className='text-xl font-semibold text-black mb-4'>Password Strength Insights</h2>
			<div className='space-y-4'>
				{INSIGHTS.map((item, index) => (
					<div key={index} className='flex items-center space-x-3'>
						<div className={`p-2 rounded-full ${item.color} bg-opacity-20`}>
							<item.icon className={`size-6 ${item.color}`} />
						</div>
						<p className='text-black'>{item.insight}</p>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default AIPoweredInsights;
