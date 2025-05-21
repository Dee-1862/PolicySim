import type { Route } from "./+types/home";
import { Navbar } from "../pages/navbar/navbar";
import { PolicyLists } from "../pages/policy/policyLists"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Search" }
  ];
}

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <PolicyLists />
    </main>
  );
}