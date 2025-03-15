import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.css";
import BoxComponent from "./boxComponent";
import ShimmerLoading from "./loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { changeFullPage } from "../store/slice/ui.slice";
import OptionComponent from "./option.component";
import axios from "../service/api.js";

const center = [42.46, 59.61]; // Nukus koordinatalari

const MapComponent = () => {
  const { isLoading } = useSelector((state) => state.appartment);
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const [state, setState] = useState(false);
  const [appartmentInfo, setAppartmentModel] = useState({
    isLoading: false,
    info: {},
  });

  const f = new Intl.NumberFormat("es-sp");

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

  useEffect(() => {
    setState(false);
  }, []);

  const selectStudent = async (id) => {
    setAppartmentModel({ isLoading: true });
    setState(true);
    try {
      const { data } = await axios.get(`/appartment/student-info/${id}`);
      console.log(data.data);
      setAppartmentModel({ isLoading: false, info: data.data });
    } catch (error) {
      console.log(error);
      setAppartmentModel({ isLoading: false });
    }
  };

  return (
    <BoxComponent>
      {state ? (
        <OptionComponent state={state}>
          <div className="h-100 px-2 overflow-y-scroll overflow-x-hidden">
            <div className="config">
              <div className="flex gap-3 items-center">
                <div
                  onClick={() => setState(false)}
                  className="w-[40px]  cursor-pointer h-[40px] flex items-center justify-center bg-white rounded-lg"
                >
                  <i className="bi bi-arrow-left text-2xl "></i>
                </div>
                <div className="text-2xl font-[500]">Talaba</div>
              </div>
            </div>
            <div className="student-info mt-3">
              <div className="image flex items-center justify-center">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="200px" height="200px" />
                ) : (
                  <img
                    src={appartmentInfo.info.student?.image}
                    className="w-[250px] h-[250px] rounded-xl"
                    alt=""
                  />
                )}
              </div>
              <div className="my-3 text-center">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="500px" height="40px" />
                ) : (
                  <p className="text-3xl font-[500]">
                    {appartmentInfo.info.student?.second_name}{" "}
                    {appartmentInfo.info.student?.first_name}
                  </p>
                )}
              </div>
            </div>
            <div className="appartment-info">
              <div className="status row">
                <div className="col-4  ">
                  {appartmentInfo.isLoading ? (
                    <ShimmerLoading width="100%" height="100px" />
                  ) : (
                    <div
                      className={`p-4 py-3 border-[1px] ${
                        appartmentInfo.info.appartment?.status == "green"
                          ? "border-[#4776E6]"
                          : "border-[#fff]"
                      } rounded-lg bg-white`}
                    >
                      <div className="text-center text-xl font-[500] ">
                        Yashil toifa
                      </div>
                      <div className="w-100 h-[20px] rounded-md bg-[#24FE41]"></div>
                    </div>
                  )}
                </div>
                <div className="col-4  ">
                  {appartmentInfo.isLoading ? (
                    <ShimmerLoading width="100%" height="100px" />
                  ) : (
                    <div
                      className={`p-4 py-3 border-[1px] ${
                        appartmentInfo.info.appartment.status == "yellow"
                          ? "border-[#4776E6]"
                          : "border-[#fff]"
                      } rounded-lg bg-white`}
                    >
                      <div className="text-center text-xl font-[500] ">
                        Yashil toifa
                      </div>
                      <div className="w-100 h-[20px] rounded-md bg-[#FFC837]"></div>
                    </div>
                  )}
                </div>
                <div className="col-4  ">
                  {appartmentInfo.isLoading ? (
                    <ShimmerLoading width="100%" height="100px" />
                  ) : (
                    <div
                      className={`p-4 py-3 border-[1px] ${
                        appartmentInfo.info.appartment?.status == "red"
                          ? "border-[#4776E6]"
                          : "border-[#fff]"
                      } rounded-lg bg-white`}
                    >
                      <div className="text-center text-xl font-[500] ">
                        Yashil toifa
                      </div>
                      <div className="w-100 h-[20px] rounded-md bg-[#FF512F]"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-3 mt-3 py-2 bg-white rounded-lg">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="100%" height="70px" />
                ) : (
                  <div className="bg-white cursor-pointer px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-[500]">
                      {appartmentInfo.info.student.province.name}
                    </p>
                    <i className="bi bi-chevron-down text-2xl "></i>
                  </div>
                )}
              </div>
              <div className="px-3 mt-3 py-2 bg-white rounded-lg">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="100%" height="70px" />
                ) : (
                  <div className="bg-white cursor-pointer px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-[500]">
                      {appartmentInfo.info.appartment.smallDistrict}
                    </p>
                    <i className="bi bi-chevron-down text-2xl "></i>
                  </div>
                )}
              </div>
              <div className="px-3 mt-3 py-2 bg-white rounded-lg">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="100%" height="70px" />
                ) : (
                  <div className="bg-white cursor-pointer px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-[500]">
                      {appartmentInfo.info.student.level.name}
                    </p>
                    <i className="bi bi-chevron-down text-2xl "></i>
                  </div>
                )}
              </div>
              <div className="px-3 mt-3 py-2 bg-white rounded-lg">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="100%" height="70px" />
                ) : (
                  <div className="bg-white cursor-pointer px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-[500]">Ijara narxi (sum)</p>
                    <div className="text-xl font-[500]">
                      {f.format(appartmentInfo.info.appartment.priceAppartment)}{" "}
                      sum
                    </div>
                  </div>
                )}
              </div>
              <div className="px-3 mt-3 py-2 bg-white rounded-lg">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="100%" height="70px" />
                ) : (
                  <div className="bg-white cursor-pointer px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-[500]">
                      {appartmentInfo.info.appartment.numberOfStudents} ta
                      talaba
                    </p>
                    <div className="text-xl font-[500]">
                      <i className="bi bi-chevron-down text-2xl "></i>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-3 mt-3 py-2 bg-white rounded-lg">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="100%" height="70px" />
                ) : (
                  <div className="bg-white cursor-pointer px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-[500]">
                      {appartmentInfo.info.appartment.typeOfBoiler}
                    </p>
                    <div className="text-xl font-[500]">
                      <i className="bi bi-chevron-down text-2xl "></i>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-3 mt-3 py-2 bg-white rounded-lg">
                {appartmentInfo.isLoading ? (
                  <ShimmerLoading width="100%" height="70px" />
                ) : (
                  <div className="bg-white cursor-pointer px-4 py-3 flex items-center justify-between">
                    <p className="text-xl font-[500]">Ijara shartnomasi</p>
                    <div className="text-xl font-[500]">
                      {appartmentInfo.info.appartment.contract ? "Bor" : "Yo'q"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </OptionComponent>
      ) : (
        ""
      )}

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
      <div className="rounded-lg mt-3 h-100 overflow-hidden">
        {isLoading ? (
          <ShimmerLoading height="70vh" />
        ) : (
          <MapContainer
            center={center}
            zoom={12}
            style={{
              width: "100%",
              height: "100%",
              zIndex: 100,
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {statistics.map.map((marker, index) => (
              <Marker
                key={index}
                position={[marker.coords[0], marker.coords[1]]}
                icon={getCustomIcon(marker)}
                eventHandlers={{
                  click: () => {
                    selectStudent(marker.appartmentId);
                  },
                }}
              ></Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </BoxComponent>
  );
};

export default MapComponent;
