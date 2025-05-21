import type { Route } from "./+types/home";
import { Support } from "../pages/support/support";
import { Navbar } from "../pages/navbar/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Support" }
  ];
}

export default function Contact() {
  return (
    <main className="">
      <Navbar />
      <Support />
    </main>
  );
}