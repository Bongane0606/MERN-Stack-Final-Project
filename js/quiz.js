document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Practical and relatable safe driving questions
    const quizQuestions = [
        {
            question: "When approaching a school zone with flashing lights, what should you do?",
            answers: [
                { text: "Slow down to the posted speed limit", correct: true },
                { text: "Continue at your current speed if no children are visible", correct: false },
                { text: "Speed up to pass through quickly", correct: false },
                { text: "Honk your horn to alert pedestrians", correct: false }
            ],
            explanation: "You must always slow to the posted speed limit in school zones when lights are flashing, regardless of whether children are visible."
        },
        {
            question: "What should you do when you see a stopped school bus with red lights flashing?",
            answers: [
                { text: "Stop and wait until the lights stop flashing", correct: true },
                { text: "Slow down and proceed with caution", correct: false },
                { text: "Continue driving if you're in the opposite lane", correct: false },
                { text: "Pass quickly if no children are crossing", correct: false }
            ],
            explanation: "You must stop for a school bus with flashing red lights in all directions unless there is a physical barrier separating the lanes."
        },
        {
            question: "When driving in heavy rain, what is the safest following distance?",
            answers: [
                { text: "2 seconds", correct: false },
                { text: "3 seconds", correct: false },
                { text: "4 seconds", correct: true },
                { text: "The same as dry conditions", correct: false }
            ],
            explanation: "You should double the normal following distance to 4 seconds in heavy rain to account for reduced traction and visibility."
        },
        {
            question: "What should you do if your car starts to hydroplane?",
            answers: [
                { text: "Brake firmly to slow down", correct: false },
                { text: "Steer sharply to regain control", correct: false },
                { text: "Ease off the accelerator and steer straight", correct: true },
                { text: "Speed up to get through the water", correct: false }
            ],
            explanation: "When hydroplaning, ease off the gas and steer straight until your tires regain traction. Braking or turning sharply can cause skidding."
        },
        {
            question: "When merging onto a highway, you should:",
            answers: [
                { text: "Stop and wait for a large gap", correct: false },
                { text: "Match the speed of traffic and merge smoothly", correct: true },
                { text: "Force your way into traffic", correct: false },
                { text: "Merge slowly to let others adjust", correct: false }
            ],
            explanation: "The safest way to merge is to match the speed of traffic and find an appropriate gap to merge smoothly."
        },
        {
            question: "What does a solid yellow traffic light mean?",
            answers: [
                { text: "Speed up to beat the red light", correct: false },
                { text: "Stop if you can do so safely", correct: true },
                { text: "Continue through the intersection", correct: false },
                { text: "Prepare to go if the light turns green", correct: false }
            ],
            explanation: "A solid yellow light means the signal is about to turn red. Stop if you can do so safely, otherwise proceed with caution."
        },
        {
            question: "When driving at night, you should:",
            answers: [
                { text: "Use high beams in all situations", correct: false },
                { text: "Dim your lights when approaching other vehicles", correct: true },
                { text: "Drive faster to reduce time on the road", correct: false },
                { text: "Follow other cars more closely to see better", correct: false }
            ],
            explanation: "Always dim your high beams when approaching or following other vehicles to avoid blinding other drivers."
        },
        {
            question: "What is the safest action when approaching a yellow traffic light?",
            answers: [
                { text: "Speed up to beat the red light", correct: false },
                { text: "Stop if you can do so safely", correct: true },
                { text: "Continue through at the same speed", correct: false },
                { text: "Honk your horn and proceed", correct: false }
            ],
            explanation: "The safest action is to stop if you can do so safely when you see a yellow light."
        },
        {
            question: "When passing a bicyclist on the road, you should:",
            answers: [
                { text: "Honk to alert them of your presence", correct: false },
                { text: "Pass as closely as possible", correct: false },
                { text: "Give at least 3 feet of space", correct: true },
                { text: "Follow closely until they move over", correct: false }
            ],
            explanation: "You should give bicyclists at least 3 feet of space when passing for everyone's safety."
        },
        {
            question: "What should you do when emergency vehicles approach with sirens on?",
            answers: [
                { text: "Speed up to clear the way", correct: false },
                { text: "Pull over to the right and stop", correct: true },
                { text: "Continue driving normally", correct: false },
                { text: "Flash your lights to acknowledge them", correct: false }
            ],
            explanation: "You must pull over to the right and stop to allow emergency vehicles to pass safely."
        }
    ];

    // DOM Elements
    const quizContent = document.getElementById('quizContent');
    const quizProgress = document.querySelector('.progress-bar');
    const progressText = document.getElementById('progressText');
    const quizResult = document.getElementById('quizResult');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const scoreElement = document.getElementById('score');
    const returnToDashboard = document.getElementById('returnToDashboard');

    // Quiz state
    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;
    let quizCompleted = false;
    const questionsPerQuiz = 5; // Show 5 random questions per quiz

    // Select random questions
    const selectedQuestions = [...quizQuestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, questionsPerQuiz);

    // Initialize quiz
    function initQuiz() {
        showQuestion();
    }

    // Show current question
    function showQuestion() {
        if (currentQuestion >= selectedQuestions.length) {
            completeQuiz();
            return;
        }

        const question = selectedQuestions[currentQuestion];
        selectedAnswer = null;

        // Update progress
        updateProgress();

        // Create question HTML
        quizContent.innerHTML = `
            <div class="question-container">
                <h3 class="question-text">${question.question}</h3>
                <div class="answer-options">
                    ${question.answers.map((answer, index) => `
                        <div class="answer-option" data-index="${index}" data-correct="${answer.correct}">
                            ${answer.text}
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-navigation">
                    ${currentQuestion > 0 ? `
                        <button class="btn btn-secondary" id="prevQuestion">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                    ` : '<div></div>'}
                    <button class="btn btn-primary" id="nextQuestion" disabled>
                        ${currentQuestion === selectedQuestions.length - 1 ? 'Submit Quiz' : 'Next Question'} 
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                <div class="question-explanation" id="explanation" style="display: none;">
                    <i class="fas fa-info-circle"></i>
                    <p>${question.explanation}</p>
                </div>
            </div>
        `;

        // Add event listeners
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', selectAnswer);
        });

        if (currentQuestion > 0) {
            document.getElementById('prevQuestion').addEventListener('click', prevQuestion);
        }

        document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    }

    // Select answer
    function selectAnswer(e) {
        // Remove selected class from all options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });

        // Add selected class to clicked option
        const selectedOption = e.currentTarget;
        selectedOption.classList.add('selected');
        selectedAnswer = parseInt(selectedOption.dataset.index);

        // Show if answer is correct/incorrect
        const isCorrect = selectedOption.dataset.correct === 'true';
        selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Show explanation
        document.getElementById('explanation').style.display = 'block';

        // Enable next button
        document.getElementById('nextQuestion').disabled = false;
    }

    // Next question
    function nextQuestion() {
        if (selectedAnswer === null) return;

        // Check if answer is correct
        const currentQ = selectedQuestions[currentQuestion];
        if (currentQ.answers[selectedAnswer].correct) {
            score++;
        }

        currentQuestion++;
        showQuestion();
    }

    // Previous question
    function prevQuestion() {
        currentQuestion--;
        showQuestion();
    }

    // Update progress
    function updateProgress() {
        const progress = (currentQuestion / selectedQuestions.length) * 100;
        quizProgress.style.width = `${progress}%`;
        progressText.textContent = `${currentQuestion}/${selectedQuestions.length} completed`;
    }

    // Complete quiz
    function completeQuiz() {
        quizCompleted = true;
        quizContent.style.display = 'none';
        quizResult.style.display = 'block';

        // Update result display
        scoreElement.textContent = score;
        
        if (score === selectedQuestions.length) {
            resultTitle.textContent = "Perfect Score!";
            resultMessage.textContent = `You scored ${score}/${selectedQuestions.length} correct answers`;
        } else if (score >= selectedQuestions.length * 0.7) {
            resultTitle.textContent = "Good Job!";
            resultMessage.textContent = `You scored ${score}/${selectedQuestions.length} correct answers`;
        } else {
            resultTitle.textContent = "Keep Practicing!";
            resultMessage.textContent = `You scored ${score}/${selectedQuestions.length} correct answers`;
            document.querySelector('.result-icon').classList.add('fail');
        }

        // Update user points in localStorage
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user.points) user.points = 0;
        user.points += 100;
        user.quizCompleted = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Return to dashboard
    returnToDashboard.addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Start the quiz
    initQuiz();
});