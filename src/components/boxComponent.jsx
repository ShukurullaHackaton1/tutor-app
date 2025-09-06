import React from "react";
import { Card } from "antd";
import { motion } from "framer-motion";

const ModernBoxComponent = ({
  children,
  className = "",
  title,
  extra,
  loading = false,
  bordered = false,
  hoverable = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card
        title={title}
        extra={extra}
        loading={loading}
        bordered={bordered}
        className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
          hoverable ? "hover:shadow-xl" : ""
        }`}
        bodyStyle={{
          padding: "24px",
          height: "100%",
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default ModernBoxComponent;
