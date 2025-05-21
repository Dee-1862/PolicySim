import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }

  interface Future {
    unstable_middleware: false
  }
}

type Params = {
  "/": {};
  "/simulator": {};
  "/support": {};
  "/search": {};
  "/policy/:policyId": {
    "policyId": string;
  };
  "/privacy": {};
};