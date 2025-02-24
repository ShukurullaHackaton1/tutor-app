import { useEffect, useState } from "react";
import CheckSuccess from "../../public/icons/success-check.png";
import ErrorIcon from "../../public/icons/error-icon.png";

export const Success = ({ msg, state }) => {
  const [inState, setInState] = useState(false);

  useEffect(() => {
    if (state) {
      setInState(true);
      setTimeout(() => {
        setInState(false);
      }, 3000);
    }
  }, [state]);

  return (
    <div
      className={`flex rounded-lg text-[#6FD195] transition-transform duration-500 ${
        inState ? "translate-x-0" : "translate-x-[120%]"
      } absolute top-10 justify-between p-3 py-2 right-3 bg-[#E2F9EB] border-[#6FD195] border-[1px] min-w-[30%]`}
    >
      <div className="flex gap-2">
        <div className="icon">
          <img src={CheckSuccess} alt="" />
        </div>
        <div className="message text-[17px] font-[500]">{msg}</div>
      </div>
      <div className="close">
        <i
          className="bi bi-x-lg cursor-pointer"
          onClick={() => setInState(false)}
        ></i>
      </div>
    </div>
  );
};

export const Error = ({ msg, state }) => {
  const [inState, setInState] = useState(false);

  useEffect(() => {
    if (state) {
      setInState(true);
      setTimeout(() => {
        setInState(false);
      }, 3000);
    }
  }, [state]);

  return (
    <div
      className={`flex rounded-lg text-[#FD3B2C] transition-transform duration-500 ${
        inState ? "translate-x-0" : "translate-x-[120%]"
      } absolute top-10 justify-between p-3 py-2 right-3 bg-[#ECD1CF] border-[#FD3B2C] border-[1px] min-w-[30%]`}
    >
      <div className="flex gap-2">
        <div className="icon">
          <img src={ErrorIcon} alt="" />
        </div>
        <div className="message text-[17px] font-[500]">{msg}</div>
      </div>
      <div className="close">
        <i
          className="bi bi-x-lg cursor-pointer"
          onClick={() => setInState(false)}
        ></i>
      </div>
    </div>
  );
};
