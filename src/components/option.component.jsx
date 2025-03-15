import React from "react";

const OptionComponent = ({ state = false, children }) => {
  return (
    <div
      className={`absolute col-5 transition-[1.4s] p-4 top-0 right-0 h-[100vh] z-[999] bg-[#FAFAFA] ${
        state ? "translate-x-0" : "translate-x-[100%]"
      }`}
    >
      {children}
    </div>
  );
};

export default OptionComponent;
