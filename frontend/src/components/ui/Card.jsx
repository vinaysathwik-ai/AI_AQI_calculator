import { motion } from "framer-motion";

function Card({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
      }}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.2,
        },
      }}
      className={`
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        border
        border-slate-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default Card;