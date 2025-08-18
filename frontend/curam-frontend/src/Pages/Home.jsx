import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

export default function Home() {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys("");
  }, []);

  const fetchSurveys = (query) => {
    const url = query
      ? `http://localhost:8080/survey/getBykeyword?keyword=${encodeURIComponent(query)}`
      : "http://localhost:8080/survey/getAllSurvey";

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setSurveys(data);
        setError("");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch surveys: " + err.message);
      });
  };

  const handleSurveyClick = (survey) => {
    if (survey.status === "Draft") {
      navigate(`/createSurvey/${survey.id}`);
    } else if (survey.status === "Final") {
      setSelectedSurvey(survey);
    } else {
      alert("Only draft surveys can be edited");
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    fetchSurveys(searchTerm);
  };

  const handleDeleteResponse = (id) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      fetch(`http://localhost:8080/survey/deleteById/${id}`, {
        method: "DELETE",
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to delete");
          setSurveys(surveys.filter(s => s.id !== id));
        })
        .catch(err => alert(err.message));
    }
  };

  const handleCloseQuestion = () => {
    setSelectedSurvey(null);
  };

  return (
    <div className="table">
      <h1>Survey List</h1>

      <input
        type="text"
        placeholder="Search by Status / Title"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <input
        type="button"
        value="Search"
        onClick={handleSearchClick}
      />

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((s) => (
            <tr
              key={s.id}
              onClick={() => handleSurveyClick(s)}
              className={s.status === "Draft" ? "draft-row" : ""}
              style={{ cursor: s.status === "Draft" || s.status === "Final" ? "pointer" : "default" }}
            >
              <td>{s.id}</td>
              <td>{s.surveyId}</td>
              <td>{s.createdBy}</td>
              <td>{s.createdAt}</td>
              <td>{s.title}</td>
              <td>{s.modifiedAt}</td>
              <td>{s.version}</td>
              <td>{s.status}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResponse(s.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup for survey questions */}
      {selectedSurvey && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
          >
            <h3>Survey Questions</h3>
            {(() => {
              let questionArr = [];
              try {
                questionArr = typeof selectedSurvey.question === "string"
                  ? JSON.parse(selectedSurvey.question)
                  : (selectedSurvey.question || []);
              } catch (err) {
                console.error("Failed to parse question:", err);
                questionArr = [];
              }

              return questionArr.length === 0 ? (
                <p>No questions available</p>
              ) : (
                questionArr.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "15px" }}>
                    <strong>{idx + 1}. {q.text}</strong>
                    <div>Type: {q.type}</div>
                    {q.options && q.options.length > 0 && (
                      <ul>
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              );
            })()}
            <button onClick={handleCloseQuestion} style={{ marginTop: "10px" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
