import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Survey() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  // Fetch only finalized surveys on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/survey/getAllSurvey")
      .then((res) => {
        const finalSurveys = res.data.filter((s) => s.status === "Final");
        setSurveys(finalSurveys);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch full survey object by ID
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
          // parse JSON once
          let parsed = JSON.parse(fullSurvey.question);
          // handle double-stringified JSON
          if (typeof parsed === "string") parsed = JSON.parse(parsed);
          questionsArray = Array.isArray(parsed) ? parsed : [parsed];
        } else if (Array.isArray(fullSurvey.question)) {
          questionsArray = fullSurvey.question;
        } else if (typeof fullSurvey.question === "object") {
          questionsArray = [fullSurvey.question];
        }
      }

      // Normalize questions
      questionsArray = questionsArray.map((q) => ({
        text: q.text || "",
        type: q.type || "Text",
        options: Array.isArray(q.options) ? q.options : [],
      }));

      setQuestions(questionsArray);

      // Initialize answers
      const initialAnswers = questionsArray.map((q) =>
        q.type === "Multiple Choice" ? [] : ""
      );
      setAnswers(initialAnswers);

      console.log("Parsed Questions:", questionsArray); // for debugging
    } catch (err) {
      console.error("Failed to fetch survey by ID:", err);
      alert("Could not fetch survey details.");
    }
  };

  // Handle answer selection
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

  // Submit answers
  const handleSubmit = async () => {
    if (!selectedSurvey) return;

    const answerData = {
      surveyId: selectedSurvey.surveyId,   // send surveyId
      title: selectedSurvey.title,         // send title
      version: selectedSurvey.version || 1,
      response: {},
    };

    questions.forEach((q, index) => {
      answerData.response[q.text] = answers[index];
      console.log("Question:", q.text, "Answer:", answers[index]); // print to console
    });

    try {
      await axios.post("http://localhost:8080/result/save", answerData);
      alert("Answers submitted successfully!");
      setSelectedSurvey(null);
      setQuestions([]);
      setAnswers([]);
    } catch (err) {
      console.error(err);
      alert("Failed to submit answers.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!selectedSurvey && (
        <div>
          <h2>Available Surveys (Final)</h2>
          {surveys.length === 0 && <p>No finalized surveys found.</p>}
          {surveys.map((s) => (
            <button
              key={s.id}
              style={{ display: "block", margin: "10px 0", padding: "10px" }}
              onClick={() => handleSurveyClick(s)}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {selectedSurvey && (
        <div>
          <h2>Survey: {selectedSurvey.title}</h2>

          {questions.map((q, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Q{index + 1}:</strong> {q.text}
              </p>
              <p>
                <strong>Type:</strong> {q.type}
              </p>
              {q.options.length > 0 && (
                <p>
                  <strong>Options:</strong> {q.options.join(", ")}
                </p>
              )}

              {q.type === "Text" && (
                <input
                  type="text"
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  style={{ width: "100%", padding: "5px" }}
                />
              )}

              {q.type === "Single Choice" &&
                q.options.map((opt, oIndex) => (
                  <div key={oIndex}>
                    <input
                      type="radio"
                      name={`q-${index}`}
                      value={opt}
                      checked={answers[index] === opt}
                      onChange={() => handleAnswerChange(index, opt)}
                    />
                    <label style={{ marginLeft: "8px" }}>{opt}</label>
                  </div>
                ))}

              {q.type === "Multiple Choice" &&
                q.options.map((opt, oIndex) => (
                  <div key={oIndex}>
                    <input
                      type="checkbox"
                      value={opt}
                      checked={answers[index]?.includes(opt) || false}
                      onChange={() => handleAnswerChange(index, opt)}
                    />
                    <label style={{ marginLeft: "8px" }}>{opt}</label>
                  </div>
                ))}
            </div>
          ))}

          <button
            style={{ backgroundColor: "green", color: "white", padding: "10px" }}
            onClick={handleSubmit}
          >
            Submit Answers
          </button>

          <button
            style={{ marginLeft: "10px", padding: "10px" }}
            onClick={() => {
              setSelectedSurvey(null);
              setQuestions([]);
              setAnswers([]);
            }}
          >
            Back to Survey List
          </button>
        </div>
      )}
    </div>
  );
}
