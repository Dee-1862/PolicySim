"use client";

import React, { useState } from 'react';
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Field, Label, Switch } from "@headlessui/react";

export function Support() {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay.

    console.log("Form submitted successfully!");
    window.alert("Message sent successfully!"); // Keeping the alert as requested.

    event.currentTarget.reset();
    setAgreed(false);
  };

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

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white sm:text-5xl">
          Connect With Our Team
        </h2>
        <p className="mt-2 text-lg/8 text-gray-500 dark:text-gray-400 sm:text-xl">
          Facing any technical issue? We are ready to transform your challenges
          into opportunities.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-300"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-gray-200 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-300"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-gray-200 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-300"
            >
              Company
            </label>
            <div className="mt-2.5">
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                className="block w-full rounded-md bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-gray-200 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-300"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-gray-200 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-300"
            >
              Phone number
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white dark:bg-gray-800 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    aria-label="Country"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 dark:text-gray-300 dark:bg-gray-800 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option>US</option>
                    <option>CA</option>
                    <option>EU</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 dark:text-gray-400 sm:size-4"
                  />
                </div>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  placeholder="123-456-7890"
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-gray-200 dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-gray-300"
            >
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full rounded-md bg-white dark:bg-gray-800 px-3.5 py-2 text-base text-gray-900 dark:text-gray-200 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                defaultValue={""}
              />
            </div>
          </div>
          <Field className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className={`relative inline-flex h-5 w-10 cursor-pointer rounded-full shadow transition-colors duration-200 ease-in-out focus:outline-none focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2 ${
                  agreed ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-150 ease-in-out ${
                    agreed ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </Switch>
            </div>
            <Label className="text-sm/6 text-gray-600 dark:text-gray-400">
              By selecting this, you agree to our{" "}
              <a
                href="privacy"
                className="font-semibold text-indigo-600 dark:text-indigo-400"
              >
                privacy&nbsp;policy
              </a>
              .
            </Label>
          </Field>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Let's talk
          </button>
        </div>
      </form>
    </div>
  );
}
