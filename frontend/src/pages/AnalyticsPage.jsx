import Header from "../components/common/Header";
import OverviewCards from "../components/analytics/OverviewCards";
import PasswordCompositionChart from "../components/analytics/PasswordCompositionChart";
import PasswordStrengthChart from "../components/analytics/PasswordStrengthChart";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";

const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-[#ECF9FF]'>
			<Header title={"Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<PasswordCompositionChart />
					<PasswordStrengthChart />
					
			
				</div>

				<AIPoweredInsights />
			</main>
		</div>
	);
};
export default AnalyticsPage;
