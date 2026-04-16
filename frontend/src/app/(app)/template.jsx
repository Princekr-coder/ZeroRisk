"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }) {
  const pathname = usePathname();
  
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
