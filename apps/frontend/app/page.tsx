"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgAbstract from "../public/abc.jpg";
import logo from "../public/gitdiagram-logo.svg";

export default function HomePage() {
  const [repo, setRepo] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repo.trim()) return;
    router.push(`/diagram?repo=${encodeURIComponent(repo)}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* ✅ Animated Background */}
      <motion.div
        className="fixed inset-0 -z-10 h-screen w-screen"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      >
        <Image
          src={bgAbstract}
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
      </motion.div>

      {/* ✅ Logo + Black Stylish Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center mb-4"
      >
        <Image
          src={logo}
          alt="GitDiagram Logo"
          width={90}
          height={90}
          className="drop-shadow-lg"
        />

        {/* 🖤 Stylish “GitDiagram” heading (black version) */}
        <h1
          className="mt-3 text-6xl md:text-7xl font-extrabold text-black tracking-tight drop-shadow-md"
        >
          Git-Diagram
        </h1>
      </motion.div>

      {/* 🖤 Black Subheading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-4xl font-bold text-black drop-shadow-sm text-center mb-8"
      >
        Visualize Your Repositories
      </motion.h2>

      {/* ✅ Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative group flex items-center justify-between max-w-sm w-[520px] mx-auto
                   h-[44px] rounded-full px-4
                   bg-white/10 backdrop-blur-md border border-white/20
                   shadow-md transition-all duration-500 ease-in-out
                   hover:scale-105 hover:shadow-lg hover:shadow-orange-400/30"
      >
        <input
          type="search"
          id="search-input"
          name="q"
          placeholder="Search repo: Owner/repo..."
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          className="flex-grow bg-transparent border-none text-white text-base px-2 outline-none placeholder:text-white/70"
        />

        <button
          type="submit"
          className="rounded-full bg-orange-400/70 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center w-9 h-9 ml-2 shadow-sm hover:shadow-md"
          aria-label="Search"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="black"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </motion.form>

      {/* ✅ Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-white/70 text-xs mt-4"
      >
        Visualize your GitHub repo like never before ⚡
      </motion.p>
    </div>
  );
}
