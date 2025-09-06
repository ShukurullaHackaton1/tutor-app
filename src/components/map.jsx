import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.css";
import BoxComponent from "./boxComponent";
import ShimmerLoading from "./loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { changeFullPage } from "../store/slice/ui.slice";
import axios from "../service/api.js";

// CRITICAL: Leaflet icon muammosini hal qilish
const iconRetinaUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

// Leaflet default iconni to'g'irlash
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const center = [42.46, 59.61]; // Nukus koordinatalari

const MapComponent = ({ onStudentSelect }) => {
  const { isLoading } = useSelector((state) => state.appartment);
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // Default Leaflet iconni yaratish
  const createCustomIcon = () => {
    return L.icon({
      iconUrl: iconUrl,
      iconRetinaUrl: iconRetinaUrl,
      shadowUrl: shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    });
  };

  // Rangli circle icon yaratish
  const createColoredIcon = (color, status) => {
    const size = 30;
    let emoji = "";

    switch (status) {
      case "green":
        emoji = "👨‍🎓";
        break;
      case "yellow":
        emoji = "👨‍🎓";
        break;
      case "red":
        emoji = "👨‍🎓";
        break;
      default:
        emoji = "👨‍🎓";
    }

    return L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          position: relative;
        ">
          ${emoji}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  // Student ma'lumotlarini olish
  const getStudentInfo = async (appartmentId) => {
    try {
      const { data } = await axios.get(
        `/appartment/student-info/${appartmentId}`
      );
      return data.data;
    } catch (error) {
      console.error("Student ma'lumotlarini olishda xatolik:", error);
      return null;
    }
  };

  // Debug: Ma'lumotlarni console'da ko'rsatish
  useEffect(() => {
    console.log("🗺️ Map Component - Statistics:", statistics);
    console.log("🗺️ Map data:", statistics.map);
    if (statistics.map && statistics.map.length > 0) {
      console.log("🗺️ First marker:", statistics.map[0]);
      console.log("🗺️ Will render", statistics.map.length, "markers");
    }
  }, [statistics.map]);

  return (
    <BoxComponent>
      <div className="flex items-center justify-between mb-4">
        <div className="title text-[20px] font-[500]">
          Xarita{" "}
          {statistics.map
            ? `(${statistics.map.length} ta marker)`
            : "(ma'lumot yo'q)"}
        </div>
        <button className="btn bg-[#255ED6]" onClick={() => changeSizePage()}>
          <i
            className={`bi text-[20px] text-[#fff] ${
              fullStatisticPage
                ? "bi-arrows-angle-contract"
                : "bi-arrows-angle-expand"
            }`}
          ></i>
        </button>
      </div>

      {/* CRITICAL: Map container uchun aniq o'lchamlar */}
      <div
        className="rounded-lg overflow-hidden bg-gray-200 border-2 border-blue-300"
        style={{
          height: "450px",
          width: "100%",
          minHeight: "450px",
          position: "relative",
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <ShimmerLoading height="600px" width="100%" />
          </div>
        ) : (
          <div style={{ height: "100%", width: "100%" }}>
            {/* Debug ma'lumotlari */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "rgba(255,255,255,0.9)",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 1000,
                fontSize: "12px",
              }}
            >
              <div>🗺️ Map Status:</div>
              <div>• Loading: {isLoading ? "Yes" : "No"}</div>
              <div>
                • Data: {statistics.map ? statistics.map.length : 0} markers
              </div>
              <div>
                • Center: [{center[0]}, {center[1]}]
              </div>
            </div>

            <MapContainer
              center={center}
              zoom={12}
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#f0f0f0",
              }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Test marker - har doim ko'rinishi kerak */}
              <Marker position={[42.46, 59.61]} icon={createCustomIcon()}>
                <Popup>
                  <div>
                    <strong>🏛️ Test Marker</strong>
                    <br />
                    Nukus shahri markazi
                    <br />
                    Lat: 42.46, Lng: 59.61
                    <br />
                    <small>Agar bu ko'rinsa, Leaflet ishlayapti!</small>
                  </div>
                </Popup>
              </Marker>

              {/* Haqiqiy markerlar */}
              {statistics.map &&
                statistics.map.length > 0 &&
                statistics.map.map((marker, index) => {
                  console.log(
                    `🔄 Rendering marker ${index + 1}/${
                      statistics.map.length
                    }:`,
                    marker
                  );

                  // Koordinatalar mavjudligini tekshirish
                  if (
                    !marker.coords ||
                    !Array.isArray(marker.coords) ||
                    marker.coords.length !== 2 ||
                    isNaN(marker.coords[0]) ||
                    isNaN(marker.coords[1])
                  ) {
                    console.warn(
                      `❌ Invalid coordinates for marker ${index}:`,
                      marker
                    );
                    return null;
                  }

                  return (
                    <Marker
                      key={`marker-${index}-${marker.appartmentId}`}
                      position={[marker.coords[0], marker.coords[1]]}
                      icon={createColoredIcon(marker.color, marker.status)}
                    >
                      <Popup>
                        <div style={{ padding: "10px", minWidth: "200px" }}>
                          {/* Qisqacha ma'lumot */}
                          <div className="mb-3">
                            <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                              <strong>Status:</strong>
                              <span
                                style={{
                                  color: marker.color,
                                  marginLeft: "5px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {marker.status === "green"
                                  ? "Yaxshi"
                                  : marker.status === "yellow"
                                  ? "O'rtacha"
                                  : marker.status === "red"
                                  ? "Yomon"
                                  : "Tekshirilmoqda"}
                              </span>
                            </p>
                            <p style={{ margin: "5px 0" }}>
                              <strong>Koordinatlar:</strong>
                              <br />
                              Lat: {marker.coords[0]}
                              <br />
                              Lng: {marker.coords[1]}
                            </p>
                          </div>

                          {/* Batafsil ma'lumot tugmasi */}
                          <button
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              backgroundColor: marker.color,
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                            onClick={async () => {
                              console.log("🖱️ Marker clicked:", marker);
                              if (marker.appartmentId && onStudentSelect) {
                                const studentInfo = await getStudentInfo(
                                  marker.appartmentId
                                );
                                if (studentInfo) {
                                  onStudentSelect(studentInfo);
                                }
                              }
                            }}
                          >
                            Batafsil ma'lumot
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
            </MapContainer>
          </div>
        )}
      </div>
    </BoxComponent>
  );
};

export default MapComponent;
