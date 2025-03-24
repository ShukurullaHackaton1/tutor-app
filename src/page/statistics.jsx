import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"; // Swiper navigatsiya uchun CSS

import GenderStatistics from "./gender.statistics";
import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../store/slice/ui.slice";
import LevelStatistics from "./level.statistics";
import BoilerTypestatistics from "./boilerTypes.statistics";
import StatisticsService from "../service/statistics.service";
import SmallDistricts from "./smallDistricts";
import RegionStatistics from "./region";
import { CustomChart } from "../components/chart";
import FacultyStatistics from "./faculty.statistics";
import { faculties } from "../constants";

const Statistics = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const { fullStatisticPage } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(changePage("Statistika"));
    StatisticsService.getGenderStatistics(dispatch);
    StatisticsService.getLevelStudents(dispatch);
    StatisticsService.getBoilerTypes(dispatch);
    StatisticsService.getSmallDistricts(dispatch);
    StatisticsService.regionStudents(dispatch);
    StatisticsService.facultyData(dispatch, faculties);
  }, []);

  return (
    <div className=" h-[80vh]">
      <div className="mb-3">
        {fullStatisticPage ? (
          ""
        ) : (
          <>
            <Link className="text-primary">Statistika</Link>
            <i className="bi bi-chevron-right"></i>
          </>
        )}{" "}
        <div className="py-2"></div>
        {/* Swiper navigatsiya tugmalari */}
        <button
          className="absolute top-[50%] left-[30px] z-10 bg-[transparent] text-[25px] w-[50px] h-[50px] rounded-full "
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <button
          className="absolute top-[50%] right-[50px] z-10 bg-[transparent] text-[25px] w-[50px] h-[50px] rounded-full "
          onClick={() => swiperRef.current?.slideNext()}
        >
          <i className="bi bi-arrow-right"></i>
        </button>
        {/* Swiper slayderi */}
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation]}
        >
          <SwiperSlide>
            <GenderStatistics />
          </SwiperSlide>
          <SwiperSlide>
            <LevelStatistics />
          </SwiperSlide>
          <SwiperSlide>
            <BoilerTypestatistics />
          </SwiperSlide>
          <SwiperSlide>
            <SmallDistricts />
          </SwiperSlide>
          <SwiperSlide>
            <RegionStatistics />
          </SwiperSlide>
          <SwiperSlide>
            <FacultyStatistics />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Statistics;
