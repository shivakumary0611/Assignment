import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  TextInput,
  Modal,
  Search,
} from "@carbon/react";

export default function Home() {
  const [survey, setSurvey] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurvey("");
  }, []);

  const fetchSurvey = (query) => {
    const url = query
      ? `http://localhost:8080/survey/getBykeyword?keyword=${encodeURIComponent(
          query
        )}`
      : "http://localhost:8080/survey/getAllSurvey";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Http Error Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSurvey(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch surveys: " + err.message);
      });
  };

  const headers = [
    { key: "id", header: "ID" },
    { key: "surveyId", header: "Survey ID" },
    { key: "title", header: "Survey Title" },
    { key: "createdBy", header: "Created By" },
    { key: "createdAt", header: "Created At" },
    { key: "modifiedAt", header: "Modified At" },
    { key: "version", header: "Version" },
    { key: "status", header: "Status" },
  ];

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    fetchSurvey(searchTerm);
  };

  const handleSurveyClick = (s) => {
    if (s.status == "Draft") {
      navigate(`/createSurvey/${s.id}`);
    } else if (s.status === "Final") {
      setSelectedSurvey(s);
      setIsModalOpen(true);
    } else {
      alert("Only Draft surveys can be edited");
    }
  };

  const handleDeleteResponse = (id) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      fetch(`http://localhost:8080/survey/deleteById/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete");
          setSurvey(survey.filter((s) => s.id !== id));
        })
        .catch((err) => alert(err.message));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSurvey(null);
  };

  return (
    <>
      <div style={{ marginLeft: "601px", marginTop: "10px" }}>
        <h1 style={{ marginLeft: "44px" }}>Survey List</h1>

        <TextInput
          className="input-test-class"
          style={{ width: "300px" }}
          id="text-input-1"
          invalid={!!error}
          invalidText={error}
          onChange={handleInputChange}
          placeholder="Enter the status / title"
          size="md"
          type="text"
          value={searchTerm}
        />

        <br />

        <Button
          kind="primary"
          size="lg"
          onClick={handleSearchClick}
          style={{ marginLeft: "50px" }}
        >
          Search Survey
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <DataTable rows={survey} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    const { key, ...rest } = getHeaderProps({ header });
                    return (
                      <TableHeader key={key} {...rest}>
                        {header.header}
                      </TableHeader>
                    );
                  })}
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    {...getRowProps({ row })}
                    key={row.id}
                    onClick={() => {
                      const originalSurvey = survey.find(
                        (s) => String(s.id) === String(row.id)
                      );
                      handleSurveyClick(originalSurvey);
                    }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                    <TableCell>
                      <Button
                        kind="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent opening modal
                          handleDeleteResponse(row.id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </div>

      <Modal
        open={isModalOpen}
        modalHeading="Survey Questions"
        size="sm"
        primaryButtonText="Close"
        onRequestClose={handleCloseModal}
        onRequestSubmit={handleCloseModal}
      >
        {(() => {
          let questionArr = [];
          try {
            questionArr =
              typeof selectedSurvey?.question === "string"
                ? JSON.parse(selectedSurvey.question)
                : selectedSurvey?.question || [];
          } catch {
            questionArr = [];
          }

          return questionArr.length === 0 ? (
            <p>No questions available</p>
          ) : (
            questionArr.map((q, idx) => (
              <div key={idx} style={{ marginBottom: "15px" }}>
                <strong>
                  {idx + 1}. {q.text}
                </strong>
                <div>Type: {q.type}</div>
                {q.options?.length > 0 && (
                  <ul>
                    {q.options.map((opt, i) => (
                      <li key={i}> {opt}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          );
        })()}
      </Modal>
    </>
  );
}
