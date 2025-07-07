
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/StatsCards";
import VisitorInsights from "@/components/VisitorInsights";
import RevenueChart from "@/components/RevenueChart";
import SatisfactionChart from "@/components/SatisfactionChart";
import TargetChart from "@/components/TargetChart";
import TopProducts from "@/components/TopProducts";
import SalesMapping from "@/components/SalesMapping";
import VolumeChart from "@/components/VolumeChart";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </div>
        <StatsCards />
        <VisitorInsights />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueChart />
          <SatisfactionChart />
          <TargetChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopProducts />
          <SalesMapping />
          <VolumeChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
