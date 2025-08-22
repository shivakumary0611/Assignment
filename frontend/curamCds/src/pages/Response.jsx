import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TextInput,
  Modal,
  InlineNotification,
} from "@carbon/react";

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

  const renderResponse = (response) => {
    let parsed = null;
    try {
      parsed = typeof response === "string" ? JSON.parse(response) : response;
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
              A: {Array.isArray(answer) ? answer.join(", ") : String(answer)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const headers = [
    { key: "id", header: "ID" },
    { key: "surveyId", header: "Survey ID" },
    { key: "version", header: "Version" },
    { key: "title", header: "Title" },
    { key: "actions", header: "Actions" },
  ];

  const rows = surveys.map((s) => ({
    id: String(s.id),
    surveyId: s.surveyId,
    version: s.version,
    title: s.title,
    actions: (
      <>
        <Button
          kind="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleShowResponse(s.response);
          }}
        >
          Show
        </Button>
        <Button
          kind="danger--tertiary"
          size="sm"
          style={{ marginLeft: "0.5rem" }}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteResponse(s.id);
          }}
        >
          Delete
        </Button>
      </>
    ),
  }));

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Survey List</h1>

      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onClose={() => setError("")}
        />
      )}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <TextInput
          id="search-input"
          labelText=""
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button kind="primary" onClick={handleSearchClick}>
          Search
        </Button>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <TableContainer title="Survey Responses">
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={headers.length}>
                      No surveys found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Modal
        open={!!selectedResponse}
        modalHeading="Survey Response"
        primaryButtonText="Close"
        onRequestClose={handleCloseResponse}
        onRequestSubmit={handleCloseResponse}
      >
        {renderResponse(selectedResponse)}
      </Modal>
    </div>
  );
}
