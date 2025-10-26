

const questions = dados.questions;
const profiles = dados.profiles;
const introScreen = document.getElementById('intro-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const profileTitle = document.getElementById('profile-title');
const profileDescription = document.getElementById('profile-description');
const progressBar = document.getElementById('progress-bar');

// Variáveis do teste
let currentQuestion = 0;
let userAnswers = [];

// Iniciar o teste
startBtn.addEventListener('click', () => {
    introScreen.classList.remove('active');
    questionScreen.classList.add('active');
    showQuestion();
});

// Mostrar pergunta atual
function showQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.text;
    
    // Atualizar barra de progresso
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Adicionar novas opções
    question.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        optionElement.dataset.value = option.value;
        
        optionElement.addEventListener('click', () => {
            // Remover seleção anterior
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Selecionar nova opção
            optionElement.classList.add('selected');
            nextBtn.disabled = false;
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Desabilitar botão "Próxima" até que uma opção seja selecionada
    nextBtn.disabled = true;
}

// Próxima pergunta
nextBtn.addEventListener('click', () => {
    const selectedOption = document.querySelector('.option.selected');
    
    if (selectedOption) {
        // Salvar resposta
        userAnswers.push({
            id: currentQuestion + 1,
            value: selectedOption.dataset.value
        });
        
        // Avançar para próxima pergunta ou mostrar resultado
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }
});

// Mostrar resultado
function showResult() {
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // Calcular perfil baseado nas respostas
    const profile = calculateProfile();
    
    // Exibir resultado
    profileTitle.textContent = `Seu perfil é: ${profile}`;
    profileDescription.textContent = profiles[profile].description;
    
    // Salvar resultado no localStorage (opcional)
    localStorage.setItem('perfilInvestidor', JSON.stringify({
        perfil: profile,
        respostas: userAnswers,
        data: new Date().toISOString()
    }));
}

// Calcular perfil do investidor
function calculateProfile() {
    // Pontuação: A=1, B=2, C=3
    let score = 0;
    
    userAnswers.forEach(answer => {
        if (answer.value === 'A') score += 1;
        else if (answer.value === 'B') score += 2;
        else if (answer.value === 'C') score += 3;
    });
    
    // Média das respostas
    const average = score / userAnswers.length;
    
    // Determinar perfil baseado na média
    if (average < 1.7) return "Conservador";
    else if (average < 2.4) return "Moderado";
    else return "Agressivo";
}

// Reiniciar teste
restartBtn.addEventListener('click', () => {
    resultScreen.classList.remove('active');
    introScreen.classList.add('active');
    
    // Resetar variáveis
    currentQuestion = 0;
    userAnswers = [];
    progressBar.style.width = '0%';
});