import axios from "../service/api";
import React, { useEffect, useState } from "react";

const FilterPage = () => {
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [students, setStudents] = useState([]);

  const getFaculties = async () => {
    setFacultyLoading(true);
    const { data } = await axios.get("/faculties");
    setFaculties(data.data);
    setFacultyLoading(false);
  };
  useEffect(() => {
    getFaculties();
  }, []);
  const [faculty, setFaculty] = useState(faculties[0]);
  const [gender, setGender] = useState("Ayol");
  const [year, setYear] = useState("2000");

  const getStudents = async () => {
    setStudentsLoading(true);
    getFaculties();
    const { data } = await axios.post("/students-filter", {
      faculty: faculty == undefined ? faculties[0] : faculty,
      gender,
      year,
    });

    setStudents(data.data);
    setStudentsLoading(false);
  };

  return (
    <div className="w-100 h-[100vh] overflow-y-scroll">
      <div className="w-[80%] mx-auto py-4">
        {facultyLoading ? (
          <p>loading</p>
        ) : (
          <div className="flex gap-4">
            <select
              className="form-control"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              name=""
              id=""
            >
              {faculties.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="form-control "
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              name=""
              id=""
            >
              <option value="Ayol">Ayol</option>
              <option value="Erkak">Erkak</option>
            </select>
            <select
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              name=""
              id=""
            >
              <option value="2000">2000 yil</option>
              <option value="2001">2001 yil</option>
              <option value="2002">2002 yil</option>
              <option value="2003">2003 yil</option>
              <option value="2004">2004 yil</option>
              <option value="2005">2005 yil</option>
              <option value="2006">2006 yil</option>
            </select>
            <button
              onClick={() => getStudents()}
              className="btn btn-primary"
              disabled={studentsLoading}
            >
              Yuborish
            </button>
          </div>
        )}

        {studentsLoading ? <p>loading...</p> : ""}
        {students.length > 0 ? (
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>FullName</th>
                  <th>birth date</th>
                  <th>image</th>
                </tr>
              </thead>
              <tbody>
                {students.map((item, id) => (
                  <tr>
                    <td>{id + 1}</td>
                    <td>{item.full_name}</td>
                    <td>{item.birth_date}</td>
                    <td>
                      <img
                        src={item.image}
                        className="w-[100px] h-[100px]"
                        alt=""
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default FilterPage;
