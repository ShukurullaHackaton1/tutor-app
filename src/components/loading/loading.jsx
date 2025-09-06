import React from "react";
import { Spin, Card, Skeleton } from "antd";
import { motion } from "framer-motion";

const ModernShimmerLoading = ({
  width = "100%",
  height = "100px",
  rows = 3,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${className}`}
      style={{ width, height }}
    >
      <Card className="border-0 shadow-lg" bodyStyle={{ padding: "20px" }}>
        <Skeleton active paragraph={{ rows }} className="shimmer-skeleton" />
      </Card>
    </motion.div>
  );
};

export const ModernSpinLoader = ({
  size = "large",
  tip = "Yuklanmoqda...",
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-12"
    >
      <Spin size={size} tip={tip} className="text-blue-500">
        {children}
      </Spin>
    </motion.div>
  );
};

export const ModernCardLoader = ({ count = 3, className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ModernShimmerLoading;
