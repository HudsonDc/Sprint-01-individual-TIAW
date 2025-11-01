const API_URL = 'https://5a19bf56-d6fa-4300-8ecf-b40c5e6440dc-00-3a9pa51s6jkwx.worf.replit.dev:8080';

let questions = [];
let profiles = {};
let currentQuestionIndex = 0;
let userAnswers = [];

const introScreen = document.getElementById('intro-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const profileTitle = document.getElementById('profile-title');
const profileDescription = document.getElementById('profile-description');

async function loadData() {
    try {
        console.log('Carregando dados da API...');
        console.log('URL da API:', API_URL);
        
        const testResponse = await fetch(API_URL);
        console.log('Teste de conexão:', testResponse.status);
        
        const questionsResponse = await fetch(API_URL + '/questions');
        if (!questionsResponse.ok) {
            throw new Error(`Erro ao carregar perguntas: ${questionsResponse.status}`);
        }
        questions = await questionsResponse.json();
        
        const profilesResponse = await fetch(API_URL + '/profiles');
        if (!profilesResponse.ok) {
            throw new Error(`Erro ao carregar perfis: ${profilesResponse.status}`);
        }
        profiles = await profilesResponse.json();
        
        console.log('Dados carregados com sucesso!');
        console.log('Número de perguntas:', questions.length);
        console.log('Perfis disponíveis:', Object.keys(profiles));
        
 
        startBtn.disabled = false;
        startBtn.textContent = 'Iniciar Teste';
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar as perguntas. Verifique o console para mais detalhes.');
        startBtn.textContent = 'Erro - Clique para tentar novamente';
    }
}

async function initTest() {
    startBtn.disabled = true;
    startBtn.textContent = 'Carregando...';
    
    await loadData();
    setupEventListeners();
}

function setupEventListeners() {
    startBtn.addEventListener('click', startTest);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartTest);
}

function startTest() {
    if (questions.length === 0) {
        initTest();
        return;
    }
    
    currentQuestionIndex = 0;
    userAnswers = [];
    introScreen.classList.remove('active');
    questionScreen.classList.add('active');
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const question = questions[currentQuestionIndex];
    
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
    
    questionText.textContent = `${currentQuestionIndex + 1}. ${question.text}`;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" id="option-${index}" name="answer" value="${option.value}">
            <label for="option-${index}">${option.text}</label>
        `;
        
        optionElement.addEventListener('click', () => {
 
            document.querySelectorAll('.option input').forEach(input => {
                input.checked = false;
            });

            optionElement.querySelector('input').checked = true;
            nextBtn.disabled = false;
            
            document.querySelectorAll('.option').forEach(opt => {
                opt.style.background = '';
                opt.style.borderColor = '#ddd';
            });
            optionElement.style.background = '#f0f8ff';
            optionElement.style.borderColor = '#4CAF50';
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Ver Resultado' : 'Próxima';
    nextBtn.disabled = true;
}

function nextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    
    if (selectedOption) {
        userAnswers.push({
            questionId: questions[currentQuestionIndex].id,
            answer: selectedOption.value
        });
        
        currentQuestionIndex++;
        showQuestion();
    }
}

function calculateResult() {

    let countA = 0, countB = 0, countC = 0;
    
    userAnswers.forEach(answer => {
        if (answer.answer === 'A') countA++;
        else if (answer.answer === 'B') countB++;
        else if (answer.answer === 'C') countC++;
    });
    
    console.log(`Respostas: A=${countA}, B=${countB}, C=${countC}`);
    
    if (countA >= countB && countA >= countC) {
        return 'Conservador';
    } else if (countB >= countA && countB >= countC) {
        return 'Moderado';
    } else {
        return 'Agressivo';
    }
}

function showResult() {
    const profile = calculateResult();
    
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    profileTitle.textContent = `Perfil ${profile}`;
    profileDescription.textContent = profiles[profile].description;
}

function restartTest() {
    resultScreen.classList.remove('active');
    introScreen.classList.add('active');
}

document.addEventListener('DOMContentLoaded', initTest);