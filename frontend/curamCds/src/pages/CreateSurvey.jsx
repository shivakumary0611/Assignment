import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  TextInput,
  Select,
  SelectItem,
  InlineNotification,
} from "@carbon/react";

export default function CreateSurvey() {
  const [showForm, setShowForm] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [question, setQuestion] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState("Draft");

  const { id } = useParams();
  const answerTypes = ["Single Choice", "Multiple Choice", "Text"];

  
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/survey/getSurveyById/${id}`)
        .then((res) => res.json())
        .then((data) => setSurvey(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  
  useEffect(() => {
    if (survey) {
      setSurveyTitle(survey.title || "");
      setCreatedBy(survey.createdBy || "");
      setStatus(survey.status || "Draft");

      let questionsArray = [];

      try {
        if (!survey.question) {
          questionsArray = [];
        } else if (typeof survey.question === "string") {
          let parsed = JSON.parse(survey.question);
          if (typeof parsed === "string") parsed = JSON.parse(parsed);
          questionsArray = Array.isArray(parsed) ? parsed : [parsed];
        } else if (Array.isArray(survey.question)) {
          questionsArray = survey.question;
        } else if (typeof survey.question === "object") {
          questionsArray = [survey.question];
        }
      } catch (err) {
        console.error("Failed to parse questions:", err);
        questionsArray = [];
      }

      if (questionsArray.length === 0) {
        questionsArray.push({ text: "", type: "Text", options: [] });
      }

      setQuestion(questionsArray);
      setShowForm(true);
    }
  }, [survey]);

  const handleAddQuestion = () => {
    setQuestion([...question, { text: "", type: "Text", options: [] }]);
  };

  const handleInputChange = (qIndex, key, value) => {
    const newQuestion = [...question];
    newQuestion[qIndex][key] = value;
    if (key === "type") newQuestion[qIndex].options = value === "Text" ? [] : [""];
    setQuestion(newQuestion);
  };

  const handleOptionInput = (qIndex, oIndex, value) => {
    const newQuestion = [...question];
    newQuestion[qIndex].options[oIndex] = value;
    setQuestion(newQuestion);
  };

  const addOption = (qIndex) => {
    const newQuestion = [...question];
    newQuestion[qIndex].options.push("");
    setQuestion(newQuestion);
  };

  const deleteQuestion = (qIndex) => {
    const newQuestion = [...question];
    newQuestion.splice(qIndex, 1);
    setQuestion(newQuestion);
  };

  const deleteOption = (qIndex, oIndex) => {
    const newQuestion = [...question];
    newQuestion[qIndex].options.splice(oIndex, 1);
    setQuestion(newQuestion);
  };

  
  const handleSubmitSurvey = async (submitStatus) => {
    setErrorMsg("");
    const surveyData = {
      id: survey?.id,
      surveyId: survey?.surveyId,
      title: surveyTitle,
      createdBy,
      question: JSON.stringify(question),
      status: submitStatus || status,
      version: survey?.version || 1,
      createdAt: survey?.createdAt || new Date().toISOString(),
    };

    try {
      if (id) {
        await axios.put("http://localhost:8080/survey/update", surveyData);
      } else {
        await axios.post("http://localhost:8080/survey/save", surveyData);
      }

      alert(`Survey ${submitStatus === "Final" ? "finalized" : "saved"} successfully!`);
      setShowForm(false);
      setSurveyTitle("");
      setCreatedBy("");
      setQuestion([]);
      setSurvey(null);
      setStatus("Draft");
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 409) {
        const msg =
          (error.response.data && error.response.data.error) ||
          error.response.data ||
          "Survey with this title already exists";
        setErrorMsg(msg);
      } else {
        setErrorMsg("Failed to submit survey.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!showForm && !id && (
        <Button onClick={() => setShowForm(true)}>Create Survey</Button>
      )}

      {showForm && (
        <div>
          <h2>{id ? "Edit Survey" : "Create Survey"}</h2>

          <div style={{ marginBottom: "1rem" }}>
            <TextInput
              id="survey-title"
              labelText="Survey Title"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="Enter survey title"
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <TextInput
              id="created-by"
              labelText="Created By"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Enter creator name"
            />
          </div>

          {errorMsg && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}
              lowContrast
            />
          )}

          <h3>Questions</h3>
          {Array.isArray(question) &&
            question.map((q, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "15px",
                  margin: "15px 0",
                  borderRadius: "8px",
                }}
              >
                <TextInput
                  id={`question-${index}`}
                  labelText={`Question ${index + 1}`}
                  value={q.text}
                  onChange={(e) => handleInputChange(index, "text", e.target.value)}
                  placeholder="Enter your question"
                />

                <Select
                  id={`answer-type-${index}`}
                  labelText="Answer Type"
                  value={q.type}
                  onChange={(e) => handleInputChange(index, "type", e.target.value)}
                >
                  {answerTypes.map((type, i) => (
                    <SelectItem key={i} text={type} value={type} />
                  ))}
                </Select>

                <div style={{ marginTop: "1rem" }}>
                  {(q.type === "Single Choice" || q.type === "Multiple Choice") &&
                    Array.isArray(q.options) &&
                    q.options.map((opt, oIndex) => (
                      <div key={oIndex} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                        <TextInput
                          id={`option-${index}-${oIndex}`}
                          labelText={`Option ${oIndex + 1}`}
                          value={opt}
                          onChange={(e) =>
                            handleOptionInput(index, oIndex, e.target.value)
                          }
                          placeholder="Enter option"
                        />
                        <Button
                          kind="danger--tertiary"
                          size="sm"
                          onClick={() => deleteOption(index, oIndex)}
                        >
                          Delete Option
                        </Button>
                      </div>
                    ))}

                  {(q.type === "Single Choice" || q.type === "Multiple Choice") && (
                    <Button kind="secondary" size="sm" onClick={() => addOption(index)}>
                      Add Option
                    </Button>
                  )}

                  {q.type === "Text" && (
                    <TextInput
                      id={`answer-placeholder-${index}`}
                      labelText="Answer"
                      placeholder="User will type answer here"
                      disabled
                    />
                  )}
                </div>

                <Button
                  kind="danger"
                  size="sm"
                  style={{ marginTop: "10px" }}
                  onClick={() => deleteQuestion(index)}
                >
                  Delete Question
                </Button>
              </div>
            ))}

          <Button kind="secondary" onClick={handleAddQuestion}>
            Add Question
          </Button>

          <div style={{ marginTop: "2rem" }}>
            <Button
              kind="primary"
              onClick={() => handleSubmitSurvey("Draft")}
              style={{ marginRight: "10px" }}
            >
              Save as Draft
            </Button>

            <Button kind="tertiary" onClick={() => handleSubmitSurvey("Final")}>
              Finalize Survey
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
