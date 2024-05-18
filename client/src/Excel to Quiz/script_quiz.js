var quizQuestions; // Declare quizQuestions variable outside of the function

document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var quizId = urlParams.get('quizId');
    
    if (!quizId) {
        alert('Quiz ID not found in URL!');
        window.location.href = 'index.html';
    }

    var quizData = localStorage.getItem(quizId);
    
    if (!quizData) {
        alert('Quiz not found!');
        window.location.href = 'index.html';
    }

    var workbook = XLSX.read(quizData, {type: 'binary'});
    var sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[sheetName];
    var questions = XLSX.utils.sheet_to_json(sheet, {header: 1});

    // Remove the header row
    questions.splice(0, 1);

    // Convert data to array of objects
    quizQuestions = questions.map(function(row) {
        return {
            question: row[0],
            optionA: row[1],
            optionB: row[2],
            optionC: row[3],
            optionD: row[4],
            correctAnswer: row[5]
        };
    });

    renderQuiz(quizQuestions);
});

function renderQuiz(quizQuestions) {
    var quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    quizQuestions.forEach(function(question, index) {
        var questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
            <ul>
                <li><label><input type="radio" name="q${index}" value="A">${question.optionA}</label></li>
                <li><label><input type="radio" name="q${index}" value="B">${question.optionB}</label></li>
                <li><label><input type="radio" name="q${index}" value="C">${question.optionC}</label></li>
                <li><label><input type="radio" name="q${index}" value="D">${question.optionD}</label></li>
            </ul>
        `;
        quizContainer.appendChild(questionElement);
    });
}

document.getElementById('submitQuiz').addEventListener('click', function() {
    var questions = document.querySelectorAll('.question');
    var score = 0;

    questions.forEach(function(question, index) {
        var selectedOption = question.querySelector('input:checked');
        if (selectedOption && selectedOption.value.toUpperCase() === quizQuestions[index].correctAnswer.toUpperCase()) {
            score++;
        }
    });
    

    var totalQuestions = quizQuestions.length;
    var percentage = (score / totalQuestions) * 100;

    var scoreDisplay = document.getElementById('score');
    scoreDisplay.innerHTML = `You obtained ${score} out of ${totalQuestions}`;
    scoreDisplay.style.display = 'block';

    // Prevent default form submission behavior
    return false;
});
