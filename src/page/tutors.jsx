import React, { useEffect, useState } from "react";
import { changePage } from "../store/slice/ui.slice";
import { useDispatch, useSelector } from "react-redux";
import BoxComponent from "../components/boxComponent";
import { Link } from "react-router-dom";
import TutorService from "../service/tutor.service";
import ShimmerLoading from "../components/loading/loading";
import TrashIcon from "../icons/trash.png";

const Tutors = () => {
  const dispatch = useDispatch();
  const tutors = useSelector((state) => state.tutor);
  const [selectTutor, setSelectTutor] = useState("");
  useEffect(() => {
    dispatch(changePage("Tutorlar"));
    TutorService.getTutors(dispatch);
  }, []);
  return (
    <div>
      <div className="mb-3">
        <Link className="text-primary">Tutorlar</Link>{" "}
        <i className="bi bi-chevron-right"></i>
      </div>
      <BoxComponent>
        <div className="p-4">
          <div className="row">
            <div className="col-6">
              {tutors.isLoading ? (
                <div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                </div>
              ) : (
                <div>
                  {tutors.tutors.map((item) => (
                    <div className="cursor-pointer bg-[#F2F5F9] p-3 rounded-lg">
                      <div
                        onClick={() =>
                          selectTutor == item._id
                            ? setSelectTutor("")
                            : setSelectTutor(item._id)
                        }
                        className="flex  items-center justify-between"
                      >
                        <div className="info flex item-center items-center gap-4">
                          <img
                            src={item.image}
                            className="w-[60px] bg-[#fff] h-[60px] rounded-full"
                            alt="tutorImage"
                          />
                          <div className="">
                            <h1 className="text-xl font-[500]">{item.name}</h1>
                          </div>
                        </div>
                        <i
                          className={`bi text-xl font bi-chevron-right ${
                            selectTutor == item._id ? "rotate-90" : ""
                          }`}
                        ></i>
                      </div>
                      {selectTutor == item._id ? (
                        <>
                          {item.group.map((group) => (
                            <div className="p-3 flex items-center justify-between px-4 text-lg font-[500]">
                              <span>{group.name}</span>
                              <img src={TrashIcon} alt="" />
                            </div>
                          ))}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-6">
              {tutors.isLoading ? (
                <div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                  <div className="mt-3">
                    <ShimmerLoading height="100px" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="cursor-pointer mt-3 bg-[#F2F5F9] p-3 rounded-lg">
                    <div className="p-3 flex items-center justify-between px-4 text-lg font-[500]">
                      <span>4K1 (Matematika)</span>
                    </div>
                  </div>
                  <div className="cursor-pointer mt-3 bg-[#F2F5F9] p-3 rounded-lg">
                    <div className="p-3 flex items-center justify-between px-4 text-lg font-[500]">
                      <span>4K1 (Matematika)</span>
                    </div>
                  </div>
                  <div className="cursor-pointer mt-3 bg-[#F2F5F9] p-3 rounded-lg">
                    <div className="p-3 flex items-center justify-between px-4 text-lg font-[500]">
                      <span>4K1 (Matematika)</span>
                    </div>
                  </div>
                  <div className="cursor-pointer mt-3 bg-[#F2F5F9] p-3 rounded-lg">
                    <div className="p-3 flex items-center justify-between px-4 text-lg font-[500]">
                      <span>4K1 (Matematika)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default Tutors;
