document.addEventListener('DOMContentLoaded', () => {
    // --- 画面要素の取得 ---
    const titleScreen = document.getElementById('title-screen');
    const dateInputScreen = document.getElementById('date-input-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    const startButton = document.getElementById('start-button');
    const birthdateInput = document.getElementById('birthdate');
    const appDateInput = document.getElementById('app-date');
    const submitDatesButton = document.getElementById('submit-dates-button');

    const questionNumberDisplay = document.getElementById('question-number');
    const questionTextDisplay = document.getElementById('question-text');
    const optionButtons = document.querySelectorAll('.option-button');
    const feedbackDisplay = document.getElementById('feedback');
    const nextQuestionButton = document.getElementById('next-question-button');

    const scoreDisplay = document.getElementById('score-display');
    const birthdayMessageDisplay = document.getElementById('birthday-message');
    const restartButton = document.getElementById('restart-button');

    // --- ゲームの状態変数 ---
    let currentQuestionIndex = 0;
    let score = 0;
    let userBirthdate = null;
    let userAppDate = null;

    // --- クイズデータ ---
    const quizQuestions = [
        {
            question: "12月12日は何の日？",
            options: { A: "ダースの日", B: "ルックの日", C: "ポッキーの日" },
            correct: "A"
        },
        {
            question: "漢字の日は何月何日？",
            options: { A: "12月2日", B: "12月12日", C: "12月22日" },
            correct: "B"
        },
        {
            question: "ハナキリンやデンファレが誕生花なのは何月何日？",
            options: { A: "12月12日", B: "12月13日", C: "12月14日" },
            correct: "A"
        },
        {
            question: "5本指ソックスの日は何月何日？",
            options: { A: "5月5日", B: "10月10日", C: "12月12日" },
            correct: "C"
        },
        {
            question: "12月12日は何の日？",
            options: { A: "ひまりちゃんの誕生日", B: "ななみちゃんの誕生日", C: "ちおちゃんの誕生日" },
            correct: "C"
        }
    ];

    // --- 画面切り替え関数 ---
    const showScreen = (screenToShow) => {
        const screens = [titleScreen, dateInputScreen, quizScreen, resultScreen];
        screens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });
    };

    // --- クイズ表示関数 ---
    const displayQuestion = () => {
        const questionData = quizQuestions[currentQuestionIndex];
        questionNumberDisplay.textContent = `第${currentQuestionIndex + 1}問`;
        questionTextDisplay.textContent = questionData.question;

        optionButtons.forEach(button => {
            const optionKey = button.dataset.option;
            button.textContent = `${optionKey}. ${questionData.options[optionKey]}`;
            button.classList.remove('correct', 'incorrect'); // 前回の結果をリセット
            button.disabled = false; // ボタンを有効化
            button.onclick = () => checkAnswer(optionKey); // クリックイベントを再設定
        });

        feedbackDisplay.textContent = ''; // フィードバックをクリア
        feedbackDisplay.classList.remove('correct', 'incorrect');
        nextQuestionButton.classList.add('hidden'); // 次の問題ボタンを非表示
    };

    // --- 回答チェック関数 ---
    const checkAnswer = (selectedOption) => {
        const questionData = quizQuestions[currentQuestionIndex];
        const isCorrect = (selectedOption === questionData.correct);

        optionButtons.forEach(button => {
            button.disabled = true; // 回答後はボタンを無効化
            if (button.dataset.option === questionData.correct) {
                button.classList.add('correct'); // 正解の選択肢をハイライト
            } else if (button.dataset.option === selectedOption) {
                button.classList.add('incorrect'); // 不正解の選択肢をハイライト
            }
        });

        if (isCorrect) {
            score++;
            feedbackDisplay.textContent = '正解！';
            feedbackDisplay.classList.add('correct');
        } else {
            feedbackDisplay.textContent = `不正解... 正解は ${questionData.correct}. ${questionData.options[questionData.correct]}でした。`;
            feedbackDisplay.classList.add('incorrect');
        }

        nextQuestionButton.classList.remove('hidden'); // 次の問題ボタンを表示
    };

    // --- 次の問題へ進む関数 ---
    const goToNextQuestion = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            displayQuestion();
        } else {
            showResult();
        }
    };

    // --- 結果表示関数 ---
    const showResult = () => {
        showScreen(resultScreen);
        scoreDisplay.textContent = `あなたのスコア：${score} / ${quizQuestions.length}点`;

        // 誕生日メッセージの判定
        if (userBirthdate && userAppDate) {
            const birthMonthDay = userBirthdate.substring(5); // "MM-DD"
            const appMonthDay = userAppDate.substring(5);     // "MM-DD"

            if (birthMonthDay === appMonthDay) {
                birthdayMessageDisplay.textContent = 'ちおちゃん\nお誕生日おめでとう！';
                birthdayMessageDisplay.style.color = '#FF4500'; // オレンジレッド
                birthdayMessageDisplay.style.fontWeight = 'bold';
                birthdayMessageDisplay.style.fontSize = '1.5em';
                birthdayMessageDisplay.style.whiteSpace = 'pre-wrap';
            } else {
                birthdayMessageDisplay.textContent = 'A Very Merry Unbirthday to You';
                birthdayMessageDisplay.style.color = '#1E90FF'; // ドジャーブルー
                birthdayMessageDisplay.style.fontWeight = 'bold';
                birthdayMessageDisplay.style.fontSize = '1.5em';
            }
        } else {
            birthdayMessageDisplay.textContent = '日付が入力されませんでした。';
            birthdayMessageDisplay.style.color = '#888';
            birthdayMessageDisplay.style.fontSize = '1.1em';
        }
    };

    // --- ゲームのリスタート関数 ---
    const restartGame = () => {
        currentQuestionIndex = 0;
        score = 0;
        userBirthdate = null;
        userAppDate = null;
        birthdateInput.value = ''; // 入力フィールドをクリア
        appDateInput.value = '';
        showScreen(titleScreen);
    };

    // --- イベントリスナーの設定 ---
    startButton.addEventListener('click', () => showScreen(dateInputScreen));

    submitDatesButton.addEventListener('click', () => {
        userBirthdate = birthdateInput.value;
        userAppDate = appDateInput.value;

        if (userBirthdate && userAppDate) {
            showScreen(quizScreen);
            displayQuestion();
        } else {
            alert('誕生日とアプリ使用日の両方を入力してください。');
        }
    });

    nextQuestionButton.addEventListener('click', goToNextQuestion);
    restartButton.addEventListener('click', restartGame);

    // 初期表示
    showScreen(titleScreen);
});
