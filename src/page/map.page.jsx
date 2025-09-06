import React, { useEffect } from "react";
import MapComponent from "../components/map";
import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../store/slice/ui.slice";
import { Link } from "react-router-dom";
import StatisticsService from "../service/statistics.service";

const MapPage = () => {
  const dispatch = useDispatch();
  const { fullStatisticPage } = useSelector((state) => state.ui);
  useEffect(() => {
    dispatch(changePage("Xarita"));
    StatisticsService.getAppartmentsLocation(dispatch);
  }, []);

  return (
    <>
      {fullStatisticPage ? (
        ""
      ) : (
        <>
          <Link className="text-primary">Xarita</Link>
          <i className="bi bi-chevron-right"></i>
        </>
      )}{" "}
      <div className="py-2"></div>
      <MapComponent />
    </>
  );
};

export default MapPage;
