import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Calculator,
  Building,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Target,
  BarChart3,
  FileText,
  Clock,
  Zap,
  Shield,
  Globe
} from "lucide-react";

const ConstructionCalculator = () => {
  const [activeTab, setActiveTab] = useState("roi");
  const [projectType, setProjectType] = useState("construction");
  const [monthlyRevenue, setMonthlyRevenue] = useState("10000");
  const [operatingCosts, setOperatingCosts] = useState("6000");
  const [laborCosts, setLaborCosts] = useState("2000");
  const [materialCosts, setMaterialCosts] = useState("1500");
  const [projectDuration, setProjectDuration] = useState("3");
  const [clientBudget, setClientBudget] = useState("25000");
  const [profitMargin, setProfitMargin] = useState("25");
  const [teamSize, setTeamSize] = useState("5");
  const [hourlyRate, setHourlyRate] = useState("45");

  const [calculations, setCalculations] = useState({
    grossProfit: 0,
    netProfit: 0,
    profitMargin: 0,
    roi: 0,
    breakEvenPoint: 0,
    laborEfficiency: 0,
    projectProfitability: 0
  });

  const businessTypes = [
    { value: "construction", label: "Construction", icon: Building },
    { value: "renovation", label: "Home Renovation", icon: Package },
    { value: "contracting", label: "General Contracting", icon: Users },
    { value: "consulting", label: "Consulting", icon: Target },
  ];

  // Calculate all business metrics
  useEffect(() => {
    calculateBusinessMetrics();
  }, [monthlyRevenue, operatingCosts, laborCosts, materialCosts, projectDuration, clientBudget, profitMargin, teamSize, hourlyRate]);

  const calculateBusinessMetrics = () => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    const opCosts = parseFloat(operatingCosts) || 0;
    const labor = parseFloat(laborCosts) || 0;
    const materials = parseFloat(materialCosts) || 0;
    const duration = parseFloat(projectDuration) || 0;
    const budget = parseFloat(clientBudget) || 0;
    const margin = parseFloat(profitMargin) || 0;
    const team = parseFloat(teamSize) || 0;
    const rate = parseFloat(hourlyRate) || 0;

    const totalCosts = opCosts + labor + materials;
    const grossProfit = revenue - totalCosts;
    const netProfit = grossProfit * (1 - 0.3); // Assuming 30% taxes
    const actualProfitMargin = (grossProfit / revenue) * 100;
    const roi = ((grossProfit / totalCosts) * 100) / duration;
    const breakEvenPoint = totalCosts / (revenue / 30); // Days to break even
    const laborEfficiency = (revenue / (labor * team)) * 100;
    const projectProfitability = (budget * (margin / 100)) - (labor * duration + materials);

    setCalculations({
      grossProfit,
      netProfit,
      profitMargin: actualProfitMargin,
      roi,
      breakEvenPoint,
      laborEfficiency,
      projectProfitability
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              Business Profit Calculator
            </h1>
            <p className="text-gray-600 mt-2">
              Optimize your construction business profitability with real-time financial analysis
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Real-time Analysis
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Business Type & Quick Stats */}
          <div className="xl:col-span-1 space-y-6">
            {/* Business Type Selection */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Business Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={projectType === type.value ? "default" : "outline"}
                    onClick={() => setProjectType(type.value)}
                    className="w-full justify-start h-12"
                  >
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Profit Tips */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  Profit Boosters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <Target className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Reduce Material Waste</p>
                    <p className="text-gray-600">Save 5-15% on material costs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Optimize Team Size</p>
                    <p className="text-gray-600">Right-size labor for each project</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Time Management</p>
                    <p className="text-gray-600">Complete projects 20% faster</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg border-0 shadow-lg p-1">
              <div className="flex space-x-1">
                {[
                  { id: "roi", label: "ROI Analysis", icon: TrendingUp },
                  { id: "profit", label: "Profit Margin", icon: DollarSign },
                  { id: "labor", label: "Labor Costs", icon: Users },
                  { id: "projects", label: "Project Quotes", icon: FileText },
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1"
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Financial Inputs */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Financial Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Revenue & Costs */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Income & Expenses</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="revenue">Monthly Revenue</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="revenue"
                            value={monthlyRevenue}
                            onChange={(e) => setMonthlyRevenue(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="operating">Operating Costs</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="operating"
                            value={operatingCosts}
                            onChange={(e) => setOperatingCosts(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="labor">Labor Costs</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="labor"
                            value={laborCosts}
                            onChange={(e) => setLaborCosts(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Project Setup</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="materials">Material Costs</Label>
                        <Input
                          id="materials"
                          value={materialCosts}
                          onChange={(e) => setMaterialCosts(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Project Duration (months)</Label>
                        <Input
                          id="duration"
                          value={projectDuration}
                          onChange={(e) => setProjectDuration(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Client Budget</Label>
                        <Input
                          id="budget"
                          value={clientBudget}
                          onChange={(e) => setClientBudget(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Advanced Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="margin">Target Profit Margin (%)</Label>
                      <Input
                        id="margin"
                        value={profitMargin}
                        onChange={(e) => setProfitMargin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team">Team Size</Label>
                      <Input
                        id="team"
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Hourly Rate ($)</Label>
                      <Input
                        id="rate"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Dashboard */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Profitability Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Gross Profit</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculations.grossProfit)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculations.netProfit)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatPercentage(calculations.profitMargin)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {formatPercentage(calculations.roi)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600">Break-even Point</p>
                    <p className="text-lg font-bold text-blue-800">
                      {calculations.breakEvenPoint.toFixed(1)} days
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600">Labor Efficiency</p>
                    <p className="text-lg font-bold text-green-800">
                      {formatPercentage(calculations.laborEfficiency)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-600">Project Profit</p>
                    <p className="text-lg font-bold text-purple-800">
                      {formatCurrency(calculations.projectProfitability)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Insights & Actions */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profitability Rating */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Business Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {calculations.profitMargin > 20 ? "A" : 
                     calculations.profitMargin > 15 ? "B" : 
                     calculations.profitMargin > 10 ? "C" : "D"}
                  </div>
                  <p className="text-green-800 font-semibold">Good Standing</p>
                  <p className="text-green-600 text-sm mt-2">
                    {calculations.profitMargin > 20 ? "Excellent profitability" :
                     calculations.profitMargin > 15 ? "Good profitability" :
                     calculations.profitMargin > 10 ? "Average performance" :
                     "Needs improvement"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculations.profitMargin < 15 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-semibold text-red-800">Increase Pricing</p>
                    <p className="text-xs text-red-600">Consider 5-10% price adjustment</p>
                  </div>
                )}
                {calculations.laborEfficiency < 80 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-semibold text-amber-800">Optimize Labor</p>
                    <p className="text-xs text-amber-600">Review team allocation</p>
                  </div>
                )}
                {calculations.roi < 20 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">Reduce Costs</p>
                    <p className="text-xs text-blue-600">Find material cost savings</p>
                  </div>
                )}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">Maintain Quality</p>
                  <p className="text-xs text-green-600">Client satisfaction drives referrals</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Export */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Export Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Report
                </Button>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel Export
                </Button>
                <Button className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Share with Client
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionCalculator;