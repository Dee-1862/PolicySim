import React, { useState, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Leaf,
  Factory,
  Users,
  TrendingUp,
  AlertTriangle,
  Loader2,
  MessageSquare,
  MapPin,
  Calendar,
  Settings,
  CheckCircle,
  ArrowRight,
  BarChart4,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Helper for policy sliders
const PolicySlider = ({
  label,
  value,
  onChange,
  max,
  icon: Icon,
}: {
  label: string;
  value: number;
  onChange: (val: number[]) => void;
  max: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
    <Slider
      value={[value]}
      onValueChange={onChange}
      max={max}
      step={1}
      className="w-full"
    />
    <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
      {value}
    </p>
  </div>
);

// Helper for policy switches
const PolicySwitch = ({
  label,
  checked,
  onCheckedChange,
  icon: Icon,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

// Helper for policy select dropdowns
const PolicySelect = ({
  label,
  value,
  onValueChange,
  options,
  icon: Icon,
}: {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className="capitalize">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const Badge = ({ type }: { type: "Gold" | "Silver" | "Bronze" }) => {
  const badgeVariants = {
    Gold: { bg: "bg-yellow-400/90 text-white", text: "Gold" },
    Silver: { bg: "bg-gray-400/90 text-white", text: "Silver" },
    Bronze: { bg: "bg-orange-700/90 text-white", text: "Bronze" },
  };
  const { bg, text } = badgeVariants[type] || {
    bg: "bg-gray-500 text-white",
    text: "None",
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-sm font-semibold", bg)}>
      {text}
    </span>
  );
};

// Component for displaying impact scores
const ScoreCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={`p-3 rounded-full ${color}`}>
        {Icon && <Icon className="w-5 h-5 text-white" />}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export function Simulator() {
  const [location, setLocation] = useState({
    name: "Kenya",
    lat: -1.2921,
    lon: 36.8219,
  });
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2100);
  const [policies, setPolicies] = useState({
    carbonTaxRate: 20,
    renewableSubsidy: 50,
    fossilFuelPhaseout: "medium",
    deforestationBan: true,
    educationCampaigns: 50,
    greenJobsInitiative: 5,
    industryRegulations: "medium",
    justiceLensStrength: 50,
    adaptationInvestment: 5,
    carbonCaptureRAndD: 5,
  });

  type SimulationResult = {
    policyName: string;
    description: string;
    badge: "Gold" | "Silver" | "Bronze";
    carbonScore: string;
    justiceScore: string;
    economicPressure: string;
    temperatureTrajectory: number[];
    suggestedPolicyName: string;
    suggestedPolicy: {
      carbonTaxRate: number;
      renewableSubsidy: number;
      adaptationInvestment: number;
      [key: string]: any;
    };
    aiComment: string;
    [key: string]: any;
  };
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggested, setShowSuggested] = useState(false);

  const handlePolicyChange = useCallback(
    (policyName: keyof typeof policies, newValue: any) => {
      setPolicies((prevPolicies) => ({
        ...prevPolicies,
        [policyName]: newValue,
      }));
    },
    []
  );

  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const inputData = { location, startYear, endYear, policies };
      const response = await fetch("http://localhost:5000/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during simulation.");
    } finally {
      setLoading(false);
    }
  }, [location, startYear, endYear, policies]);

  const resetSimulation = () => {
    setResult(null);
    setPolicies({
      carbonTaxRate: 20,
      renewableSubsidy: 50,
      fossilFuelPhaseout: "medium",
      deforestationBan: true,
      educationCampaigns: 50,
      greenJobsInitiative: 5,
      industryRegulations: "medium",
      justiceLensStrength: 50,
      adaptationInvestment: 5,
      carbonCaptureRAndD: 5,
    });
    setShowSuggested(false);
  };

  const chartData = Array.isArray(result?.temperatureTrajectory)
    ? (result.temperatureTrajectory as number[]).map((temp, idx) => ({
        year: startYear + idx,
        temperature: temp,
      }))
    : [];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Banner with Gradient Background */}
      <div className="relative py-10 sm:py-12 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-1/2 aspect-square w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-400 to-purple-500 opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Policy Simulator
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Design and test climate policies with our interactive simulation
            tool. Visualize impacts before implementation.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 pb-24">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Settings className="w-6 h-6 text-indigo-600" />
            Policy Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <PolicySlider
                label="Carbon Tax Rate ($/tCO2)"
                value={policies.carbonTaxRate}
                onChange={(val) => handlePolicyChange("carbonTaxRate", val[0])}
                max={200}
                icon={Zap}
              />
              <PolicySlider
                label="Renewable Energy Subsidy (%)"
                value={policies.renewableSubsidy}
                onChange={(val) =>
                  handlePolicyChange("renewableSubsidy", val[0])
                }
                max={100}
                icon={Leaf}
              />
              <PolicySelect
                label="Fossil Fuel Phaseout Speed"
                value={policies.fossilFuelPhaseout}
                onValueChange={(val) =>
                  handlePolicyChange("fossilFuelPhaseout", val)
                }
                options={["fast", "medium", "slow"]}
                icon={Factory}
              />
              <PolicySwitch
                label="Deforestation Ban"
                checked={policies.deforestationBan}
                onCheckedChange={(checked) =>
                  handlePolicyChange("deforestationBan", checked)
                }
                icon={Leaf}
              />
              <PolicySlider
                label="Education Campaigns (%)"
                value={policies.educationCampaigns}
                onChange={(val) =>
                  handlePolicyChange("educationCampaigns", val[0])
                }
                max={100}
                icon={Users}
              />
            </div>
            <div className="space-y-6">
              <PolicySlider
                label="Green Jobs Initiative (Millions)"
                value={policies.greenJobsInitiative}
                onChange={(val) =>
                  handlePolicyChange("greenJobsInitiative", val[0])
                }
                max={10}
                icon={TrendingUp}
              />
              <PolicySelect
                label="Industry Regulations"
                value={policies.industryRegulations}
                onValueChange={(val) =>
                  handlePolicyChange("industryRegulations", val)
                }
                options={["high", "medium", "low"]}
                icon={Factory}
              />
              <PolicySlider
                label="Justice Lens Strength (%)"
                value={policies.justiceLensStrength}
                onChange={(val) =>
                  handlePolicyChange("justiceLensStrength", val[0])
                }
                max={100}
                icon={Users}
              />
              <PolicySlider
                label="Adaptation Investment (Billions)"
                value={policies.adaptationInvestment}
                onChange={(val) =>
                  handlePolicyChange("adaptationInvestment", val[0])
                }
                max={10}
                icon={TrendingUp}
              />
              <PolicySlider
                label="Carbon Capture R&D (Billions)"
                value={policies.carbonCaptureRAndD}
                onChange={(val) =>
                  handlePolicyChange("carbonCaptureRAndD", val[0])
                }
                max={10}
                icon={Leaf}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-indigo-500" /> Location
              </label>
              <input
                value={location.name}
                onChange={(e) =>
                  setLocation({ ...location, name: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Start Year
              </label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> End Year
              </label>
              <input
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value, 10))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={runSimulation}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  Run Simulation
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
            <Button
              onClick={resetSimulation}
              variant="outline"
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold px-6 py-3 rounded-md transition-colors duration-200 border border-gray-300 dark:border-gray-700"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg shadow-sm"
              role="alert"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Simulation Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Results Header with Badge */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/30 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.policyName}
                    </h2>
                  </div>
                  <Badge type={result.badge} />
                </div>
                <p className="text-gray-700 pt-3 dark:text-white">
                  {result.description}
                </p>
              </div>

              {/* Results Content */}
              <div className="p-6">
                {/* Scores Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <ScoreCard
                    label="Carbon Score"
                    value={result.carbonScore}
                    icon={Leaf}
                    color="bg-green-500"
                  />
                  <ScoreCard
                    label="Justice Score"
                    value={result.justiceScore}
                    icon={Users}
                    color="bg-blue-500"
                  />
                  <ScoreCard
                    label="Economic Pressure"
                    value={result.economicPressure}
                    icon={TrendingUp}
                    color="bg-amber-500"
                  />
                </div>

                {/* Temperature Chart */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <BarChart4 className="w-5 h-5 text-indigo-500" />
                    Temperature Trajectory
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 h-80 border border-gray-200 dark:border-gray-700">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="year"
                          stroke="#6b7280"
                          tick={{ fill: "#6b7280" }}
                        />
                        <YAxis
                          stroke="#6b7280"
                          tick={{ fill: "#6b7280" }}
                          label={{
                            value: "°C",
                            angle: -90,
                            position: "insideLeft",
                            fill: "#6b7280",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#6366f1"
                          strokeWidth={1.5}
                          dot={false}
                          name="Global Temperature"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Policy Suggestion */}
                <div className="mt-8">
                  <Button
                    onClick={() => setShowSuggested(!showSuggested)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/40 dark:text-indigo-300 font-medium px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {showSuggested
                      ? "Hide Recommendation"
                      : "Show AI Recommendation"}
                  </Button>

                  <AnimatePresence>
                    {showSuggested && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                          <Zap className="w-5 h-5 text-indigo-600" />
                          Recommended Policy: {result.suggestedPolicyName}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Carbon Tax Rate
                            </p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              {result.suggestedPolicy.carbonTaxRate}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Renewable Subsidy
                            </p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              {result.suggestedPolicy.renewableSubsidy}%
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Adaptation Investment
                            </p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              ${result.suggestedPolicy.adaptationInvestment}B
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white mb-1">
                              AI Recommendation
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                              {result.aiComment}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}