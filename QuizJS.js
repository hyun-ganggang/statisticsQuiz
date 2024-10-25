let quizData = [];
let currentQuizIndex = 0;
let score = 0;
let totalQuestions = 5;
let timeLimit = 10;
let timeRemaining = timeLimit;
let intervalId;


function fetchQuizData() {
    fetch('https://gist.githubusercontent.com/hyun-ganggang/ca8cac69d442ddac2fd42c73146a78b1/raw/6906ae7ea41ce5a45d614025117698c98dcfe8d4/finentialQuizData.json')  // 업로드된 JSON 파일 경로
        .then(response => response.json())
        .then(data => {
            console.log("데이터 로드 성공");

            let quizSet = data.map(item => ({
                word: item["용어"],   
                content: item["설명"] 
            }));

            // 5개의 랜덤 문제 추출
            quizData = getRandomItems(quizSet, totalQuestions);

            console.log("랜덤으로 선택된 퀴즈 데이터:", quizData);
            displayNextQuiz();
        })
        .catch(error => {
            console.error('오류 발생:', error);
        });
        
}

// 배열에서 랜덤으로 문제 5개를 추출하는 함수
function getRandomItems(array, num) {
    let shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// 타이머 그리기 함수
let timerCanvas = document.getElementById('timer');
let ctx = timerCanvas.getContext('2d');

function drawTimer() {
    ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, 2 * Math.PI);  // 전체 원
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 10;
    ctx.stroke();

    let angle = (2 * Math.PI * (timeRemaining / timeLimit)) - Math.PI / 2; // 진행각도 계산
    ctx.beginPath();
    ctx.arc(100, 100, 90, -Math.PI / 2, angle, false);  // 진행 중인 부분
    ctx.strokeStyle = '#6495ed';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillStyle = "#ddd";
    ctx.textAlign = "center";
    ctx.fillText(timeRemaining + "초", 100, 110);
}

// 타이머 시작 함수
function startTimer() {
    clearInterval(intervalId);
    timeRemaining = timeLimit;
    intervalId = setInterval(() => {
        timeRemaining--;
        drawTimer();
        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            wrongAnswer();
        }
    }, 1000);
    drawTimer();
}

function progressCircle() {
    let circles = document.querySelectorAll('#progress span');
    circles.forEach((circle, index) => {
        if (index < currentQuizIndex+1) {
            circle.classList.add('filled');
        } else{
            circle.classList.remove('filled');
        }
    });
}

// 다음 문제를 표시하는 함수
function displayNextQuiz() {
    document.getElementById('finalscore').style.display = 'none';
    document.getElementById('restartbtn').style.display = 'none';
    if (currentQuizIndex < quizData.length) {
        console.log("현재 문제:", quizData[currentQuizIndex]);
        document.getElementById('content').textContent = quizData[currentQuizIndex].content;
        document.getElementById('answer').value = '';  // 입력 필드 초기화
        document.getElementById('result').textContent = '';  // 결과 초기화
        document.getElementById('O').style.display = 'none';
        document.getElementById('X').style.display = 'none';
        
        progressCircle();  
        startTimer();  // 타이머 시작
    } else {
        endQuiz();  // 퀴즈 종료
    }
}

// 정답 확인 함수
function checkAnswer() {
    clearInterval(intervalId);
    let userAnswer = document.getElementById('answer').value.trim();
    let correctAnswer = quizData[currentQuizIndex].word;
    if (userAnswer === correctAnswer) {
        score++;
        document.getElementById("O").style.display = 'block';
    } else {
        wrongAnswer();
    }
    currentQuizIndex++;
    setTimeout(displayNextQuiz, 2000);  // 2초 후 다음 문제로 이동
}

// 오답일 경우 처리 함수
function wrongAnswer() {
    let correctAnswer = quizData[currentQuizIndex].word;
    document.getElementById("rightResult").textContent=`정답: ${correctAnswer}`;
    document.getElementById('X').style.display = 'block';
    
    setTimeout(displayNextQuiz, 2000);  // 2초 후 다음 문제로 이동
}

// 퀴즈 종료 후 결과를 표시하는 함수
function endQuiz() {
    document.querySelector('.quiz_container').style.display = 'none';
    document.getElementById('finalscore').style.display = 'block';
    document.getElementById('score').textContent = `${score} / ${totalQuestions}`;
    document.getElementById('restartbtn').style.display = 'block';
}

// 다시 시작하는 함수
function restartQuiz() {
    score = 0;
    currentQuizIndex = 0;
    document.querySelector('.quiz_container').style.display = 'block';
    document.getElementById('finalscore').style.display = 'none';
    document.getElementById('restartbtn').style.display = 'none';
    fetchQuizData();  // 새로운 문제 가져오기
}


document.getElementById('submitbtn').addEventListener('click', checkAnswer);
document.getElementById('restartbtn').addEventListener('click', restartQuiz);

// 퀴즈 데이터 가져오기 호출
fetchQuizData();