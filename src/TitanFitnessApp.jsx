import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Target, TrendingUp, Bell, Calendar, Utensils, Settings, ChevronRight, Play, Award, Flame, Menu, X, BarChart, Clock } from 'lucide-react';

// Função para calcular o Índice de Massa Corporal (IMC)
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightMeters = height / 100;
  return (weight / (heightMeters * heightMeters)).toFixed(1);
};

// Função para carregar o GIF (Simulação de URLs)
const getExerciseGif = (exerciseId) => {
    // Estas são URLs de Giphy de exemplo. Substitua por URLs reais de GIFs ou vídeos hospedados por você.
    const gifs = {
        'flexoes': 'https://media.giphy.com/media/l4pT2p1iK0jRjWvC8/giphy.gif', 
        'agachamento': 'https://media.giphy.com/media/3o7bucjYy9d2rXGk88/giphy.gif', 
        'prancha': 'https://media.giphy.com/media/wMtrNq403bJ3a/giphy.gif', 
        'elevacao': 'https://media.giphy.com/media/3o7buhaBw36R1MhR8A/giphy.gif', 
        'ponte': 'https://media.giphy.com/media/26hiryQ0c81x5iYQ0/giphy.gif', 
        'pular_corda': 'https://media.giphy.com/media/l0HlTL1jP3vM93Wn6/giphy.gif', 
    };
    return gifs[exerciseId] || '';
};

