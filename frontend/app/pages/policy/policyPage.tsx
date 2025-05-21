import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  AlertCircle,
  Zap,
  Leaf,
  Factory,
  Users,
  TrendingUp,
  Settings,
  CheckCircle,
  ArrowRight,
  BarChart4,
  Calendar,
  Info,
  ArrowLeft,
  FileText,
  Globe,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "../../lib/utils";

// Types
type BackendPolicyResult = {
  policyName: string;
  description: string;
  country: string;
  policy_status: string;
  policy_type: string;
  policy_instrument: string;
  sector: string;
  start_date?: number;
  end_date?: number;
  decision_date?: number;
  temperatureTrajectory: number[];
  carbonScore: number;
  justiceScore: number;
  economicPressure: number;
  suggestedPolicyName: string;
  aiComment: string;
  strength: string;
  weakness: string;
  reference?: string;
};

// Helper function to render tags
const renderTags = (tags: string) => {
  if (!tags) return <span className="text-gray-500">N/A</span>;
  const tagList = tags.split(",").map((tag) => tag.trim());
  const decodeTag = (tag: string) =>
    tag
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

  return (
    <div className="flex flex-wrap gap-2">
      {tagList.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        >
          {decodeTag(tag)}
        </Badge>
      ))}
    </div>
  );
};

// Policy status badge component
const PolicyBadge = ({ type }: { type: string }) => {
  const badgeVariants: Record<string, { bg: string; text: string }> = {
    "In force": { bg: "bg-green-600/90 text-white", text: "In force" },
    Superseded: { bg: "bg-orange-400/90 text-white", text: "Superseded" },
    Planned: { bg: "bg-blue-600/90 text-white", text: "Planned" },
    Ended: { bg: "bg-red-600/90 text-white", text: "Ended" },
  };

  const { bg, text } = badgeVariants[type] || {
    bg: "bg-gray-50/90 text-black",
    text: type || "Unknown",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 rounded-full text-sm font-semibold h-7",
        bg
      )}
    >
      {text}
    </span>
  );
};

// Score card component for displaying key metrics
const ScoreCard = ({
  label,
  value,
  icon: Icon,
  color,
  description,
}: {
  label: string;
  value: string | number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  description?: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${color}`}>
        {Icon && <Icon className="w-5 h-5 text-white" />}
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          {label}
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  </div>
);

export function PolicyPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const [result, setResult] = useState<BackendPolicyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!policyId) {
        setError("Policy ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5000/api/policy/${policyId}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Policy not found"
              : `Failed to fetch policy: ${response.status}`
          );
        }

        const data = await response.json();
        setResult(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(
          err.message || "An error occurred while fetching policy data."
        );
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [policyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <Skeleton className="h-32 w-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 w-full" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <Alert className="max-w-md">
          <Info className="h-4 w-4" />
          <AlertTitle>No Policy Found</AlertTitle>
          <AlertDescription>
            Could not retrieve policy details.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-white-50 dark:bg-white-900/20 border-b border-indigo-100 dark:border-indigo-800/30 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0 sm:basis-9/10">
                <div className="flex-shrink-0 w-6 h-6">
                  <FileText className="w-full h-full text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                  {result.policyName}
                </h2>
              </div>
              {result.policy_status && (
                <div className="flex-shrink-0 sm:basis-1/10 flex justify-start sm:justify-end mt-2 sm:mt-0">
                  <PolicyBadge type={result.policy_status} />
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>{result.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Decision: {result.decision_date || "N/A"}</span>
              </div>
            </div>
            <div className="mt-4">
              <p>{result.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Policy Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              Policy Details
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Policy Instrument
                </h3>
                {renderTags(result.policy_instrument)}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Sector
                </h3>
                {renderTags(result.sector)}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Implementation Timeline
                </h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Start Year</span>
                    <span>End Year</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: result.end_date ? "100%" : "60%" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm font-medium">
                    <span>
                      {result.start_date || result.decision_date || "N/A"}
                    </span>
                    <span>{result.end_date || "Ongoing"}</span>
                  </div>
                </div>
              </div>

              {/* Reference link */}
              {result.reference && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Reference Document
                  </h3>
                  <a
                    href={result.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Source Document</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              )}

            </div>
          </div>

          {/* Impact Assessment Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <BarChart4 className="w-5 h-5 text-indigo-600" />
                Impact Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <ScoreCard
                  label="Carbon Score"
                  value={result.carbonScore || "N/A"}
                  icon={Leaf}
                  color="bg-green-500"
                  description="Impact on emissions"
                />
                <ScoreCard
                  label="Justice Score"
                  value={result.justiceScore || "N/A"}
                  icon={Users}
                  color="bg-blue-500"
                  description="Equity and fairness"
                />
                <ScoreCard
                  label="Economic Impact"
                  value={
                    result.economicPressure > 70
                      ? "High"
                      : result.economicPressure > 40
                      ? "Moderate"
                      : "Low"
                  }
                  icon={TrendingUp}
                  color="bg-amber-500"
                  description="Regional economy effect"
                />
              </div>

              <Button
                onClick={() => setShowSimulation(!showSimulation)}
                disabled={loading}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                View Climate Simulation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <AnimatePresence>
                {showSimulation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-6"
                  >
                    {/* Temperature Trajectory Graph */}
                    <div className="dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <BarChart4 className="w-5 h-5 text-indigo-500" />
                        Temperature Trajectory
                      </h3>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 h-80 border border-gray-200 dark:border-gray-700">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={result.temperatureTrajectory.map(
                              (temp, index) => ({
                                year: 2020 + index,
                                temperature: temp,
                              })
                            )}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 10,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
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
                            <Area
                              type="monotone"
                              dataKey="temperature"
                              stroke="#6366f1"
                              fill="#6366f130"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              name="Global Temperature"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* AI Comment */}
                    <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          <span>{result.suggestedPolicyName}</span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          <span>{result.aiComment}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Expert Analysis Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-6">Expert Analysis</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Policy Strengths
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    {result.strength ? (
                      result.strength
                        .split("*")
                        .filter((item) => item.trim())
                        .map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))
                    ) : (
                      <>
                        <li>
                          Focuses on {result.sector.split(",")[0]} sector
                          emissions
                        </li>
                        <li>
                          Utilizes {result.policy_instrument.split(",")[0]} as
                          primary instrument
                        </li>
                        <li>Flexible implementation timeline</li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-medium flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    {result.weakness ? (
                      result.weakness
                        .split("*")
                        .filter((item) => item.trim())
                        .map((item, index) => (
                          <li key={index}>{item.trim()}</li>
                        ))
                    ) : (
                      <>
                        <li>
                          Consider integrating with complementary policies
                        </li>
                        <li>Enhance monitoring and enforcement mechanisms</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <Button
          variant="outline"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium flex items-center gap-2"
          asChild
        >
          <Link to="/search">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </Button>
      </div>
    </div>
  );
}