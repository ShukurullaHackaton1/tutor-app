import React from "react";
import LiveClock from "./liveClock";

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      {/* input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="w-[380px] outline-none px-[20px] py-[10px] rounded-full shadow-md"
          placeholder="Izlash.."
        />
        <button className="bg-[#255ED6] w-[40px] h-[40px] rounded-full text-white">
          <i className="bi bi-search"></i>
        </button>
      </div>
      {/* acount */}
      <div className="flex gap-3 items-center">
        <div className="date bg-white p-2 px-3 rounded-md shadow-md">
          <LiveClock />
        </div>
        <div className="user-image">
          <img
            src="https://s3-alpha-sig.figma.com/img/1af2/0862/20affecd5f498aeca93f64918a91bf86?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=VE2WoOzqcO2TYGVQmMp1c9I3t3Hozf~hLgJRF-WIYKfJcMKeKO7uw3dEgp7525bUcKX1ZH9wmg2F1pPOZZ1AYl5y26Zy8Sg26nTVO~BPRZYFquzBY4qUQ23ceE-Y1Ih0xzb0kiUAtxAcNUjMM87Ui4Ih89Ku2EyWRrst2wCBgLxyvQNZzCaVF6mX4ATYHmev4qZhOW4zrnT0ZdM~Y8TlQjUkCJTnbLQb8NsX4kIkXiKPbaOJodd83rOXlHZOHiXJxiG2lHeuSgJ7X0Yh3LyXISg-oGsarYeE-gPPGCyYy3evDstzaF4ebiS~a895-TWeYXtfAOz-whAP1zxFohp2kw__"
            alt=""
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
