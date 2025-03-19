import React, { useState, useEffect } from "react";

const formatTime = () => {
  const now = new Date();

  const kunlar = [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];
  const oylari = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  const yil = now.getFullYear();
  const oy = oylari[now.getMonth()];
  const kun = now.getDate();
  const haftaKuni = kunlar[now.getDay()];

  const soat = String(now.getHours()).padStart(2, "0");
  const daqiqa = String(now.getMinutes()).padStart(2, "0");

  return {
    yil,
    oy,
    kun,
    haftaKuni,
    soat,
    daqiqa,
  };
};

const LiveClock = () => {
  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime());
    }, 60000); // Har daqiqada yangilanadi

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-lg font-semibold">
      <span>
        {formatTime().soat}:{formatTime().daqiqa}
      </span>{" "}
      <span className="text-[#007AFF]">{formatTime().yil}</span>,{" "}
      <span>{formatTime().haftaKuni}</span> <span>{formatTime().kun}</span>{" "}
      <span className="text-[#007AFF]">{formatTime().oy}</span>
    </span>
  );
};

export default LiveClock;
