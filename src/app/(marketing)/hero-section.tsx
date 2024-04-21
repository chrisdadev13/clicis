"use client";
import { motion } from "framer-motion";

export default function HeroSection() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };
  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <motion.h1
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="text-left text-4xl font-[1000] tracking-tight text-foreground drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)] sm:text-[4rem] md:text-center lg:text-6xl"
      >
        Effortless Check-Ins,
      </motion.h1>

      <motion.h1
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="max-w-2xl text-left font-cal text-4xl font-bold text-[#969696] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)] sm:text-[4rem] md:text-center lg:text-6xl"
      >
        Meaningful Connections for Everyone.
      </motion.h1>
    </motion.div>
  );
}
