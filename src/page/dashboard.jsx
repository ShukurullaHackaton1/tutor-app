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
import TutorService from "../service/tutor.service";

const Dashboard = () => {
  const dispatch = useDispatch();
  const statistics = useSelector((state) => state.statistics);
  const { fullStatisticPage } = useSelector((state) => state.ui);
  const tutors = useSelector((state) => state.tutor);

  useEffect(() => {
    dispatch(changePage("Bosh sahifa"));
    AppartmentService.getAppartment(dispatch);
    StatisticsService.getGenderStatistics(dispatch);
    StatisticsService.getAppartmentsLocation(dispatch);
    TutorService.getTutors(dispatch);
  }, []);

  return (
    <div className="">
      <div className="mb-3">
        <Link className="text-primary">Bosh sahifa</Link>{" "}
        <i className="bi bi-chevron-right"></i>
      </div>
      <div className="row">
        <div className="col-lg-7 col-md-7 h-[80vh] col-sm-12">
          <MapComponent />
        </div>
        <div className="col-lg-5 col-md-5 col-sm-12">
          <div className="h-[40vh] ">
            <BoxComponent>
              <div className="title text-[20px] font-[500] mb-2">
                Statistika
              </div>
              {statistics.isLoading ? (
                <ShimmerLoading height="300px" />
              ) : (
                <PieActiveArc
                  height={fullStatisticPage ? 300 : 200}
                  data={statistics.studentsByGender}
                />
              )}
            </BoxComponent>
          </div>
          <div className="h-[40vh] mt-3 overflow-y-scroll">
            <BoxComponent>
              <div className="title text-[20px] font-[500] mb-2">Tutorlar</div>
              {tutors.isLoading ? (
                <ShimmerLoading height="300px" />
              ) : (
                <div>
                  {tutors.tutors.map((item) => (
                    <div className="flex cursor-pointer bg-[#F2F5F9] p-3 rounded-lg items-center justify-between">
                      <div className="info flex item-center items-center gap-4">
                        <div className="w-[60px] h-[70px]">
                          <img
                            src={item.image}
                            className="w-[60px]  h-[60px] rounded-full"
                            alt="tutorImage"
                          />
                        </div>
                        <div className="w-">
                          <h1 className="text-xl font-[500]">{item.name}</h1>
                          <p className="text-[#B4B6BA] text-md">
                            {item.group.map((group) => (
                              <span>{group.name} </span>
                            ))}
                          </p>
                        </div>
                      </div>
                      <i className="bi text-xl font bi-chevron-right"></i>
                    </div>
                  ))}
                </div>
              )}
            </BoxComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
