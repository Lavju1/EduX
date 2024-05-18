document.getElementById('generateQuiz').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var data = event.target.result;
        var quizId = generateQuizId(); // Generate a unique quiz ID
        localStorage.setItem(quizId, data); // Store quiz data in localStorage
        var quizLink = window.location.href.replace('index.html', 'quiz.html') + '?quizId=' + quizId;
        document.getElementById('quizLink').innerHTML = 'Quiz link: <a href="' + quizLink + '">' + quizLink + '</a>';
    };

    reader.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
    };

    reader.readAsBinaryString(file);
});

function generateQuizId() {
    return 'quiz_' + Date.now();
}
