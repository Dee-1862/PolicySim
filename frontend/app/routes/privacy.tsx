import type { Route } from "./+types/home";
import { PrivacyPolicy } from "../pages/support/privacyPolicy";
import { Navbar } from "../pages/navbar/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy" }
  ];
}

export default function Contact() {
  return (
    <main className="">
      <Navbar />
      <PrivacyPolicy />
    </main>
  );
}