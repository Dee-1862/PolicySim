import { BarChart3, PieChart, LineChart, TrendingUp, Users, Lock } from "lucide-react";

export function Desc() {
  const features = [
    {
    id: 1,
    icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
    title: "Climate Impact Visualization",
    description: "See immediate visual feedback on how policy changes affect carbon emissions, temperature projections, and other key climate metrics."
    },
    {
    id: 2,
    icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
    title: "Parameter Adjustment",
    description: "Fine-tune policy parameters such as carbon pricing, renewable subsidies, and implementation timelines to optimize outcomes."
    },
    {
      id: 3,
      icon: <PieChart className="h-8 w-8 text-indigo-600" />,
      title: "Sector-Specific Analysis",
      description: "Examine how climate policies affect different economic sectors like energy, transportation, agriculture, and manufacturing."
    },
    {
      id: 4,
      icon: <PieChart className="h-8 w-8 text-indigo-600" />,
      title: "Comparative Analysis",
      description: "Compare multiple policy scenarios side-by-side to identify the most effective approach for your objectives."
    },
    {
      id: 5,
      icon: <LineChart className="h-8 w-8 text-indigo-600" />,
      title: "Longitudinal Tracking",
      description: "Monitor projected policy outcomes over time to understand both short and long-term implications."
    },
    {
    id: 6,
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    title: "Stakeholder Impact Assessment",
    description: "Understand how different communities and stakeholder groups are affected by proposed climate policies."
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-15">
      <div className="relative">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Powerful Capabilities</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Tools that transform policy planning
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Our comprehensive suite of analytical tools helps policymakers make data-driven decisions with confidence.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.id} className="relative">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}