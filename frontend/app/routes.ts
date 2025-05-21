import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("simulator", "routes/simulator.tsx"),
    route("support", "routes/support.tsx"),
    route("search", "routes/search.tsx"),
    route("policy/:policyId", "routes/policies.tsx"),
    route("privacy", "routes/privacy.tsx")
] satisfies RouteConfig;
