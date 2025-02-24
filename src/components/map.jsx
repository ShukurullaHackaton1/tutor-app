import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.css";
import BoxComponent from "./boxComponent";
import ShimmerLoading from "./loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { changeFullPage } from "../store/slice/ui.slice";

const center = [42.46, 59.61]; // Nukus koordinatalari

const MapComponent = () => {
  const appartment = useSelector((state) => state.appartment);
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const getCustomIcon = (marker) => {
    return L.divIcon({
      className: "custom-icon",
      html: `<div class="map-location" style="background-color: ${marker.color};">
      ${marker.icon}
    </div>`,
      iconSize: [30, 30],
    });
  };
  const dispatch = useDispatch();
  const changeSizePage = () => {
    dispatch(changeFullPage(!fullStatisticPage));
  };

  return (
    <BoxComponent>
      <div className="flex items-center justify-between">
        <div className="title text-[20px] font-[500] mb-2">Xarita</div>
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
      <div className="rounded-lg mt-3 overflow-hidden">
        {appartment.isLoading ? (
          <ShimmerLoading height="500px" />
        ) : (
          <MapContainer
            center={center}
            zoom={12}
            style={{
              width: "100%",
              height: fullStatisticPage ? "700px" : "500px",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {statistics.map.map((marker, index) => (
              <Marker
                key={index}
                position={[marker.coords[0], marker.coords[1]]} // lat, long tartibini tekshirish
                icon={getCustomIcon(marker)}
              >
                <Popup>Marker: {marker.icon}</Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </BoxComponent>
  );
};

export default MapComponent;
