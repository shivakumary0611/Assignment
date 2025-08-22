import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextInput,
  Checkbox,
  RadioButton,
  RadioButtonGroup,
  Tile,
  InlineNotification,
} from "@carbon/react";

export default function Survey() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");

  
  useEffect(() => {
    axios
      .get("http://localhost:8080/survey/getAllSurvey")
      .then((res) => {
        const finalSurveys = res.data.filter(
          (s) => s.status === "Final" || s.status === "Draft"
        );
        setSurveys(finalSurveys);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch surveys.");
      });
  }, []);

  
  const handleSurveyClick = async (survey) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/survey/getSurveyById/${survey.id}`
      );
      const fullSurvey = res.data;
      setSelectedSurvey(fullSurvey);

      let questionsArray = [];

      if (fullSurvey.question) {
        if (typeof fullSurvey.question === "string") {
          let parsed = JSON.parse(fullSurvey.question);
          if (typeof parsed === "string") parsed = JSON.parse(parsed);
          questionsArray = Array.isArray(parsed) ? parsed : [parsed];
        } else if (Array.isArray(fullSurvey.question)) {
          questionsArray = fullSurvey.question;
        } else if (typeof fullSurvey.question === "object") {
          questionsArray = [fullSurvey.question];
        }
      }

      questionsArray = questionsArray.map((q) => ({
        text: q.text || "",
        type: q.type || "Text",
        options: Array.isArray(q.options) ? q.options : [],
      }));

      setQuestions(questionsArray);

      const initialAnswers = questionsArray.map((q) =>
        q.type === "Multiple Choice" ? [] : ""
      );
      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Failed to fetch survey by ID:", err);
      setError("Could not fetch survey details.");
    }
  };

  
  const handleAnswerChange = (qIndex, value) => {
    const newAnswers = [...answers];
    const qType = questions[qIndex].type;

    if (qType === "Multiple Choice") {
      const selectedOptions = newAnswers[qIndex];
      if (selectedOptions.includes(value)) {
        newAnswers[qIndex] = selectedOptions.filter((v) => v !== value);
      } else {
        newAnswers[qIndex] = [...selectedOptions, value];
      }
    } else {
      newAnswers[qIndex] = value;
    }

    setAnswers(newAnswers);
  };


  const handleSubmit = async () => {
    if (!selectedSurvey) return;

    const answerData = {
      surveyId: selectedSurvey.surveyId, 
      title: selectedSurvey.title,
      version: selectedSurvey.version || 1,
      response: {},
    };

    questions.forEach((q, index) => {
      answerData.response[q.text] = answers[index];
    });

    try {
      await axios.post("http://localhost:8080/result/save", answerData);
      alert("Answers submitted successfully!");
      setSelectedSurvey(null);
      setQuestions([]);
      setAnswers([]);
    } catch (err) {
      console.error(err);
      setError("Failed to submit answers.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onClose={() => setError("")}
        />
      )}

      {!selectedSurvey && (
        <div>
          <h2>Available Surveys</h2>
          {surveys.length === 0 && <p>No surveys found.</p>}
          {surveys.map((s) => (
            <Tile
              key={s.id}
              style={{ margin: "10px 0", cursor: "pointer" }}
              onClick={() => handleSurveyClick(s)}
            >
              {s.title}
            </Tile>
          ))}
        </div>
      )}

      {selectedSurvey && (
        <div>
          <h2>Survey: {selectedSurvey.title}</h2>

          {questions.map((q, index) => (
            <Tile key={index} style={{ marginBottom: "15px" }}>
              <p>
                <strong>Q{index + 1}:</strong> {q.text}
              </p>

              {q.type === "Text" && (
                <TextInput
                  id={`q-${index}`}
                  labelText="Answer"
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              )}

              {q.type === "Single Choice" && (
                <RadioButtonGroup
                  legendText="Select one option"
                  name={`q-${index}`}
                  valueSelected={answers[index]}
                  onChange={(val) => handleAnswerChange(index, val)}
                >
                  {q.options.map((opt, oIndex) => (
                    <RadioButton
                      key={oIndex}
                      value={opt}
                      id={`q-${index}-opt-${oIndex}`}
                      labelText={opt}
                    />
                  ))}
                </RadioButtonGroup>
              )}

              {q.type === "Multiple Choice" &&
                q.options.map((opt, oIndex) => (
                  <Checkbox
                    key={oIndex}
                    id={`q-${index}-opt-${oIndex}`}
                    labelText={opt}
                    checked={answers[index]?.includes(opt) || false}
                    onChange={() => handleAnswerChange(index, opt)}
                  />
                ))}
            </Tile>
          ))}

          <Button kind="primary" onClick={handleSubmit}>
            Submit Answers
          </Button>
          <Button
            kind="secondary"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              setSelectedSurvey(null);
              setQuestions([]);
              setAnswers([]);
            }}
          >
            Back to Survey List
          </Button>
        </div>
      )}
    </div>
  );
}
