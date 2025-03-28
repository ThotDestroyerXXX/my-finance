"use client";
import dashboardImage from "@/../public/dashboard.png";
import Image from "next/image";
import { motion, useScroll } from "motion/react";
import dashboardMobile from "@/../public/dashboard_mobile.jpg";

export default function ImageTransitionSection() {
  const { scrollYProgress } = useScroll({ offset: ["start 0.5", "0.9 end"] });
  console.log(scrollYProgress);
  return (
    <section className="min-h-[80vh] items-center px-10">
      <motion.div style={{ scale: scrollYProgress, originY: 0 }}>
        <Image
          src={dashboardImage}
          alt=""
          className="border-muted-foreground shadow-accent-foreground rounded-xl border-7 shadow-[0_0_20px_1px_rgba(0,0,0,0)] max-md:hidden"
        />
        <Image
          src={dashboardMobile}
          alt=""
          className="border-muted-foreground shadow-accent-foreground hidden max-h-[100vh] max-w-[60vw] rounded-xl border-7 object-cover object-top shadow-[0_0_20px_1px_rgba(0,0,0,0)] max-md:block"
        />
      </motion.div>
    </section>
  );
}
