import React, { useState } from "react";
import LiveClock from "./liveClock";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AdminImage from "../images/admin.png";
import { useDispatch, useSelector } from "react-redux";
import { courses, provinces, smallStricts } from "../constants";
import FilterIcon from "../icons/filter.png";
import StatisticsService from "../service/statistics.service";

const Header = () => {
  const [province, setProvince] = useState("");
  const [course, setCourse] = useState("");
  const [smallStrict, setSmallStrict] = useState("");
  const [status, setStatus] = useState("");

  const { currentPage } = useSelector((state) => state.ui);
  const { map } = useSelector((state) => state.statistics);
  const dispatch = useDispatch();

  const changeProvince = (e) => {
    setProvince(e.target.value);
  };
  const changeCourse = (e) => {
    setCourse(e.target.value);
  };
  const changeSmallStrict = (e) => {
    setSmallStrict(e.target.value);
  };

  const filterHandler = () => {
    const payload = {
      status: status || null,
      smallDistrict: smallStrict || null,
      province: province || null,
      course: course || null,
    };

    console.log("Yuborilayotgan ma'lumotlar:", payload);

    StatisticsService.filterAppartmentLocation(dispatch, payload);
  };

  return (
    <div className="flex items-center justify-between">
      {/* input */}
      {currentPage == "Xarita" ? (
        <div className="flex items-center gap-2">
          <div
            onClick={() =>
              status == "green" ? setStatus("") : setStatus("green")
            }
            className={`icon rounded-lg  ${
              status == "green" ? "bg-primary" : "bg-white"
            }`}
          >
            <div className="p-2 cursor-pointer ">
              <div
                class="map-location header"
                style={{ backgroundColor: "#24FE41" }}
              >
                👨‍🎓
              </div>
            </div>
          </div>
          <div
            onClick={() =>
              status == "yellow" ? setStatus("") : setStatus("yellow")
            }
            className={`icon rounded-lg  ${
              status == "yellow" ? "bg-primary" : "bg-white"
            }`}
          >
            <div className="p-2  cursor-pointer ">
              <div
                class="map-location header"
                style={{ backgroundColor: "#FFC837" }}
              >
                👨‍🎓
              </div>
            </div>
          </div>
          <div
            onClick={() => (status == "red" ? setStatus("") : setStatus("red"))}
            className={`icon rounded-lg  ${
              status == "red" ? "bg-primary" : "bg-white"
            }`}
          >
            <div className="p-2 cursor-pointer ">
              <div
                class="map-location header"
                style={{ backgroundColor: "#FF512F" }}
              >
                👨‍🎓
              </div>
            </div>
          </div>
          <FormControl
            sx={{ m: 1, minWidth: 200 }}
            style={{ background: "#fff" }}
            size="small"
          >
            <InputLabel id="province">Viloyatlar</InputLabel>
            <Select
              labelId="province"
              id="province-small"
              value={province}
              label="Age"
              onChange={changeProvince}
            >
              <MenuItem value="">
                <em>Viloyatlar</em>
              </MenuItem>
              {provinces.map((item) => (
                <MenuItem value={item.name} key={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{ m: 1, minWidth: 130 }}
            style={{ background: "#fff" }}
            size="small"
          >
            <InputLabel id="course">Kurslar</InputLabel>
            <Select
              labelId="course"
              id="course-small"
              value={course}
              label="Age"
              onChange={changeCourse}
            >
              <MenuItem value="">
                <em>Kurslar</em>
              </MenuItem>
              {courses.map((item) => (
                <MenuItem value={item.name} key={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{ m: 1, minWidth: 160 }}
            style={{ background: "#fff" }}
            size="small"
          >
            <InputLabel id="smallStrict">Kichik tumanlar</InputLabel>
            <Select
              labelId="smallStrict"
              id="smallStrict-small"
              value={smallStrict}
              label="Age"
              onChange={changeSmallStrict}
            >
              <MenuItem value="">
                <em>Kichik tumanlar</em>
              </MenuItem>
              {smallStricts.map((item) => (
                <MenuItem value={item.name} key={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <button
            onClick={() => filterHandler()}
            className="btn btn-primary py-2"
          >
            <img src={FilterIcon} className="w-[20px] h-[20px] " alt="" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Izlash..."
            className="outline-none border-none p-2 min-w-[350px] rounded-lg shadow-sm px-3 text-lg"
          />
          <button className="outline-none border-none p-2 bg-[#255ED6] text-white rounded-lg shadow-sm px-3 text-lg">
            <i className="bi bi-search"></i>
          </button>
        </div>
      )}
      {/* acount */}
      <div className="flex gap-3 items-center">
        <div className="date bg-white p-2 px-3 rounded-md shadow-sm">
          <LiveClock />
        </div>
        <div className="user-image">
          <img
            src={AdminImage}
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
