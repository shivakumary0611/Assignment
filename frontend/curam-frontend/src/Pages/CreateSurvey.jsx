import React, { useState } from 'react';
import axios from 'axios';

export default function CreateSurvey() {
  const [showForm, setShowForm] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [question, setQuestion] = useState([]);

  const answerTypes = ['Single Choice', 'Multiple Choice', 'Text'];

  const handleAddQuestion = () => {
    setQuestion([...question, { text: '', type: 'Text', options: [] }]);
  };

  const handleInputChange = (qIndex, key, value) => {
    const newQuestion = [...question];
    newQuestion[qIndex][key] = value;
    if (key === 'type' && (value === 'Single Choice' || value === 'Multiple Choice')) {
      newQuestion[qIndex].options = [''];
    }
    if (key === 'type' && value === 'Text') {
      newQuestion[qIndex].options = [];
    }
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


  const deleteQuestion =(qIndex)=>{
    const newQuestion=[...question];
    newQuestion.splice(qIndex,1);
    setQuestion(newQuestion);
  }


  const deleteOption=(qIndex,oIndex)=>{
    const newQuestion=[...question];
    newQuestion[qIndex].options.splice(oIndex,1);
    setQuestion(newQuestion);
  }


  const handleSubmitSurvey = async () => {
    const surveyData = {
      title: surveyTitle,
      createdBy,
      question
    };
    try {
      await axios.post('http://localhost:8080/survey/save', surveyData);
      alert('Survey submitted successfully!');
      setShowForm(false);
      setSurveyTitle('');
      setCreatedBy('');
      setQuestion([]);
    } catch (error) {
      console.error(error);
      alert('Failed to submit survey.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>Create Survey</button>
      ) : (
        <div>
          <h2>Create Survey</h2>
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

          <h3>Questions</h3>
          {question.map((q, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <div>
                <label>Question: </label>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => handleInputChange(index, 'text', e.target.value)}
                />
                <button style={{marginLeft:'13px'}} onClick={()=>deleteQuestion(index)}>Delete Question</button>
              </div>
              <div>
                <label>Answer Type: </label>
                <select
                  value={q.type}
                  onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                >
                  {answerTypes.map((type, i) => (
                    <option key={i} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                {q.type === 'Single Choice' || q.type === 'Multiple Choice'
                  ? q.options.map((opt, oIndex) => (
                      <div key={oIndex}>
                        <input type={q.type === 'Single Choice' ? 'radio' : 'checkbox'} disabled />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionInput(index, oIndex, e.target.value)}
                          placeholder="Option text"
                        />
                        <button style={{marginLeft:'13px'}} onClick={()=>deleteOption(index ,oIndex)}>Delete option</button>
                      </div>
                    ))
                  : <input type="text" disabled placeholder="User will type answer here" />}
                {(q.type === 'Single Choice' || q.type === 'Multiple Choice') && (
                  <button onClick={() => addOption(index)}>Add Option</button>
                )}
              </div>
            </div>
          ))}

          <button onClick={handleAddQuestion}>Add Question</button>
          <br /><br />
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
