import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../components/map.css";
import { useLeafletIconFix } from "../hooks/useLeafletIconFix";

// Custom marker komponenti
const CustomMarker = ({ position, data, onClick }) => {
  const customIcon = L.divIcon({
    className: "custom-icon",
    html: `
      <div class="map-location" style="background-color: ${
        data.color
      }; color: white; font-weight: bold; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
        ${data.icon || "📍"}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });

  return (
    <Marker
      position={position}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          console.log("🎯 Marker clicked:", data);
          if (onClick) {
            onClick(data);
          }
        },
      }}
    >
      <Popup>
        <div className="p-2">
          <h4 className="font-semibold">Talaba ma'lumotlari</h4>
          <p>Status: {data.status}</p>
          <p>ID: {data.appartmentId}</p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent = ({ onStudentSelect }) => {
  const { map: mapData } = useSelector((state) => state.statistics);
  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef();

  // Leaflet icon fix
  useLeafletIconFix();

  console.log("🗺️ MapComponent rendered with data:", mapData);

  // Nukus koordinatalari (default center)
  const defaultCenter = [42.4555, 59.6109];
  const defaultZoom = 12;

  // Marker click handler
  const handleMarkerClick = async (markerData) => {
    console.log("🎯 handleMarkerClick called with:", markerData);

    if (!markerData.appartmentId || markerData.appartmentId === "test-marker") {
      console.warn("⚠️ No valid apartment ID");
      return;
    }

    try {
      // API dan toliq ma'lumot olish
      console.log(
        "📡 Fetching student data for apartment:",
        markerData.appartmentId
      );

      const response = await fetch(
        `https://tutorapp.kerek.uz/statistics/appartment/${markerData.appartmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-jwt")}`,
          },
        }
      );

      console.log("📡 API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ API Success - Full data:", data);

        if (data.status === "success" && data.data) {
          console.log("🎯 Calling onStudentSelect with:", data.data);
          onStudentSelect(data.data);
        } else {
          console.error("❌ API returned error:", data);
          // Fallback ma'lumot
          onStudentSelect({
            student: {
              image:
                "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png",
              first_name: "Test",
              second_name: "Student",
              level: { name: "Unknown" },
              province: { name: "Unknown" },
            },
            appartment: {
              status: markerData.status,
              smallDistrict: "Unknown",
              priceAppartment: 0,
              numberOfStudents: 0,
              typeOfBoiler: "Unknown",
              contract: false,
            },
          });
        }
      } else {
        console.error("❌ API Error:", response.status, response.statusText);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error fetching student data:", error);

      // Fallback ma'lumot
      const fallbackData = {
        student: {
          image:
            "https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small/simple-user-default-icon-free-png.png",
          first_name: "Unknown",
          second_name: "Student",
          level: { name: "Unknown" },
          province: { name: "Unknown" },
        },
        appartment: {
          status: markerData.status || "unknown",
          smallDistrict: "Unknown District",
          priceAppartment: 0,
          numberOfStudents: 0,
          typeOfBoiler: "Unknown",
          contract: false,
        },
      };

      console.log("🎯 Using fallback data:", fallbackData);
      onStudentSelect(fallbackData);
    }
  };

  useEffect(() => {
    console.log("🔄 MapComponent useEffect - mapData changed:", mapData);
  }, [mapData]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        className="leaflet-container"
        ref={mapRef}
        whenCreated={setMapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markerlarni render qilish */}
        {mapData && mapData.length > 0 ? (
          mapData.map((marker, index) => (
            <CustomMarker
              key={`${marker.appartmentId}-${index}`}
              position={marker.coords}
              data={marker}
              onClick={handleMarkerClick}
            />
          ))
        ) : (
          // Default marker agar ma'lumot bo'lmasa
          <CustomMarker
            position={defaultCenter}
            data={{
              color: "#42A5F5",
              icon: "🏠",
              appartmentId: "default",
              status: "default",
            }}
            onClick={() => console.log("Default marker clicked")}
          />
        )}
      </MapContainer>

      {/* Debug info */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow text-xs z-10">
        <div>Markers: {mapData ? mapData.length : 0}</div>
        <div>Center: [{defaultCenter.join(", ")}]</div>
      </div>
    </div>
  );
};

export default MapComponent;
