import React from "react";
import { motion } from "framer-motion";

export default function LoadingBar() {
  return (
    <div className="h-1 w-full overflow-hidden bg-gray-200">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
