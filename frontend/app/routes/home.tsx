import type { Route } from "./+types/home";
import { Navbar } from "../pages/navbar/navbar";
import { Hero } from "../pages/home/hero";
import { Desc } from "../pages/home/desc";
import {Support} from "../pages/support/support";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Homepage" },
    { name: "Homepage", content: "Welcome to PolicySim!" },
  ];
}

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <Hero />
      <Desc />
      <Support />
    </main>
  );
}