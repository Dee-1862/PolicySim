import type { Route } from "./+types/home";
import { Simulator } from "../pages/simulator/simulator";
import { Navbar } from "../pages/navbar/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Simulator" }
  ];
}

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <Simulator />
    </main>
  );
}