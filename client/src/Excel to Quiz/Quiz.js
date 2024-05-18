import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import "./style.css";
const Quiz = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');

    if (!quizId) {
      alert('Quiz ID not found in URL!');
      return;
    }

    const quizData = localStorage.getItem(quizId);

    if (!quizData) {
      alert('Quiz not found!');
      return;
    }

    // Read the workbook and set questions
    const workbook = XLSX.read(quizData, { type: 'binary' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const questions = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    questions.splice(0, 1); // Remove header row

    const quizQuestionsData = questions.map((row) => ({
      question: row[0],
      optionA: row[1],
      optionB: row[2],
      optionC: row[3],
      optionD: row[4],
      correctAnswer: row[5],
    }));

    setQuizQuestions(quizQuestionsData);
  }, []); // Run once on component mount

  const handleSubmit = () => {
    let tempScore = 0;

    quizQuestions.forEach((question, index) => {
      const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
      if (selectedOption && selectedOption.value.toUpperCase() === question.correctAnswer.toUpperCase()) {
        tempScore++;
      }
    });

    setScore({
      totalQuestions: quizQuestions.length,
      correctAnswers: tempScore,
      percentage: (tempScore / quizQuestions.length) * 100,
    });
  };

  const renderQuiz = () => {
    return (
      <div>
      {quizQuestions.map((question, index) => (
        <div key={index} className="question card mb-3">
          <div className="card-body quiz-width">
            <h5 className="card-title">Question {index + 1}:</h5>
            <p className="card-text">{question.question}</p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <label className="form-check-label">
                  <input type="radio" name={`q${index}`} value="A" className="form-check-input me-2" />
                  {question.optionA}
                </label>
              </li>
              <li className="list-group-item">
                <label className="form-check-label">
                  <input type="radio" name={`q${index}`} value="B" className="form-check-input me-2" />
                  {question.optionB}
                </label>
              </li>
              <li className="list-group-item">
                <label className="form-check-label">
                  <input type="radio" name={`q${index}`} value="C" className="form-check-input me-2" />
                  {question.optionC}
                </label>
              </li>
              <li className="list-group-item">
                <label className="form-check-label">
                  <input type="radio" name={`q${index}`} value="D" className="form-check-input me-2" />
                  {question.optionD}
                </label>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
    );
  };
  

  return (
    <div className="container">
      
    <div className="container contain mt-5 p-5">
      <h1>Quiz</h1>
      {quizQuestions.length > 0 ? renderQuiz() : <p>Loading quiz...</p>}
      <button onClick={handleSubmit}>Submit Quiz</button>
      {score && (
        <div id="score">
          <p>
            You obtained {score.correctAnswers} out of {score.totalQuestions}.
          </p>
          <p>Percentage: {score.percentage.toFixed(2)}%</p>
        </div>
      )}
    </div>
      </div>
  );
};

export default Quiz;