// Componente Principal
const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('titanFitnessUserData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      age: '',
      weight: '',
      height: '',
      goal: 'muscle', // 'muscle' or 'weight_loss'
      hasProfile: false
    };
  });
  
  const [exercises] = useState([
    { id: 'flexoes', name: 'Flexões', target: 'Peitoral', icon: '💪', color: 'from-red-500 to-orange-500', isTimeBased: false },
    { id: 'agachamento', name: 'Agachamento', target: 'Quadríceps e Panturrilha', icon: '🦵', color: 'from-blue-500 to-cyan-500', isTimeBased: false },
    { id: 'prancha', name: 'Prancha', target: 'Abdômen', icon: '🔥', color: 'from-yellow-500 to-orange-500', isTimeBased: true }, // <--- TIME BASED
    { id: 'elevacao', name: 'Elevação', target: 'Costas', icon: '⬆️', color: 'from-green-500 to-emerald-500', isTimeBased: false },
    { id: 'ponte', name: 'Ponte Glútea', target: 'Glúteos e Posterior', icon: '🍑', color: 'from-purple-500 to-pink-500', isTimeBased: false },
    { id: 'pular_corda', name: 'Pular Corda', target: 'Cardio e Resistência', icon: '🏃', color: 'from-cyan-500 to-blue-500', isTimeBased: false }
  ]);

  const foodDatabase = [
    // ... (Mantendo seu banco de dados de alimentos local)
    { name: 'Arroz branco cozido', calories: 130, category: 'Carboidratos', unit: '100g', emoji: '🍚' },
    { name: 'Arroz integral cozido', calories: 110, category: 'Carboidratos', unit: '100g', emoji: '🍚' },
    { name: 'Macarrão cozido', calories: 131, category: 'Carboidratos', unit: '100g', emoji: '🍝' },
    { name: 'Pão francês', calories: 300, category: 'Carboidratos', unit: '100g', emoji: '🥖' },
    { name: 'Pão integral', calories: 253, category: 'Carboidratos', unit: '100g', emoji: '🍞' },
    { name: 'Batata cozida', calories: 87, category: 'Carboidratos', unit: '100g', emoji: '🥔' },
    { name: 'Batata doce cozida', calories: 86, category: 'Carboidratos', unit: '100g', emoji: '🍠' },
    { name: 'Mandioca cozida', calories: 125, category: 'Carboidratos', unit: '100g', emoji: '🥔' },
    { name: 'Tapioca', calories: 130, category: 'Carboidratos', unit: '100g', emoji: '🫓' },
    { name: 'Aveia', calories: 389, category: 'Carboidratos', unit: '100g', emoji: '🥣' },
    { name: 'Peito de frango grelhado', calories: 165, category: 'Proteínas', unit: '100g', emoji: '🍗' },
    { name: 'Carne bovina magra', calories: 250, category: 'Proteínas', unit: '100g', emoji: '🥩' },
    { name: 'Ovo cozido', calories: 155, category: 'Proteínas', unit: '100g', emoji: '🥚' },
    { name: 'Peixe grelhado', calories: 140, category: 'Proteínas', unit: '100g', emoji: '🐟' },
    { name: 'Tilápia', calories: 96, category: 'Proteínas', unit: '100g', emoji: '🐟' },
    { name: 'Salmão', calories: 208, category: 'Proteínas', unit: '100g', emoji: '🐟' },
    { name: 'Atum enlatado', calories: 116, category: 'Proteínas', unit: '100g', emoji: '🥫' },
    { name: 'Camarão', calories: 99, category: 'Proteínas', unit: '100g', emoji: '🦐' },
    { name: 'Peito de peru', calories: 104, category: 'Proteínas', unit: '100g', emoji: '🦃' },
    { name: 'Feijão preto cozido', calories: 77, category: 'Leguminosas', unit: '100g', emoji: '🫘' },
    { name: 'Feijão carioca cozido', calories: 76, category: 'Leguminosas', unit: '100g', emoji: '🫘' },
    { name: 'Lentilha cozida', calories: 116, category: 'Leguminosas', unit: '100g', emoji: '🫘' },
    { name: 'Grão de bico cozido', calories: 164, category: 'Leguminosas', unit: '100g', emoji: '🫘' },
    { name: 'Leite integral', calories: 61, category: 'Laticínios', unit: '100ml', emoji: '🥛' },
    { name: 'Leite desnatado', calories: 34, category: 'Laticínios', unit: '100ml', emoji: '🥛' },
    { name: 'Iogurte natural', calories: 61, category: 'Laticínios', unit: '100g', emoji: '🥛' },
    { name: 'Queijo minas', calories: 264, category: 'Laticínios', unit: '100g', emoji: '🧀' },
    { name: 'Queijo mussarela', calories: 280, category: 'Laticínios', unit: '100g', emoji: '🧀' },
    { name: 'Requeijão', calories: 235, category: 'Laticínios', unit: '100g', emoji: '🧈' },
    { name: 'Banana', calories: 89, category: 'Frutas', unit: '100g', emoji: '🍌' },
    { name: 'Maçã', calories: 52, category: 'Frutas', unit: '100g', emoji: '🍎' },
    { name: 'Laranja', calories: 47, category: 'Frutas', unit: '100g', emoji: '🍊' },
    { name: 'Mamão', calories: 43, category: 'Frutas', unit: '100g', emoji: '🍈' },
    { name: 'Melancia', calories: 30, category: 'Frutas', unit: '100g', emoji: '🍉' },
    { name: 'Morango', calories: 32, category: 'Frutas', unit: '100g', emoji: '🍓' },
    { name: 'Abacaxi', calories: 50, category: 'Frutas', unit: '100g', emoji: '🍍' },
    { name: 'Manga', calories: 60, category: 'Frutas', unit: '100g', emoji: '🥭' },
    { name: 'Uva', calories: 69, category: 'Frutas', unit: '100g', emoji: '🍇' },
    { name: 'Abacate', calories: 160, category: 'Frutas', unit: '100g', emoji: '🥑' },
    { name: 'Brócolis cozido', calories: 35, category: 'Vegetais', unit: '100g', emoji: '🥦' },
    { name: 'Cenoura crua', calories: 41, category: 'Vegetais', unit: '100g', emoji: '🥕' },
    { name: 'Tomate', calories: 18, category: 'Vegetais', unit: '100g', emoji: '🍅' },
    { name: 'Alface', calories: 15, category: 'Vegetais', unit: '100g', emoji: '🥬' },
    { name: 'Couve', calories: 33, category: 'Vegetais', unit: '100g', emoji: '🥬' },
    { name: 'Abobrinha', calories: 17, category: 'Vegetais', unit: '100g', emoji: '🥒' },
    { name: 'Berinjela', calories: 25, category: 'Vegetais', unit: '100g', emoji: '🍆' },
    { name: 'Pepino', calories: 15, category: 'Vegetais', unit: '100g', emoji: '🥒' },
    { name: 'Azeite de oliva', calories: 884, category: 'Gorduras', unit: '100ml', emoji: '🫒' },
    { name: 'Manteiga', calories: 717, category: 'Gorduras', unit: '100g', emoji: '🧈' },
    { name: 'Castanha do Pará', calories: 656, category: 'Gorduras', unit: '100g', emoji: '🌰' },
    { name: 'Amendoim', calories: 567, category: 'Gorduras', unit: '100g', emoji: '🥜' },
    { name: 'Amêndoas', calories: 579, category: 'Gorduras', unit: '100g', emoji: '🌰' },
    { name: 'Café sem açúcar', calories: 2, category: 'Bebidas', unit: '100ml', emoji: '☕' },
    { name: 'Suco de laranja natural', calories: 45, category: 'Bebidas', unit: '100ml', emoji: '🧃' },
    { name: 'Refrigerante', calories: 42, category: 'Bebidas', unit: '100ml', emoji: '🥤' },
    { name: 'Água de coco', calories: 19, category: 'Bebidas', unit: '100ml', emoji: '🥥' },
    { name: 'Açúcar', calories: 387, category: 'Outros', unit: '100g', emoji: '🍬' },
    { name: 'Mel', calories: 304, category: 'Outros', unit: '100g', emoji: '🍯' },
    { name: 'Chocolate ao leite', calories: 535, category: 'Outros', unit: '100g', emoji: '🍫' },
    { name: 'Pipoca sem manteiga', calories: 387, category: 'Outros', unit: '100g', emoji: '🍿' }
  ];

  const [workoutData, setWorkoutData] = useState(() => {
    const savedData = localStorage.getItem('titanFitnessWorkoutData');
    return savedData ? JSON.parse(savedData) : {};
  });

  const [assessmentMode, setAssessmentMode] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const [calorieTracking, setCalorieTracking] = useState(() => {
    const savedData = localStorage.getItem('titanFitnessCalorieTracking');
    return savedData ? JSON.parse(savedData) : {
      enabled: false,
      dailyGoal: 2000,
      consumed: 0,
      meals: []
    };
  });
  
  const [history, setHistory] = useState(() => {
    const savedData = localStorage.getItem('titanFitnessHistory');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isTraining, setIsTraining] = useState(false); // Novo estado para treino ao vivo
  const [exerciseGif, setExerciseGif] = useState(''); // Estado para o GIF

  // Efeito para persistir os dados no localStorage sempre que eles mudarem
  useEffect(() => {
    if (userData.hasProfile) {
      localStorage.setItem('titanFitnessUserData', JSON.stringify(userData));
    }
    localStorage.setItem('titanFitnessWorkoutData', JSON.stringify(workoutData));
    localStorage.setItem('titanFitnessCalorieTracking', JSON.stringify(calorieTracking));
    localStorage.setItem('titanFitnessHistory', JSON.stringify(history));
  }, [userData, workoutData, calorieTracking, history]);

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const textSec = darkMode ? 'text-gray-400' : 'text-gray-600';
  const primaryColor = 'text-orange-500';

  const calculateTMB = useMemo(() => {
    if (!userData.weight || !userData.height || !userData.age) return 2500;
    
    // Fórmula de Harris-Benedict simplificada (assumindo gênero masculino para exemplo)
    const tmb = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * userData.age);
    
    if (userData.goal === 'weight_loss') {
      return Math.round(tmb * 1.2 - 500); // Déficit calórico leve
    } else {
      return Math.round(tmb * 1.5 + 300); // Superávit calórico leve
    }
  }, [userData.weight, userData.height, userData.age, userData.goal]);

  const startAssessment = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseGif(getExerciseGif(exercise.id)); // <--- CARREGA O GIF
    setAssessmentMode(true);
  };

  // Alterada para 5 Séries e Dia 7 de Reavaliação
  const generateWorkoutPlan = (maxReps, exerciseId) => {
    const days = [];
    let currentReps = maxReps;
    
    // Se for prancha (baseado em tempo), o valor inicial é o maxReps, mas usaremos a metade para o treino
    if (exercises.find(ex => ex.id === exerciseId)?.isTimeBased) {
        currentReps = Math.floor(maxReps * 0.5); 
        if (currentReps < 10) currentReps = 10;
    } else {
        currentReps = Math.floor(maxReps * 0.6);
        if (currentReps < 5) currentReps = 5;
    }


    for (let i = 1; i <= 7; i++) {
      if (i === 7) { // Dia 7 é o dia de reavaliação
         days.push({
          day: i,
          type: 'reavaliacao',
          completed: false
        });
      } else if (i % 2 === 1) { // Dias de treino (1, 3, 5)
        days.push({
          day: i,
          sets: 5, // <--- ALTERADO DE 3 PARA 5 SÉRIES
          reps: currentReps + Math.floor((i - 1) * 0.25), // Progressão para dias de treino
          rest: 60,
          type: 'treino',
          completed: false
        });
      } else { // Dias de descanso (2, 4, 6)
        days.push({
          day: i,
          type: 'descanso'
        });
      }
    }
    return days;
  };

  const completeAssessment = (reps) => {
    if (reps <= 0) return;

    const newWorkoutData = {
      ...workoutData,
      [selectedExercise.id]: {
        currentLevel: 1,
        maxReps: reps,
        history: [{date: new Date().toISOString(), reps}],
        plan: generateWorkoutPlan(reps, selectedExercise.id) // Passa o ID
      }
    };
    setWorkoutData(newWorkoutData);
    setAssessmentMode(false);
  };

  const logWorkoutCompletion = (exerciseId, repsCompleted, isReassessment = false) => {
    const today = new Date().toISOString().split('T')[0];
    const exerciseData = workoutData[exerciseId];

    if (!exerciseData) return;

    // Atualiza o histórico geral e do exercício
    const newEntry = { 
      date: today, 
      exerciseId: exerciseId, 
      reps: repsCompleted,
      level: exerciseData.currentLevel 
    };
    setHistory([...history, newEntry]);
    
    const updatedHistory = [...exerciseData.history, newEntry];
    
    // Marca o dia de hoje como completo (treino ou reavaliação)
    const todayDay = new Date().getDay() + 1; // 1=Dom...7=Sáb
    const updatedPlan = exerciseData.plan.map(day => 
      day.day === todayDay ? { ...day, completed: true } : day
    );

    // Lógica simples de progressão de nível / reavaliação
    let newLevel = exerciseData.currentLevel;
    let newMaxReps = exerciseData.maxReps;
    let newPlan = updatedPlan;

    if (repsCompleted > exerciseData.maxReps * 1.1 || isReassessment) { // 10% de aumento ou reavaliação
      newMaxReps = repsCompleted;
      newLevel += 1;
      newPlan = generateWorkoutPlan(newMaxReps, exerciseId); // Gera novo plano!
    }
    
    setWorkoutData({
      ...workoutData,
      [exerciseId]: {
        ...exerciseData,
        currentLevel: newLevel,
        maxReps: newMaxReps,
        history: updatedHistory,
        plan: newPlan
      }
    });
    
    setCurrentView('home');
  };
  
  // Nova função para marcar um dia do plano como concluído
  const markPlanDayAsCompleted = (exerciseId, dayNumber) => {
    const exerciseData = workoutData[exerciseId];
    if (!exerciseData) return;

    const todayPlan = exerciseData.plan.find(day => day.day === dayNumber);
    if (!todayPlan) return;
    
    // Se for reavaliação, forçar o usuário a ir para a tela de avaliação
    if (todayPlan.type === 'reavaliacao' && !todayPlan.completed) {
        setSelectedExercise(exercises.find(ex => ex.id === exerciseId));
        setExerciseGif(getExerciseGif(exerciseId));
        setAssessmentMode(true);
        setCurrentView('assessment');
        return;
    }
    
    // Apenas treinos podem ser marcados como concluídos (não descanso, não já concluído)
    if (todayPlan.type !== 'treino' || todayPlan.completed) return; 
    
    // Ações para marcar um treino normal
    if (todayPlan.type === 'treino' && !todayPlan.completed) {
      // Cria uma entrada de histórico genérica (reps 0) apenas para marcar como feito
      const today = new Date().toISOString().split('T')[0];
      const newEntry = { 
        date: today, 
        exerciseId: exerciseId, 
        reps: 0, 
        level: exerciseData.currentLevel 
      };
      setHistory([...history, newEntry]);
      
      const updatedPlan = exerciseData.plan.map(day => 
        day.day === dayNumber ? { ...day, completed: true } : day
      );
      
      setWorkoutData({
        ...workoutData,
        [exerciseId]: {
          ...exerciseData,
          plan: updatedPlan
        }
      });
    }
  };


  // --- SUB-COMPONENTES DE VISUALIZAÇÃO ---

  const ProfileSetup = () => (
    <div className={`min-h-screen ${bg} ${text} p-6 flex items-center justify-center`}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-3xl font-extrabold mb-2">Bem-vindo ao Titan Fitness</h1>
          <p className={textSec}>Configure seu perfil para começar sua jornada!</p>
        </div>

        <div className={`${cardBg} rounded-3xl p-8 space-y-5 shadow-2xl`}>
          <div>
            <label className={`block mb-2 text-sm font-semibold ${primaryColor}`}>Nome</label>
            <input
              type="text"
              className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-gray-100'} border border-transparent focus:border-orange-500 outline-none transition`}
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block mb-2 text-sm font-semibold ${primaryColor}`}>Idade</label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-gray-100'} text-center`}
                value={userData.age}
                onChange={(e) => setUserData({...userData, age: parseInt(e.target.value) || ''})}
                placeholder="25"
              />
            </div>
            <div>
              <label className={`block mb-2 text-sm font-semibold ${primaryColor}`}>Peso (kg)</label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-gray-100'} text-center`}
                value={userData.weight}
                onChange={(e) => setUserData({...userData, weight: parseFloat(e.target.value) || ''})}
                placeholder="70"
              />
            </div>
            <div>
              <label className={`block mb-2 text-sm font-semibold ${primaryColor}`}>Altura (cm)</label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-gray-100'} text-center`}
                value={userData.height}
                onChange={(e) => setUserData({...userData, height: parseFloat(e.target.value) || ''})}
                placeholder="175"
              />
            </div>
          </div>

          <div>
            <label className={`block mb-3 text-sm font-semibold ${primaryColor}`}>Objetivo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserData({...userData, goal: 'muscle'})}
                className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                  userData.goal === 'muscle'
                    ? 'border-blue-500 bg-blue-500/30 text-white'
                    : `border-gray-600 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textSec}`
                }`}
              >
                <div className="text-3xl mb-2">💪</div>
                <div className="font-bold">Ganhar Massa</div>
              </button>
              <button
                onClick={() => setUserData({...userData, goal: 'weight_loss'})}
                className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                  userData.goal === 'weight_loss'
                    ? 'border-orange-500 bg-orange-500/30 text-white'
                    : `border-gray-600 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textSec}`
                }`}
              >
                <div className="text-3xl mb-2">🔥</div>
                <div className="font-bold">Perder Peso</div>
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              if (userData.name && userData.age && userData.weight && userData.height) {
                setUserData({...userData, hasProfile: true});
                setCalorieTracking({...calorieTracking, dailyGoal: calculateTMB, enabled: true});
                setCurrentView('home');
              }
            }}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-extrabold text-lg hover:shadow-lg transition-all transform hover:scale-[1.01]"
            disabled={!userData.name || !userData.age || !userData.weight || !userData.height}
          >
            Começar Jornada
          </button>
        </div>
      </div>
    </div>
  );

  const HomeView = () => {
    const today = new Date().getDay() + 1; // 1 (Domingo) a 7 (Sábado)
    const todayExercisePlan = exercises.find(ex => workoutData[ex.id]?.plan.find(day => day.day === today && (day.type === 'treino' || day.type === 'reavaliacao') && !day.completed));
    const todayExercise = todayExercisePlan ? exercises.find(ex => ex.id === todayExercisePlan.exerciseId || ex.id === todayExercisePlan.id) : null;

    return (
      <div className={`min-h-screen ${bg} ${text}`}>
        <div className="p-4 pb-24 max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-6 pt-2">
            <div>
              <h1 className="text-3xl font-bold">Titan Fitness</h1>
              <p className={textSec}>Olá, {userData.name || 'Atleta'}! 💪</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className={`p-2 rounded-full ${cardBg} hover:bg-gray-700/50 transition`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Card de Progresso */}
          <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-xl border-t-4 border-orange-500`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">Seu Progresso Hoje</h3>
                  <p className={`text-sm ${textSec}`}>Meta: {calculateTMB} kcal</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('calories')}
                className={`${primaryColor} hover:text-orange-400`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center mb-4">
              <div className={`text-4xl font-extrabold ${calorieTracking.consumed > calculateTMB ? 'text-red-500' : 'text-orange-500'}`}>
                {calorieTracking.consumed} kcal
              </div>
            </div>
            <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{ width: `${Math.min((calorieTracking.consumed / calculateTMB) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm font-semibold">
              <span>Consumido</span>
              <span className={textSec}>Restantes: {Math.max(0, calculateTMB - calorieTracking.consumed)}</span>
            </div>
          </div>

          {/* Card de Treino do Dia */}
          {todayExercise && todayExercisePlan ? (
            <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-xl border-l-4 ${todayExercisePlan.type === 'reavaliacao' ? 'border-red-500' : 'border-blue-500'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${todayExercisePlan.type === 'reavaliacao' ? 'text-red-500' : 'text-blue-500'}`} />
                {todayExercisePlan.type === 'reavaliacao' ? 'Dia de Reavaliação' : `Treino do Dia (${new Date().toLocaleDateString('pt-BR', {weekday: 'long'})})`}
              </h2>
              <button
                onClick={() => { setSelectedExercise(todayExercise); setCurrentView('workout'); }}
                className="w-full text-left p-4 bg-blue-500/20 rounded-xl flex items-center justify-between hover:bg-blue-500/30 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-lg">{todayExercise.name}</h3>
                  <p className={`text-sm ${todayExercisePlan.type === 'reavaliacao' ? 'text-red-400' : 'text-blue-400'}`}>
                    {todayExercisePlan.type === 'reavaliacao' 
                        ? 'Teste de força máxima' 
                        : `${todayExercisePlan.sets} séries de ${todayExercisePlan.reps} ${todayExercise.isTimeBased ? 'segundos' : 'repetições'}`
                    }
                  </p>
                </div>
                <Play className="w-6 h-6 text-blue-500" />
              </button>
            </div>
          ) : (
             <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-xl text-center border-l-4 border-gray-500`}>
               <h2 className="text-xl font-bold mb-2">Dia de Descanso</h2>
               <p className={textSec}>A recuperação é essencial para o crescimento muscular. Relaxe! 🧘</p>
             </div>
          )}


          {/* Seção de Exercícios */}
          <h2 className="text-xl font-bold mb-4">Explore os Exercícios</h2>
          
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => {
                  if (workoutData[exercise.id]) {
                    setSelectedExercise(exercise);
                    setCurrentView('workout');
                  } else {
                    startAssessment(exercise);
                    setCurrentView('assessment');
                  }
                }}
                className={`w-full ${cardBg} rounded-2xl p-4 shadow-md hover:scale-[1.02] transition-transform flex items-center justify-between border-b-2 border-orange-500/50`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${exercise.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {exercise.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{exercise.name}</h3>
                    <p className={`text-sm ${textSec}`}>{exercise.target}</p>
                    {workoutData[exercise.id] ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs text-yellow-500 font-semibold">
                          Nível {workoutData[exercise.id].currentLevel}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-red-400 font-medium">Fazer Avaliação Inicial</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6" />
              </button>
            ))}
          </div>

        </div>

        {/* Modal de Configurações */}
        {settingsOpen && <SettingsModal />}

        <BottomNav />
      </div>
    );
  };
  
  // Novo Componente de Modal de Treino ao Vivo
  const LiveWorkoutModal = ({ exercise, plan, onClose, onComplete }) => {
    const isTimeBased = exercise.isTimeBased;
    const [counter, setCounter] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [setsCompleted, setSetsCompleted] = useState(0);
    const [message, setMessage] = useState('Inicie a primeira série!');
    
    // Timer: Contador para Reps ou Tempo
    useEffect(() => {
      let interval = null;
      if (isActive) {
        interval = setInterval(() => {
          setCounter(c => c + 1);
        }, 1000);
      } else if (!isActive && counter !== 0) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isActive]);

    // Lógica do Treino
    const startSet = () => {
      setCounter(0);
      setIsActive(true);
      setMessage(`Série ${setsCompleted + 1} de ${plan.sets} em andamento...`);
    };
    
    const endSet = () => {
      setIsActive(false);
      
      const totalRepsOrTime = isTimeBased ? counter : counter; // No caso de Reps, o usuário dirá o total
      
      if (setsCompleted + 1 >= plan.sets) {
          setMessage('Treino concluído! Registre o total de reps/tempo no campo abaixo.');
          // Finaliza e prepara para registro
          setSetsCompleted(setsCompleted + 1);
          return;
      }
      
      setSetsCompleted(setsCompleted + 1);
      setMessage(`Série ${setsCompleted + 1} concluída! Descanse por ${plan.rest} segundos.`);
      
      // Reinicia automaticamente após o descanso (opcional)
      setTimeout(() => {
          setMessage(`Hora de começar a Série ${setsCompleted + 2}!`);
      }, plan.rest * 1000);
    };
    
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col items-center justify-center p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-white p-3 rounded-full bg-gray-700/50 hover:bg-gray-700">
            <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-orange-500 mb-2">{exercise.name} - Treino</h2>
            <p className="text-lg text-white">{plan.sets} Séries de {isTimeBased ? `${plan.reps}s (sugestão)` : `${plan.reps} Reps (sugestão)`}</p>
            <p className="text-sm text-gray-400 mt-1">Série: {setsCompleted}/{plan.sets}</p>
        </div>
        
        {/* GIF de Animação */}
        <div className="w-full max-w-sm h-60 mb-8 rounded-xl overflow-hidden shadow-2xl border-4 border-orange-500">
            {exerciseGif ? (
                <img 
                    src={exerciseGif} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                    [attachment_0](attachment)
                </div>
            )}
        </div>
        
        {/* Contador */}
        <div className={`text-7xl font-mono font-extrabold mb-8 ${isActive ? 'text-green-400' : 'text-orange-500'}`}>
            {isTimeBased ? formatTime(counter) : counter}
            {!isTimeBased && <span className="text-2xl ml-2 text-gray-400">Reps Contadas</span>}
            {isTimeBased && <span className="text-2xl ml-2 text-gray-400">Tempo</span>}
        </div>
        
        {/* Mensagem e Botões */}
        <div className="text-center w-full max-w-sm">
            <p className="text-white mb-4 h-10 flex items-center justify-center font-semibold">{message}</p>
            
            <div className="flex gap-4">
                <button
                    onClick={() => isActive ? endSet() : startSet()}
                    className={`flex-1 text-white py-4 rounded-xl font-extrabold text-lg transition-all shadow-lg 
                        ${isActive 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                    disabled={setsCompleted >= plan.sets}
                >
                    {isActive ? (isTimeBased ? 'Parar Série' : 'Série Concluída') : 'Iniciar Série'}
                </button>
            </div>
            
            {setsCompleted >= plan.sets && (
                <button 
                    onClick={() => onComplete(isTimeBased ? counter : 0)} // Para tempo, passa o valor. Para reps, o usuário registra.
                    className="w-full bg-blue-600 text-white py-3 mt-4 rounded-xl font-bold hover:bg-blue-700"
                >
                    Finalizar Treino
                </button>
            )}
            
        </div>
      </div>
    );
  };


  const AssessmentView = () => {
    const [reps, setReps] = useState('');

    return (
      <div className={`min-h-screen ${bg} ${text} p-6 pb-24`}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              setCurrentView('home');
              setAssessmentMode(false);
            }}
            className={`${primaryColor} text-lg font-semibold`}
          >
            ← Voltar
          </button>
        </div>

        <div className="max-w-md mx-auto">
          <div className={`w-28 h-28 mx-auto mb-6 bg-gradient-to-br ${selectedExercise?.color} rounded-full flex items-center justify-center text-6xl shadow-2xl`}>
            {selectedExercise?.icon}
          </div>

          <h1 className="text-3xl font-extrabold text-center mb-2">{selectedExercise?.name}</h1>
          <p className={`text-center ${textSec} mb-8`}>Avaliação Inicial: Teste de Força Máxima</p>

          <div className={`${cardBg} rounded-3xl p-8 mb-6 shadow-xl`}>
            <h3 className="font-bold text-xl mb-4 text-orange-500">Instruções</h3>
            <p className={`${textSec} mb-6 leading-relaxed`}>
              Faça o máximo de <span className="font-bold text-white">{selectedExercise?.name.toLowerCase()}</span> que conseguir, mantendo a forma correta, <span className="text-red-400">até a falha técnica</span>. Este número será a base do seu plano de treino.
            </p>
            
            {exerciseGif && (
                <div className="mb-6 w-full h-40 rounded-xl overflow-hidden shadow-xl border-2 border-gray-700">
                    <img src={exerciseGif} alt={`Animação de ${selectedExercise?.name}`} className="w-full h-full object-cover"/>
                </div>
            )}


            <div className="mb-8">
              <label className={`block mb-3 font-extrabold text-lg ${primaryColor}`}>
                {selectedExercise?.isTimeBased ? 'Tempo Máximo (segundos)' : 'Repetições Máximas'}
              </label>
              <input
                type="number"
                className={`w-full p-5 rounded-xl text-center text-3xl font-extrabold ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-2 border-transparent focus:border-orange-500 outline-none transition`}
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
                min="1"
              />
            </div>

            <button
              onClick={() => {
                const repValue = parseInt(reps);
                if (repValue > 0) {
                  // Se o dia 7 foi concluído, faz a reavaliação
                  const todayDay = new Date().getDay() + 1;
                  const isReassessment = todayDay === 7 && workoutData[selectedExercise.id]?.plan.find(day => day.day === 7 && day.type === 'reavaliacao' && !day.completed);
                  
                  if (isReassessment) {
                    logWorkoutCompletion(selectedExercise.id, repValue, true); // True para forçar a reavaliação/novo plano
                  } else {
                    completeAssessment(repValue); // Primeira avaliação
                  }
                  setCurrentView('workout');
                }
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-extrabold text-lg transition-all hover:shadow-2xl"
              disabled={!reps || parseInt(reps) <= 0}
            >
              {workoutData[selectedExercise?.id] ? 'Atualizar Plano de Treino' : 'Gerar Plano de Treino'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const WorkoutView = () => {
    const exerciseData = workoutData[selectedExercise?.id];
    const [repsCompleted, setRepsCompleted] = useState('');
    const [isTrainingLive, setIsTrainingLive] = useState(false); // Novo estado

    const today = new Date().getDay() + 1;
    const todayPlan = exerciseData?.plan.find(day => day.day === today && (day.type === 'treino' || day.type === 'reavaliacao'));
    
    // Se for dia de reavaliação e não concluído, redireciona para a AssessmentView
    if (todayPlan?.type === 'reavaliacao' && !todayPlan.completed) {
        setAssessmentMode(true);
        // Não muda o currentView aqui para evitar loop, o botão na Home já faz isso.
    }
    
    if (!exerciseData) {
      return (
        <div className={`min-h-screen ${bg} ${text} p-6`}>
          <p className="text-red-500">Erro: Dados do treino não encontrados. Faça uma avaliação inicial.</p>
          <button onClick={() => setCurrentView('home')} className="mt-4 bg-orange-500 text-white p-3 rounded-lg">Voltar</button>
        </div>
      );
    }
    
    if (isTrainingLive && todayPlan.type === 'treino') {
      return (
        <LiveWorkoutModal 
          exercise={selectedExercise} 
          plan={todayPlan} 
          onClose={() => setIsTrainingLive(false)}
          onComplete={(finalCount) => {
              setIsTrainingLive(false);
              // Para exercícios baseados em repetições, o usuário registra o total. Para tempo, o contador é o total.
              if (selectedExercise.isTimeBased) {
                  setRepsCompleted(finalCount.toString()); 
              }
              setCurrentView('workout'); // Volta para a WorkoutView para o registro final
          }}
        />
      );
    }


    return (
      <div className={`min-h-screen ${bg} ${text} p-6 pb-24`}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`${primaryColor} text-lg font-semibold`}
          >
            ← Voltar
          </button>
        </div>

        <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${selectedExercise?.color} rounded-2xl flex items-center justify-center text-5xl shadow-xl`}>
          {selectedExercise?.icon}
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-2">{selectedExercise?.name}</h1>
        <p className={`text-center ${textSec} mb-8 font-medium`}>
          Nível {exerciseData.currentLevel} • Recorde: {exerciseData.maxReps} {selectedExercise.isTimeBased ? 'segundos' : 'reps'}
        </p>

        {/* Treino de Hoje / Reavaliação */}
        {todayPlan && !todayPlan.completed && todayPlan.type !== 'descanso' && (
          <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-2xl border-b-4 ${todayPlan.type === 'reavaliacao' ? 'border-red-500' : 'border-blue-500'}`}>
            <h3 className="font-bold text-xl mb-4 text-blue-400">
                {todayPlan.type === 'reavaliacao' ? 'REAVALIAÇÃO DO DIA' : 'Treino Sugerido para Hoje'}
            </h3>
            
            {todayPlan.type === 'treino' && (
                <div className="flex justify-around text-center mb-6">
                  <div>
                    <div className="text-3xl font-extrabold text-orange-500">{todayPlan.sets}</div>
                    <div className={textSec}>Séries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-orange-500">{todayPlan.reps}</div>
                    <div className={textSec}>{selectedExercise.isTimeBased ? 'Segs (por série)' : 'Reps (por série)'}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-orange-500">{todayPlan.rest}s</div>
                    <div className={textSec}>Descanso</div>
                  </div>
                </div>
            )}
            
            {todayPlan.type === 'reavaliacao' && (
                 <p className="text-center text-red-400 font-semibold text-lg mb-6">
                     Hoje é dia de testar seu MÁXIMO e gerar um novo plano!
                 </p>
            )}

            {/* Botão de Treino Interativo (apenas para treinos) */}
            {todayPlan.type === 'treino' && (
                <button
                  onClick={() => setIsTrainingLive(true)} 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 mt-5 rounded-xl font-extrabold text-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Iniciar Treino Interativo
                  </div>
                </button>
            )}
            
            {/* Campo de Registro Manual */}
            <div className="pt-4 border-t border-gray-700 mt-5">
              <label className={`block mb-3 font-extrabold text-lg ${primaryColor}`}>
                {todayPlan.type === 'reavaliacao' 
                    ? `Total de ${selectedExercise.isTimeBased ? 'Segundos' : 'Repetições'} (Reavaliação)`
                    : `Total de ${selectedExercise.isTimeBased ? 'Segundos' : 'Repetições'} (Treino)`
                }
              </label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl text-center text-2xl font-extrabold ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-2 border-transparent focus:border-orange-500 outline-none transition`}
                value={repsCompleted}
                onChange={(e) => setRepsCompleted(e.target.value)}
                placeholder={selectedExercise.isTimeBased ? 'Ex: 120 (Segs)' : 'Ex: 50 (Reps)'}
                min="1"
              />
            </div>

            <button
              onClick={() => {
                const reps = parseInt(repsCompleted);
                if (reps > 0) {
                   logWorkoutCompletion(selectedExercise.id, reps, todayPlan.type === 'reavaliacao');
                }
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 mt-5 rounded-xl font-extrabold text-lg transition-all hover:shadow-2xl"
              disabled={!repsCompleted || parseInt(repsCompleted) <= 0}
            >
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                {todayPlan.type === 'reavaliacao' ? 'Gerar Novo Plano' : 'Marcar Como Concluído'}
              </div>
            </button>
            
          </div>
        )}
        
        {todayPlan && todayPlan.completed && (
          <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-2xl text-center border-b-4 border-green-500`}>
            <h3 className="font-extrabold text-xl text-green-500 mb-2">{todayPlan.type === 'reavaliacao' ? 'Reavaliação Concluída!' : 'Treino de Hoje Concluído!'}</h3>
            <p className={textSec}>Retorne amanhã ou descanse.</p>
          </div>
        )}

        <h3 className="font-bold text-xl mb-4 text-white">Plano Semanal</h3>
        
        <div className="space-y-3">
          {exerciseData.plan.map((day, index) => (
            <button
              key={index}
              onClick={() => {
                 if (day.type !== 'descanso') {
                    markPlanDayAsCompleted(selectedExercise.id, day.day);
                 }
              }}
              className={`w-full text-left ${cardBg} rounded-xl p-4 flex items-center justify-between shadow-md transition-all 
                  ${day.type === 'descanso' 
                      ? 'opacity-70' 
                      : day.completed 
                          ? 'border-l-4 border-green-500 bg-green-500/10' 
                          : 'hover:border-l-4 hover:border-orange-500'
                  }`}
              disabled={day.type === 'descanso' || day.completed || (day.type === 'reavaliacao' && !assessmentMode)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.type === 'treino' && !day.completed ? 'bg-blue-500/20 text-blue-500' 
                    : day.type === 'reavaliacao' && !day.completed ? 'bg-red-500/20 text-red-500'
                    : day.completed ? 'bg-green-500/20 text-green-500' 
                    : 'bg-gray-600/20 text-gray-500'
                } font-bold text-sm`}>
                    {day.day}
                </div>
                <div>
                  <div className="font-bold">Dia {day.day}</div>
                  {day.type === 'treino' ? (
                    <div className={`text-sm ${textSec}`}>
                      {day.sets} séries × {day.reps} {selectedExercise.isTimeBased ? 'segs' : 'reps'}
                    </div>
                  ) : day.type === 'reavaliacao' ? (
                    <div className={`text-sm text-red-400 font-semibold`}>REAVALIAÇÃO! 📝</div>
                  ) : (
                    <div className={`text-sm ${textSec}`}>Descanso Ativo</div>
                  )}
                </div>
              </div>
              {day.type === 'treino' && day.completed && <span className="text-green-500 font-bold">FEITO ✅</span>}
              {day.type === 'reavaliacao' && day.completed && <span className="text-green-500 font-bold">REAVALIADO ✅</span>}
              {day.type === 'descanso' && <div className="text-xl">😴</div>}
            </button>
          ))}
        </div>
      </div>
    );
  };


  const CaloriesView = () => {
    // ... (Mantém a implementação original do CaloriesView)
    const [mealName, setMealName] = useState('');
    const [mealCalories, setMealCalories] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const filteredFood = foodDatabase.filter(food => 
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addMeal = () => {
      if (mealName && mealCalories && parseInt(mealCalories) > 0) {
        const newMeal = {
          id: Date.now(),
          name: mealName,
          calories: parseInt(mealCalories),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setCalorieTracking({
          ...calorieTracking,
          consumed: calorieTracking.consumed + parseInt(mealCalories),
          meals: [...calorieTracking.meals, newMeal]
        });
        
        setMealName('');
        setMealCalories('');
        setIsSearching(false);
        setSearchQuery('');
      }
    };
    
    const selectFood = (food) => {
      setMealName(food.name);
      setMealCalories(food.calories.toString());
      setIsSearching(false);
      setSearchQuery(food.name);
    }

    return (
      <div className={`min-h-screen ${bg} ${text} p-6 pb-24`}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`${primaryColor} text-lg font-semibold`}
          >
            ← Voltar
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Contador de Calorias</h1>
            <p className={textSec}>Mantenha-se no caminho certo para o seu objetivo!</p>
          </div>
        </div>

        {/* Medidor de Meta */}
        <div className={`${cardBg} rounded-3xl p-6 mb-8 shadow-xl`}>
          <div className="text-center mb-4">
            <div className={`text-5xl font-extrabold mb-2 ${calorieTracking.consumed > calculateTMB ? 'text-red-500' : 'text-orange-500'}`}>{calorieTracking.consumed}</div>
            <div className={textSec}>de <span className="font-bold text-white">{calculateTMB} kcal</span> (Meta Diária)</div>
          </div>
          <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
              style={{ width: `${Math.min((calorieTracking.consumed / calculateTMB) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm font-semibold">
            <span>{calorieTracking.consumed} kcal</span>
            <span className={textSec}>Restantes: {Math.max(0, calculateTMB - calorieTracking.consumed)}</span>
          </div>
        </div>

        {/* Adicionar Refeição */}
        <div className={`${cardBg} rounded-3xl p-6 mb-8 shadow-xl`}>
          <h3 className="font-extrabold text-xl mb-4 text-orange-500">Adicionar Refeição</h3>
          
          {/* Campo de Pesquisa */}
          <div className="relative mb-3">
              <input
                type="text"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-2 border-transparent focus:border-orange-500 outline-none transition`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setMealName(e.target.value); 
                  setIsSearching(true);
                }}
                placeholder="Buscar ou digitar nome do alimento (Ex: Frango)"
              />
              {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setMealName(''); setIsSearching(false); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <X className="w-5 h-5" />
                  </button>
              )}
          </div>
          
          {/* Resultados da Pesquisa */}
          {isSearching && searchQuery.length > 1 && (
            <div className={`absolute z-10 w-full max-w-md ${cardBg} rounded-xl shadow-xl max-h-60 overflow-y-auto mb-3`}>
              {filteredFood.slice(0, 5).map((food, index) => (
                <button
                  key={index}
                  onClick={() => selectFood(food)}
                  className={`w-full text-left p-3 flex justify-between items-center hover:bg-orange-500/20 ${index < filteredFood.length - 1 ? 'border-b border-gray-700/50' : ''}`}
                >
                  <div>
                    <span className="font-semibold mr-2">{food.emoji} {food.name}</span>
                    <span className="text-xs text-gray-500">({food.category})</span>
                  </div>
                  <span className="text-sm text-orange-400 font-bold">{food.calories} kcal/{food.unit}</span>
                </button>
              ))}
              {filteredFood.length === 0 && <div className="p-3 text-center text-sm text-gray-500">Nenhum alimento encontrado. Digite manualmente abaixo.</div>}
            </div>
          )}


          <div className="flex gap-3">
            <input
              type="number"
              className={`flex-1 p-4 rounded-xl text-center font-bold ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-2 border-transparent focus:border-orange-500 outline-none transition`}
              value={mealCalories}
              onChange={(e) => setMealCalories(e.target.value)}
              placeholder="Calorias (kcal)"
              min="1"
            />
            <button
              onClick={addMeal}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-extrabold hover:shadow-lg transition-all"
              disabled={!mealName || !mealCalories || parseInt(mealCalories) <= 0}
            >
              <div className="flex items-center gap-1">
                <ChevronRight className="w-5 h-5" />
                Adic.
              </div>
            </button>
          </div>
        </div>

        {/* Histórico do Dia */}
        <h3 className="font-extrabold text-xl mb-4 text-white">Histórico de Refeições</h3>
        <div className="space-y-3">
          {calorieTracking.meals.length === 0 ? (
            <div className={`${cardBg} rounded-xl p-6 text-center ${textSec} shadow-md`}>
              Nenhuma refeição registrada hoje.
            </div>
          ) : (
            calorieTracking.meals.slice().reverse().map((meal) => (
              <div key={meal.id} className={`${cardBg} rounded-xl p-4 flex justify-between items-center shadow-md border-l-4 border-orange-500/70`}>
                <div>
                  <div className="font-semibold">{meal.name}</div>
                  <div className={`text-xs ${textSec}`}>{meal.time}</div>
                </div>
                <div className={`${primaryColor} font-extrabold text-lg`}>+{meal.calories} kcal</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  const StatsView = () => {
    // ... (Mantém a implementação original do StatsView)
    const imc = calculateBMI(userData.weight, userData.height);

    const getIMCStatus = (bmi) => {
      if (!bmi) return "Dados insuficientes";
      const b = parseFloat(bmi);
      if (b < 18.5) return "Abaixo do Peso";
      if (b >= 18.5 && b <= 24.9) return "Peso Saudável";
      if (b >= 25.0 && b <= 29.9) return "Sobrepeso";
      if (b >= 30.0) return "Obesidade";
      return "Indefinido";
    }
    
    const totalWorkouts = history.length;
    
    // Contagem de treinos por exercício
    const workoutCounts = history.reduce((acc, curr) => {
        acc[curr.exerciseId] = (acc[curr.exerciseId] || 0) + 1;
        return acc;
    }, {});
    
    const topExerciseId = Object.keys(workoutCounts).reduce((a, b) => (workoutCounts[a] || 0) > (workoutCounts[b] || 0) ? a : b, null);
    const topExercise = exercises.find(ex => ex.id === topExerciseId);
    
    return (
      <div className={`min-h-screen ${bg} ${text} p-6 pb-24`}>
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className={`${primaryColor} text-lg font-semibold`}
          >
            ← Voltar
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Seu Desempenho</h1>
            <p className={textSec}>Acompanhe suas conquistas!</p>
          </div>
        </div>

        {/* IMC e Meta */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`${cardBg} rounded-2xl p-4 text-center shadow-md border-b-4 border-orange-500`}>
            <div className="text-3xl font-extrabold text-orange-500 mb-1">{imc || '--'}</div>
            <div className={textSec}>IMC</div>
            <div className="text-xs mt-1 font-semibold">{getIMCStatus(imc)}</div>
          </div>
          <div className={`${cardBg} rounded-2xl p-4 text-center shadow-md border-b-4 border-blue-500`}>
            <div className="text-3xl font-extrabold text-blue-500 mb-1">
              {userData.goal === 'muscle' ? 'GANHAR' : 'PERDER'}
            </div>
            <div className={textSec}>Objetivo</div>
            <div className="text-xs mt-1 font-semibold">{userData.goal === 'muscle' ? 'Massa Magra' : 'Peso'}</div>
          </div>
        </div>

        {/* Estatísticas de Treino */}
        <h3 className="font-extrabold text-xl mb-4 text-white">Estatísticas do Treino</h3>
        <div className={`${cardBg} rounded-3xl p-6 mb-8 shadow-xl space-y-4`}>
          <div className="flex justify-between items-center border-b border-gray-700/50 pb-3">
            <div className="font-semibold flex items-center gap-2"><Activity className="w-5 h-5 text-orange-500" /> Treinos Completos</div>
            <div className="text-2xl font-extrabold text-orange-500">{totalWorkouts}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-semibold flex items-center gap-2"><Target className="w-5 h-5 text-blue-500" /> Exercício Mais Feito</div>
            <div className="text-lg font-extrabold text-blue-500">{topExercise ? topExercise.name : 'N/A'}</div>
          </div>
        </div>
        
        {/* Histórico Recente */}
        <h3 className="font-extrabold text-xl mb-4 text-white">Histórico Recente</h3>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className={`${cardBg} rounded-xl p-6 text-center ${textSec} shadow-md`}>
              Nenhum treino registrado ainda.
            </div>
          ) : (
            history.slice().reverse().slice(0, 5).map((entry, index) => {
              const exercise = exercises.find(e => e.id === entry.exerciseId);
              return (
                <div key={index} className={`${cardBg} rounded-xl p-4 flex justify-between items-center shadow-md border-l-4 border-orange-500/70`}>
                  <div>
                    <div className="font-semibold">{exercise?.name || 'Treino'}</div>
                    <div className={`text-xs ${textSec}`}>{new Date(entry.date).toLocaleDateString('pt-BR')} • Nível {entry.level}</div>
                  </div>
                  <div className={`text-blue-500 font-extrabold text-lg`}>{entry.reps} {exercise?.isTimeBased ? 'Segs' : 'Reps'}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };
  
  const SettingsModal = () => (
    // ... (Mantém a implementação original do SettingsModal)
    <div className="fixed inset-0 z-50 bg-gray-900/90 flex justify-end">
      <div className={`w-full max-w-sm ${cardBg} h-full p-6 shadow-2xl overflow-y-auto`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Configurações</h2>
          <button onClick={() => setSettingsOpen(false)} className={`${primaryColor} p-2 rounded-full hover:bg-gray-700`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Opção Dark Mode */}
          <div className={`${cardBg} rounded-xl p-4 flex justify-between items-center shadow-md`}>
            <div className="font-semibold flex items-center gap-3">
              {darkMode ? '☀️' : '🌙'} Modo {darkMode ? 'Claro' : 'Escuro'}
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} transition-colors`}
            >
              Trocar
            </button>
          </div>

          {/* Opção de Objetivo */}
          <div className={`${cardBg} rounded-xl p-4 shadow-md`}>
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-orange-500" /> Objetivo Atual</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setUserData({...userData, goal: 'muscle'})}
                className={`p-3 rounded-lg font-semibold transition-all ${
                  userData.goal === 'muscle'
                    ? 'bg-blue-500 text-white'
                    : `bg-gray-700 ${textSec}`
                }`}
              >
                Ganhar Massa
              </button>
              <button
                onClick={() => setUserData({...userData, goal: 'weight_loss'})}
                className={`p-3 rounded-lg font-semibold transition-all ${
                  userData.goal === 'weight_loss'
                    ? 'bg-orange-500 text-white'
                    : `bg-gray-700 ${textSec}`
                }`}
              >
                Perder Peso
              </button>
            </div>
          </div>
          
          {/* Opção Limpar Dados */}
          <button
            onClick={() => {
              if (window.confirm("ATENÇÃO: Isso apagará TODOS os seus dados e progresso (perfíl, treinos, calorias). Deseja continuar?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-5 h-5" />
              Resetar Dados do Aplicativo
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const BottomNav = () => (
    // ... (Mantém a implementação original do BottomNav)
    <div className={`fixed bottom-0 left-0 right-0 ${cardBg} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 shadow-2xl z-40`}>
      <div className="flex justify-around max-w-md mx-auto">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${currentView === 'home' ? 'text-orange-500 bg-orange-500/20' : textSec}`}
        >
          <Activity className="w-6 h-6" />
          <span className="text-xs font-semibold">Treinos</span>
        </button>
        <button
          onClick={() => setCurrentView('stats')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${currentView === 'stats' ? 'text-blue-500 bg-blue-500/20' : textSec}`}
        >
          <BarChart className="w-6 h-6" />
          <span className="text-xs font-semibold">Stats</span>
        </button>
        <button
          onClick={() => setCurrentView('calories')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${currentView === 'calories' ? 'text-orange-500 bg-orange-500/20' : textSec}`}
        >
          <Utensils className="w-6 h-6" />
          <span className="text-xs font-semibold">Nutrição</span>
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${settingsOpen ? 'text-gray-500 bg-gray-500/20' : textSec}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-semibold">Config</span>
        </button>
      </div>
    </div>
  );

  if (!userData.hasProfile) {
    return <ProfileSetup />;
  }

  return (
    <div className={`min-h-screen ${bg} font-sans`}>
      {currentView === 'home' && <HomeView />}
      {currentView === 'assessment' && <AssessmentView />}
      {currentView === 'workout' && <WorkoutView />}
      {currentView === 'calories' && <CaloriesView />}
      {currentView === 'stats' && <StatsView />}
    </div>
  );
};

export default App;
