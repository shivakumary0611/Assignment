import React, { useEffect, useState } from "react";
import './Home.css';

export default function Home() {

  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(""); // store error message

  useEffect(() => {
    fetchSurveys("");
  }, []);

  const fetchSurveys = (query) => {
    const url = query
      ? `http://localhost:8080/survey/getBykeyword?keyword=${encodeURIComponent(query)}`
      : "http://localhost:8080/survey/getAllSurvey";

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setSurveys(data);
        setError(""); // clear error on success
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch surveys: " + err.message); // store error
      });
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    fetchSurveys(searchTerm);
  };

  return (
    <div className="table">
      <h1>Survey List</h1>
      <input
        type="text"
        placeholder="Search by Status / title"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <input
        type="button"
        value="Search"
        onClick={handleSearchClick}
      />

      {/* Display error if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="table-fixed" border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Survey ID</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Title</th>
            <th>Modified At</th>
            <th>Version</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.surveyId}</td>
              <td>{s.createdBy}</td>
              <td>{s.createdAt}</td>
              <td>{s.title}</td>
              <td>{s.modifiedAt}</td>
              <td>{s.version}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
