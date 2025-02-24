import React from "react";
import "./loading.css";

const ShimmerLoading = ({ width = "100%", height = "100px" }) => {
  return <div className="shimmer-loading" style={{ width, height }}></div>;
};

export default ShimmerLoading;
