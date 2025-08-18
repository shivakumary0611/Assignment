import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function CreateSurvey() {
  const [showForm, setShowForm] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [question, setQuestion] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { id } = useParams();
  const answerTypes = ['Single Choice', 'Multiple Choice', 'Text'];

  // Fetch survey by ID if editing
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/survey/getSurveyById/${id}`)
        .then(res => res.json())
        .then(data => setSurvey(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  // Populate form when survey data is fetched
  useEffect(() => {
    if (survey) {
      setSurveyTitle(survey.title || '');
      setCreatedBy(survey.createdBy || '');

      let questionsArray = [];

      try {
        if (!survey.question) {
          questionsArray = [];
        } else if (typeof survey.question === 'string') {
          let parsed = JSON.parse(survey.question);
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          questionsArray = Array.isArray(parsed) ? parsed : [parsed];
        } else if (Array.isArray(survey.question)) {
          questionsArray = survey.question;
        } else if (typeof survey.question === 'object') {
          questionsArray = [survey.question];
        }
      } catch (err) {
        console.error('Failed to parse questions:', err);
        questionsArray = [];
      }

      if (questionsArray.length === 0) {
        questionsArray.push({ text: '', type: 'Text', options: [] });
      }

      setQuestion(questionsArray);
      setShowForm(true);
    }
  }, [survey]);

  const handleAddQuestion = () => {
    setQuestion([...question, { text: '', type: 'Text', options: [] }]);
  };

  const handleInputChange = (qIndex, key, value) => {
    const newQuestion = [...question];
    newQuestion[qIndex][key] = value;
    if (key === 'type') newQuestion[qIndex].options = value === 'Text' ? [] : [''];
    setQuestion(newQuestion);
  };

  const handleOptionInput = (qIndex, oIndex, value) => {
    const newQuestion = [...question];
    newQuestion[qIndex].options[oIndex] = value;
    setQuestion(newQuestion);
  };

  const addOption = (qIndex) => {
    const newQuestion = [...question];
    newQuestion[qIndex].options.push('');
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

  const handleSubmitSurvey = async () => {
    setErrorMsg(''); // reset error
    const surveyData = {
      id: survey?.id,
      surveyId: survey?.surveyId,
      title: surveyTitle,
      createdBy,
      question: JSON.stringify(question),
      status: survey?.status || 'Draft',
      version: survey?.version || 1,
      createdAt: survey?.createdAt || new Date().toISOString(),
    };

    try {
      if (id) {
        await axios.put('http://localhost:8080/survey/update', surveyData);
      } else {
        await axios.post('http://localhost:8080/survey/save', surveyData);
      }

      alert('Survey submitted successfully!');
      setShowForm(false);
      setSurveyTitle('');
      setCreatedBy('');
      setQuestion([]);
      setSurvey(null);
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 409) {
        const msg =
          (error.response.data && error.response.data.error) ||
          error.response.data ||
          'Survey with this title already exists';
        setErrorMsg(msg);
      } else {
        setErrorMsg('Failed to submit survey.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {!showForm && !id && (
        <button onClick={() => setShowForm(true)}>Create Survey</button>
      )}

      {showForm && (
        <div>
          <h2>{id ? 'Edit Survey' : 'Create Survey'}</h2>

          <div>
            <label>Survey Title: </label>
            <input
              type="text"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Created By: </label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              {typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}
            </p>
          )}

          <h3>Questions</h3>
          {Array.isArray(question) &&
            question.map((q, index) => (
              <div
                key={index}
                style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}
              >
                <div>
                  <label>Question: </label>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                  />
                  <button style={{ marginLeft: '13px' }} onClick={() => deleteQuestion(index)}>
                    Delete Question
                  </button>
                </div>

                <div>
                  <label>Answer Type: </label>
                  <select
                    value={q.type}
                    onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                  >
                    {answerTypes.map((type, i) => (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  {(q.type === 'Single Choice' || q.type === 'Multiple Choice') &&
                    Array.isArray(q.options) &&
                    q.options.map((opt, oIndex) => (
                      <div key={oIndex}>
                        <input type={q.type === 'Single Choice' ? 'radio' : 'checkbox'} disabled />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionInput(index, oIndex, e.target.value)}
                          placeholder="Option text"
                        />
                        <button style={{ marginLeft: '13px' }} onClick={() => deleteOption(index, oIndex)}>
                          Delete option
                        </button>
                      </div>
                    ))}

                  {(q.type === 'Single Choice' || q.type === 'Multiple Choice') && (
                    <button onClick={() => addOption(index)}>Add Option</button>
                  )}

                  {q.type === 'Text' && (
                    <input type="text" disabled placeholder="User will type answer here" />
                  )}
                </div>
              </div>
            ))}

          <button onClick={handleAddQuestion}>Add Question</button>
          <br />
          <br />
          <button
            onClick={handleSubmitSurvey}
            style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}
          >
            Submit Survey
          </button>
        </div>
      )}
    </div>
  );
}
