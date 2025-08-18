import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Response() {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = (query = "") => {
    let url = "http://localhost:8080/result/allResult";
    if (query && query.trim() !== "") {
      url = `http://localhost:8080/result/getByKeyword?keyword=${query}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const surveysData = Array.isArray(data) ? data : [data];
        setSurveys(surveysData);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch surveys: " + err.message);
      });
  };

  const handleInputChange = (e) => setSearchTerm(e.target.value);

  const handleSearchClick = () => fetchSurveys(searchTerm);

  const handleShowResponse = (response) => {
    setSelectedResponse(response);
  };

  const handleCloseResponse = () => {
    setSelectedResponse(null);
  };

  const handleDeleteResponse = (id) => {
    if (window.confirm("Are you sure you want to delete this response?")) {
      fetch(`http://localhost:8080/result/deleteById/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete");
          setSurveys(surveys.filter((s) => s.id !== id));
        })
        .catch((err) => alert(err.message));
    }
  };

  // Function to render parsed response nicely
  const renderResponse = (response) => {
    let parsed = null;
    try {
      parsed =
        typeof response === "string" ? JSON.parse(response) : response;
    } catch (err) {
      console.error("❌ Failed to parse response:", err);
      return <p style={{ color: "red" }}>Invalid response format</p>;
    }

    if (!parsed || Object.keys(parsed).length === 0) {
      return <p>No responses available</p>;
    }

    return (
      <div>
        {Object.entries(parsed).map(([question, answer], idx) => (
          <div key={`resp-${idx}`} style={{ marginBottom: "10px" }}>
            <strong>Q: {question}</strong>
            <p>
              A:{" "}
              {Array.isArray(answer) ? answer.join(", ") : String(answer)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="table">
      <h1>Survey List</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <input type="button" value="Search" onClick={handleSearchClick} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
      <table className="table-fixed" border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Survey ID</th>
            <th>Version</th>
            <th>Title</th>
            <th>Response</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {surveys.length > 0 ? (
            surveys.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.surveyId}</td>
                <td>{s.version}</td>
                <td>{s.title}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowResponse(s.response);
                    }}
                  >
                    Show Response
                  </button>
                </td>
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
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No surveys found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup for response */}
      {selectedResponse && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "90%",
            }}
          >
            <h3>Survey Response</h3>
            {renderResponse(selectedResponse)}

            <button onClick={handleCloseResponse} style={{ marginTop: "10px" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
