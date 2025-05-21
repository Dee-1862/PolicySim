import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle, X, Filter } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Define Policy interface for type safety
export interface Policy {
  policy_name: string;
  policy_description: string;
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
  policy_id: string;
  country_iso: string;
}

// PolicyBadge component: Displays a styled badge for policy status
const PolicyBadge = ({ type }: { type: string }) => {
  const badgeVariants: Record<string, { bg: string, text: string }> = {
    "In force": { bg: "bg-green-600/90 text-white", text: "In force" },
    "Superseded": { bg: "bg-orange-400/90 text-white", text: "Superseded" },
    "Planned": { bg: "bg-blue-600/90 text-white", text: "Planned" },
    "Ended": { bg: "bg-red-600/90 text-white", text: "Ended" }
  };

  const { bg, text } = badgeVariants[type] || {
    bg: "bg-gray-50/90 text-black",
    text: type || "Unknown"
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

export function PolicyLists() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [displayedPolicies, setDisplayedPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const policiesPerPage = 15;
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    country_iso: 'all',
    policy_status: 'all',
    sector: 'all',
    policy_instrument: 'all'
  });

  // Lists for filter options
  const [filterOptions, setFilterOptions] = useState({
    countries: new Map<string, string>(), // Map of country_iso -> country name
    statuses: new Set<string>(),
    sectors: new Set<string>(),
    instruments: new Set<string>()
  });

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);

        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.country_iso && filters.country_iso !== 'all') queryParams.append('country_iso', filters.country_iso);
        if (filters.policy_status && filters.policy_status !== 'all') queryParams.append('policy_status', filters.policy_status);
        if (filters.sector && filters.sector !== 'all') queryParams.append('sector', filters.sector);
        if (filters.policy_instrument && filters.policy_instrument !== 'all') queryParams.append('policy_instrument', filters.policy_instrument);

        const queryString = queryParams.toString();
        const endpoint = `http://localhost:5000/api/policies${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          setError(`Failed to fetch policies: ${response.status}`);
          setLoading(false);
          return;
        }

        const data: Policy[] = await response.json();
        setPolicies(data);

        // Initially display the first batch of policies
        setDisplayedPolicies(data.slice(0, policiesPerPage));

        // Extract unique values for filters
        const countries = new Map<string, string>();
        const statuses = new Set<string>();
        const sectors = new Set<string>();
        const instruments = new Set<string>();

        data.forEach(policy => {
          if (policy.country_iso && policy.country) {
            countries.set(policy.country_iso, policy.country);
          }
          if (policy.policy_status) statuses.add(policy.policy_status);
          if (policy.sector) sectors.add(policy.sector);
          if (policy.policy_instrument) instruments.add(policy.policy_instrument);
        });

        setFilterOptions({
          countries,
          statuses,
          sectors,
          instruments
        });

        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching policies.");
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [filters]);

  const loadMorePolicies = () => {
    setLoadingMore(true);
    const startIndex = page * policiesPerPage;
    const endIndex = startIndex + policiesPerPage;
    const nextBatch = policies.slice(startIndex, endIndex);
    setDisplayedPolicies(prev => [...prev, ...nextBatch]);
    setPage(prev => prev + 1);
    setLoadingMore(false);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      country_iso: 'all',
      policy_status: 'all',
      sector: 'all',
      policy_instrument: 'all'
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => value !== '' && value !== 'all').length;

  // Loading state skeleton
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state alert
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasMorePolicies = displayedPolicies.length < policies.length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Climate Policies</h1>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-1 bg-indigo-600">{activeFilterCount}</Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filter Policies</h2>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" /> Clear filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select
                value={filters.country_iso}
                onValueChange={(value) => handleFilterChange('country_iso', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {/* Sort countries alphabetically by name */}
                  {Array.from(filterOptions.countries.entries())
                    .sort((a, b) => a[1].localeCompare(b[1]))
                    .map(([iso, country]) => (
                      <SelectItem key={iso} value={iso}>{country} ({iso})</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.policy_status}
                onValueChange={(value) => handleFilterChange('policy_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {Array.from(filterOptions.statuses).sort().map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Select
                value={filters.sector}
                onValueChange={(value) => handleFilterChange('sector', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sectors</SelectItem>
                  {Array.from(filterOptions.sectors).sort().map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Policy Instrument</label>
              <Select
                value={filters.policy_instrument}
                onValueChange={(value) => handleFilterChange('policy_instrument', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All instruments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All instruments</SelectItem>
                  {Array.from(filterOptions.instruments).sort().map(instrument => (
                    <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-gray-600">Showing {displayedPolicies.length} of {policies.length} policies</p>
        {activeFilterCount > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value && value !== 'all') {
                let displayValue = value;

                // If this is a country_iso filter, show the country name instead
                if (key === 'country_iso' && filterOptions.countries.has(value)) {
                  displayValue = `${filterOptions.countries.get(value)} (${value})`;
                }

                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {key.replace(/_/g, ' ')}: {displayValue}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleFilterChange(key, 'all')}
                    />
                  </Badge>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {policies.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No policies found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters to find what you're looking for.</p>
          <Button onClick={clearFilters} variant="outline">Clear all filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPolicies.map((policy) => (
            <Card
              key={policy.policy_id}
              className="transition-transform transform hover:scale-105 shadow-md hover:shadow-lg border-gray-200"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                  <Link to={`/policy/${policy.policy_id}`}>{policy.policy_name}</Link>
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {policy.country} | {policy.decision_date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className='px-3 rounded-full text-sm font-semibold' variant="outline">
                    {policy.country_iso}
                  </Badge>
                  {policy.policy_status && <PolicyBadge type={policy.policy_status} />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasMorePolicies && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={loadMorePolicies}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}