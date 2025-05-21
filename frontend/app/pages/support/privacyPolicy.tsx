"use client";

import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="isolate bg-white dark:bg-gray-900 px-6 py-16 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Last updated: May 20, 2025
          </p>
        </div>

        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Information We Collect
            </h2>
            <p className="mb-2">
              We collect information you provide when you fill out forms, create
              an account, or contact us. This may include your name, email,
              phone number, and company details.
            </p>
            <p>
              We also automatically collect certain information about your
              device and how you interact with our website through cookies and
              similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How We Use Your Information
            </h2>
            <p>
              We use your information to provide our services, process
              transactions, send important notices, improve our website, and
              respond to your inquiries. We may also use your information to
              send you marketing communications about products and services that
              may interest you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Information Sharing
            </h2>
            <p>
              We may share your information with service providers who help us
              operate our business, when required by law, or in connection with
              a business transaction like a merger. We do not sell your personal
              information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Your Rights
            </h2>
            <p>
              Depending on your location, you may have the right to access,
              correct, or delete your personal information. You can also opt out
              of marketing communications at any time. To exercise these rights,
              please contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Data Security
            </h2>
            <p>
              We implement security measures to protect your information, but no
              method of transmission over the Internet is 100% secure. We
              encourage you to use strong passwords and to keep your login
              information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date.
            </p>
          </section>

          <section className="pt-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this privacy policy, please
              contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4">
              <p>Email: privacy@yourcompany.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </section>
          <div className="mb-6 flex justify-center">
            <Button
              variant="outline"
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium flex items-center gap-2"
              asChild
            >
              <Link to="/search">
                <ArrowLeft className="w-4 h-4" /> Back to Search
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
