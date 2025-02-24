import React, { useEffect } from "react";
import MapComponent from "../components/map";
import { useDispatch, useSelector } from "react-redux";
import AppartmentService from "../service/appartment.service";
import ShimmerLoading from "../components/loading/loading";
import { Link } from "react-router-dom";
import BoxComponent from "../components/boxComponent";
import PieActiveArc from "../components/chart";
import StatisticsService from "../service/statistics.service";
import { changePage } from "../store/slice/ui.slice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const statistics = useSelector((state) => state.statistics);
  const appartment = useSelector((state) => state.appartment);
  useEffect(() => {
    dispatch(changePage("Bosh sahifa"));
    AppartmentService.getAppartment(dispatch);
    StatisticsService.getGenderStatistics(dispatch);
    StatisticsService.getAppartmentsLocation(dispatch);
    StatisticsService.getLevelStudents(dispatch);
  }, []);

  return (
    <div className="">
      <div className="mb-3">
        <Link className="text-primary">Bosh sahifa</Link>{" "}
        <i className="bi bi-chevron-right"></i>
      </div>
      <div className="row">
        <div className="col-lg-7 col-md-7 col-sm-12">
          <MapComponent />
        </div>
        <div className="col-lg-5 col-md-5 col-sm-12">
          <div className="">
            <BoxComponent>
              <div className="title text-[20px] font-[500] mb-2">
                Statistika
              </div>
              {statistics.isLoading ? (
                <ShimmerLoading height="300px" />
              ) : (
                <PieActiveArc height={200} data={statistics.studentsByGender} />
              )}
            </BoxComponent>
          </div>
          <div className=" mt-3">
            <BoxComponent>
              <div className="title text-[20px] font-[500] mb-2">
                Statistika
              </div>
              {statistics.isLoading ? (
                <ShimmerLoading height="300px" />
              ) : (
                <PieActiveArc height={200} data={statistics.studentsLevel} />
              )}
            </BoxComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
