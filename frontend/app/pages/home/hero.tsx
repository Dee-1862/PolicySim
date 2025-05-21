import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="bg-white dark:bg-gray-900 pb-30">


      {/* Hero Section */}
      <section className="relative sm:py-16 lg:pt-20 xl:pb-0">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-1/2 aspect-square w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-pink-400 to-purple-500 opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center">
          <p className="inline-flex px-4 py-2 text-base text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-full">
            Experience the future of policy analysis
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-7xl">
            Visualize Impact Before Implementation
          </h2>

          <p className="mx-auto mt-6 text-base leading-7 text-gray-500 dark:text-gray-400 sm:text-xl max-w-2xl">
            Turn complex policy data into clear, actionable insights with our interactive simulation.
          </p>

          <div className="mt-10">
            <Link
              to="/simulator"
              className="block w-full sm:w-auto sm:inline-block rounded-md bg-indigo-600 px-8 py-3.5 text-center text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Access 5,000+ Simulated Policy Outcomes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
