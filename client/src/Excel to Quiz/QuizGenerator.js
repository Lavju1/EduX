import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const QuizGenerator = () => {
  const [file, setFile] = useState(null);
  const [quizLink, setQuizLink] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const generateQuizId = () => {
    return 'quiz_' + Date.now();
  };

  const handleGenerateQuiz = () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = event.target.result;
  
      const quizId = generateQuizId();
      localStorage.setItem(quizId, data);
  
      // Construct the base URL and ensure proper query parameter formatting
      const baseUrl = new URL(window.location.href); // Create a URL object
      baseUrl.pathname = '/q'; // Set the path to the quiz page
      const searchParams = new URLSearchParams(baseUrl.search); // Get existing query parameters if any
      searchParams.set('quizId', quizId); // Add or replace the quizId parameter
  
      const quizLinkUrl = `${baseUrl.origin}${baseUrl.pathname}?${searchParams.toString()}`; // Construct the full URL with proper query params
  
      setQuizLink(`Quiz link: <a href="${quizLinkUrl}">${quizLinkUrl}</a>`);
    };
  
    reader.onerror = (event) => {
      console.error('File could not be read! Code:', event.target.error.code);
    };
  
    reader.readAsBinaryString(file);
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
    <h1>Quiz Generator</h1>
    <input
      type="file"
      id="fileInput"
      accept=".xls,.xlsx,.csv"
      className="form-control my-3"
      onChange={handleFileChange}
    />
    <button
      className="btn btn-primary mb-3"
      onClick={handleGenerateQuiz}
    >
      Generate Quiz
    </button>
    <div
      id="quizLink"
      dangerouslySetInnerHTML={{ __html: quizLink }}
      className="text-center"
    ></div>
  </div>
);

};

export default QuizGenerator;
