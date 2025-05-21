import type { Route } from "./+types/home";
import { Navbar } from "../pages/navbar/navbar";
import { PolicyPage } from "../pages/policy/policyPage"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Policies" },
  ];
}

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <PolicyPage />
    </main>
  );
}