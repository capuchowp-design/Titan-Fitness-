import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Target, TrendingUp, Bell, Calendar, Utensils, Settings, ChevronRight, Play, Award, Flame, Menu, X, BarChart } from 'lucide-react';

// Função para calcular o Índice de Massa Corporal (IMC)
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightMeters = height / 100;
  return (weight / (heightMeters * heightMeters)).toFixed(1);
};

// Componente Principal
const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: 'muscle',
    hasProfile: false
  });
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: 'muscle'
  });

  const [exercises] = useState([
    { id: 'flexoes', name: 'Flexões', target: 'Peitoral', icon: '💪', color: 'from-red-500 to-orange-500' },
    { id: 'agachamento', name: 'Agachamento', target: 'Quadríceps e Panturrilha', icon: '🦵', color: 'from-blue-500 to-cyan-500' },
    { id: 'prancha', name: 'Prancha', target: 'Abdômen', icon: '🔥', color: 'from-yellow-500 to-orange-500' },
    { id: 'elevacao', name: 'Elevação', target: 'Costas', icon: '⬆️', color: 'from-green-500 to-emerald-500' },
    { id: 'ponte', name: 'Ponte Glútea', target: 'Glúteos e Posterior', icon: '🍑', color: 'from-purple-500 to-pink-500' },
    { id: 'pular_corda', name: 'Pular Corda', target: 'Cardio e Resistência', icon: '🏃', color: 'from-cyan-500 to-blue-500' }
  ]);

  const foodDatabase = [
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
  ]);

  const [workoutData, setWorkoutData] = useState({});
  const [assessmentMode, setAssessmentMode] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const [calorieTracking, setCalorieTracking] = useState({
    enabled: false,
    dailyGoal: 2000,
    consumed: 0,
    meals: []
  });
  
  const [history, setHistory] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Estados para o cronômetro
  const [currentDay, setCurrentDay] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [repsCount, setRepsCount] = useState(0);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('titanFitnessUserData');
    const savedWorkoutData = localStorage.getItem('titanFitnessWorkoutData');
    const savedCalorieData = localStorage.getItem('titanFitnessCalorieTracking');
    const savedHistory = localStorage.getItem('titanFitnessHistory');

    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      setUserData(parsedData);
      setFormData({
        name: parsedData.name || '',
        age: parsedData.age || '',
        weight: parsedData.weight || '',
        height: parsedData.height || '',
        goal: parsedData.goal || 'muscle'
      });
    }
    if (savedWorkoutData) setWorkoutData(JSON.parse(savedWorkoutData));
    if (savedCalorieData) setCalorieTracking(JSON.parse(savedCalorieData));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Persistir dados no localStorage
  useEffect(() => {
    if (userData.hasProfile) {
      localStorage.setItem('titanFitnessUserData', JSON.stringify(userData));
    }
    localStorage.setItem('titanFitnessWorkoutData', JSON.stringify(workoutData));
    localStorage.setItem('titanFitnessCalorieTracking', JSON.stringify(calorieTracking));
    localStorage.setItem('titanFitnessHistory', JSON.stringify(history));
  }, [userData, workoutData, calorieTracking, history]);

  // Efeito para o cronômetro
  useEffect(() => {
    let interval;
    if (isRunning && currentDay?.countType === 'time') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentDay]);

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const textSec = darkMode ? 'text-gray-400' : 'text-gray-600';
  const primaryColor = 'text-orange-500';

  const calculateTMB = useMemo(() => {
    if (!userData.weight || !userData.height || !userData.age) return 2500;
    
    const tmb = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * userData.age);
    
    if (userData.goal === 'weight_loss') {
      return Math.round(tmb * 1.2 - 500);
    } else {
      return Math.round(tmb * 1.5 + 300);
    }
  }, [userData.weight, userData.height, userData.age, userData.goal]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startAssessment = (exercise) => {
    setSelectedExercise(exercise);
    setAssessmentMode(true);
  };

  const generateWorkoutPlan = (maxReps, exerciseId) => {
    const days = [];
    let currentReps = Math.floor(maxReps * 0.6);
    if (currentReps < 5) currentReps = 5;

    const isTimeBased = exerciseId === 'prancha';

    for (let i = 1; i <= 7; i++) {
      if (i % 2 === 1) {
        days.push({
          day: i,
          sets: 5,
          reps: isTimeBased ? 30 : currentReps + Math.floor((i - 1) * 0.25),
          rest: 60,
          type: 'treino',
          completed: false,
          timer: isTimeBased ? 30 : null,
          countType: isTimeBased ? 'time' : 'reps'
        });
      } else {
        days.push({
          day: i,
          type: 'descanso',
          completed: false
        });
      }
    }
    
    days.push({
      day: 8,
      type: 'avaliacao',
      completed: false,
      description: 'Teste de repetições máximas'
    });
    
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
        plan: generateWorkoutPlan(reps, selectedExercise.id)
      }
    };
    setWorkoutData(newWorkoutData);
    setAssessmentMode(false);
  };

  const logWorkoutCompletion = (exerciseId, repsCompleted) => {
    const today = new Date().toISOString().split('T')[0];
    const exerciseData = workoutData[exerciseId];

    if (!exerciseData) return;

    const newEntry = { 
      date: today, 
      exerciseId: exerciseId, 
      reps: repsCompleted,
      level: exerciseData.currentLevel 
    };
    setHistory([...history, newEntry]);
    
    const updatedHistory = [...exerciseData.history, newEntry];
    
    const updatedPlan = exerciseData.plan.map(day => 
      day.type === 'treino' && day.day === new Date().getDay() + 1 ? { ...day, completed: true } : day
    );

    let newLevel = exerciseData.currentLevel;
    let newMaxReps = exerciseData.maxReps;
    let newPlan = updatedPlan;

    if (repsCompleted > exerciseData.maxReps * 1.1) {
      newMaxReps = repsCompleted;
      newLevel += 1;
      newPlan = generateWorkoutPlan(newMaxReps, exerciseId);
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

  // Funções para o cronômetro
  const startTimer = (day) => {
    setCurrentDay(day);
    if (day.countType === 'time') {
      setTimer(0);
      setIsRunning(true);
    } else {
      setRepsCount(0);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (currentDay) {
      const result = currentDay.countType === 'time' ? timer : repsCount;
      completeWorkoutDay(currentDay.day, result);
    }
  };

  const completeWorkoutDay = (dayNumber, result) => {
    const exerciseData = workoutData[selectedExercise?.id];
    if (!exerciseData) return;

    const updatedPlan = exerciseData.plan.map(day => 
      day.day === dayNumber ? { ...day, completed: true, result } : day
    );
    
    setWorkoutData({
      ...workoutData,
      [selectedExercise.id]: {
        ...exerciseData,
        plan: updatedPlan
      }
    });
    
    setCurrentDay(null);
    setIsRunning(false);
    
    // Registrar no histórico
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { 
      date: today, 
      exerciseId: selectedExercise.id, 
      reps: result,
      level: exerciseData.currentLevel,
      type: 'workout'
    };
    setHistory([...history, newEntry]);
  };

  const handleDayClick = (day) => {
    if (day.type === 'treino' && !day.completed) {
      startTimer(day);
    } else if (day.type === 'avaliacao' && !day.completed) {
      setCurrentView('assessment');
    } else if (day.type === 'descanso' && !day.completed) {
      completeWorkoutDay(day.day, 0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block mb-2 text-sm font-semibold ${primaryColor}`}>Idade</label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-gray-100'} text-center`}
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="25"
              />
            </div>
            <div>
              <label className={`block mb-2 text-sm font-semibold ${primaryColor}`}>Peso (kg)</label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-gray-100'} text-center`}
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <label className={`block mb-2 text-sm font-semibold ${primaryColor}`}>Altura (cm)</label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700/70' : 'bg-gray-100'} text-center`}
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="175"
              />
            </div>
          </div>

          <div>
            <label className={`block mb-3 text-sm font-semibold ${primaryColor}`}>Objetivo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleInputChange('goal', 'muscle')}
                className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                  formData.goal === 'muscle'
                    ? 'border-blue-500 bg-blue-500/30 text-white'
                    : `border-gray-600 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textSec}`
                }`}
              >
                <div className="text-3xl mb-2">💪</div>
                <div className="font-bold">Ganhar Massa</div>
              </button>
              <button
                onClick={() => handleInputChange('goal', 'weight_loss')}
                className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                  formData.goal === 'weight_loss'
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
              if (formData.name && formData.age && formData.weight && formData.height) {
                const newUserData = {
                  ...formData,
                  hasProfile: true
                };
                setUserData(newUserData);
                setCalorieTracking({...calorieTracking, dailyGoal: calculateTMB, enabled: true});
                setCurrentView('home');
              }
            }}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-extrabold text-lg hover:shadow-lg transition-all transform hover:scale-[1.01]"
            disabled={!formData.name || !formData.age || !formData.weight || !formData.height}
          >
            Começar Jornada
          </button>
        </div>
      </div>
    </div>
  );

  const HomeView = () => {
    const today = new Date().getDay() + 1;
    const todayExercise = exercises.find(ex => workoutData[ex.id]?.plan?.find(day => day.day === today && day.type === 'treino' && !day.completed));

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
          {todayExercise && workoutData[todayExercise.id] ? (
            <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-xl border-l-4 border-blue-500`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Treino do Dia ({new Date().toLocaleDateString('pt-BR', {weekday: 'long'})})
              </h2>
              <button
                onClick={() => { setSelectedExercise(todayExercise); setCurrentView('workout'); }}
                className="w-full text-left p-4 bg-blue-500/20 rounded-xl flex items-center justify-between hover:bg-blue-500/30 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-lg">{todayExercise.name}</h3>
                  <p className="text-sm text-blue-400">
                    {workoutData[todayExercise.id].plan.find(d => d.day === today).sets} séries de {workoutData[todayExercise.id].plan.find(d => d.day === today).countType === 'time' ? `${workoutData[todayExercise.id].plan.find(d => d.day === today).reps}s` : `${workoutData[todayExercise.id].plan.find(d => d.day === today).reps} repetições`}
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

            <div className="mb-8">
              <label className={`block mb-3 font-extrabold text-lg ${primaryColor}`}>Quantas repetições você completou?</label>
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
                  completeAssessment(repValue);
                  setCurrentView('plan');
                }
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-extrabold text-lg transition-all hover:shadow-2xl"
              disabled={!reps || parseInt(reps) <= 0}
            >
              Gerar Plano de Treino
            </button>
          </div>
        </div>
      </div>
    );
  };

  const WorkoutView = () => {
    const exerciseData = workoutData[selectedExercise?.id];
    const [repsCompleted, setRepsCompleted] = useState('');

    const today = new Date().getDay() + 1;
    const todayPlan = exerciseData?.plan?.find(day => day.day === today && day.type === 'treino');
    
    if (!exerciseData) {
      return (
        <div className={`min-h-screen ${bg} ${text} p-6`}>
          <p className="text-red-500">Erro: Dados do treino não encontrados.</p>
        </div>
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
          Nível {exerciseData.currentLevel} • Recorde: {exerciseData.maxReps} reps
        </p>

        {/* Treino de Hoje */}
        {todayPlan && !todayPlan.completed && (
          <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-2xl border-b-4 border-blue-500`}>
            <h3 className="font-bold text-xl mb-4 text-blue-400">Treino Sugerido para Hoje</h3>
            <div className="flex justify-around text-center mb-6">
              <div>
                <div className="text-3xl font-extrabold text-orange-500">{todayPlan.sets}</div>
                <div className={textSec}>Séries</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-orange-500">
                  {todayPlan.countType === 'time' ? `${todayPlan.reps}s` : todayPlan.reps}
                </div>
                <div className={textSec}>{todayPlan.countType === 'time' ? 'Tempo' : 'Repetições'}</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-orange-500">{todayPlan.rest}s</div>
                <div className={textSec}>Descanso</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <label className={`block mb-3 font-extrabold text-lg ${primaryColor}`}>
                {todayPlan.countType === 'time' ? 'Tempo Concluído (segundos)' : 'Reps Concluídas (Total)'}
              </label>
              <input
                type="number"
                className={`w-full p-4 rounded-xl text-center text-2xl font-extrabold ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-2 border-transparent focus:border-orange-500 outline-none transition`}
                value={repsCompleted}
                onChange={(e) => setRepsCompleted(e.target.value)}
                placeholder={todayPlan.countType === 'time' ? "Ex: 45" : "Ex: 50"}
                min="1"
              />
            </div>

            <button
              onClick={() => logWorkoutCompletion(selectedExercise.id, parseInt(repsCompleted))}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 mt-5 rounded-xl font-extrabold text-lg transition-all hover:shadow-2xl"
              disabled={!repsCompleted || parseInt(repsCompleted) <= 0}
            >
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                Marcar Como Concluído
              </div>
            </button>
          </div>
        )}
        
        {todayPlan && todayPlan.completed && (
          <div className={`${cardBg} rounded-3xl p-6 mb-6 shadow-2xl text-center border-b-4 border-green-500`}>
            <h3 className="font-extrabold text-xl text-green-500 mb-2">Treino de Hoje Concluído!</h3>
            <p className={textSec}>Sua dedicação está valendo a pena. Retorne amanhã ou descanse.</p>
          </div>
        )}

        <button
          onClick={() => setCurrentView('plan')}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 mt-6 rounded-xl font-extrabold text-lg transition-all hover:shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Ver Plano Completo
          </div>
        </button>

        <h3 className="font-bold text-xl mb-4 text-white mt-8">Próximos Dias</h3>
        
        <div className="space-y-3">
          {exerciseData.plan?.slice(0, 7).map((day, index) => (
            <div
              key={index}
              className={`${cardBg} rounded-xl p-4 flex items-center justify-between shadow-md ${day.type === 'descanso' ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.type === 'treino' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-600/20 text-gray-500'
                } font-bold text-sm`}>
                    {day.day}
                </div>
                <div>
                  <div className="font-bold">Dia {day.day}</div>
                  {day.type === 'treino' ? (
                    <div className={`text-sm ${textSec}`}>
                      {day.sets} séries × {day.countType === 'time' ? `${day.reps}s` : `${day.reps} reps`}
                    </div>
                  ) : (
                    <div className={`text-sm ${textSec}`}>Descanso Ativo</div>
                  )}
                </div>
              </div>
              {day.type === 'treino' && day.completed && <span className="text-green-500 font-bold">FEITO</span>}
              {day.type === 'descanso' && <div className="text-xl">😴</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const WorkoutPlanView = () => {
    const exerciseData = workoutData[selectedExercise?.id];

    if (!exerciseData) {
      return (
        <div className={`min-h-screen ${bg} ${text} p-6`}>
          <p className="text-red-500">Erro: Dados do treino não encontrados.</p>
        </div>
      );
    }

    return (
      <div className={`min-h-screen ${bg} ${text} p-6 pb-24`}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentView('workout')}
            className={`${primaryColor} text-lg font-semibold`}
          >
            ← Voltar
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-2">Plano de Treino</h1>
        <p className={`text-center ${textSec} mb-8`}>{selectedExercise?.name}</p>

        {/* Modal do Cronômetro */}
        {currentDay && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-3xl p-6 w-full max-w-md`}>
              <h3 className="text-xl font-bold mb-4 text-center">Executando: {selectedExercise?.name}</h3>
              
              {/* Animação GIF */}
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={`/gifs/${selectedExercise?.id}.gif`} 
                  alt={selectedExercise?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="text-4xl hidden">
                  {selectedExercise?.icon}
                </div>
              </div>
              
              {currentDay.countType === 'time' ? (
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-orange-500 mb-2">{formatTime(timer)}</div>
                  <p className={textSec}>Tempo decorrido</p>
                </div>
              ) : (
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-orange-500 mb-2">{repsCount}</div>
                  <p className={textSec}>Repetições</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <button 
                      onClick={() => setRepsCount(prev => prev + 1)}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold"
                    >
                      +1 Rep
                    </button>
                    <button 
                      onClick={() => setRepsCount(prev => Math.max(0, prev - 1))}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold"
                    >
                      -1 Rep
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={stopTimer}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold"
                >
                  Finalizar
                </button>
                <button 
                  onClick={() => {
                    setIsRunning(false);
                    setCurrentDay(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Dias */}
        <div className="grid grid-cols-2 gap-4">
          {exerciseData.plan?.map((day) => (
            <button
              key={day.day}
              onClick={() => handleDayClick(day)}
              className={`${cardBg} rounded-2xl p-4 text-center shadow-md transition-transform hover:scale-105 ${
                day.completed 
                  ? 'border-b-4 border-green-500' 
                  : day.type === 'avaliacao'
                  ? 'border-b-4 border-yellow-500'
                  : day.type === 'descanso'
                  ? 'border-b-4 border-blue-500'
                  : 'border-b-4 border-orange-500'
              }`}
            >
              <div className="text-2xl font-bold mb-2">Dia {day.day}</div>
              
              {day.type === 'treino' && (
                <>
                  <div className="text-lg font-semibold text-orange-500">
                    {day.sets} × {day.countType === 'time' ? `${day.reps}s` : day.reps}
                  </div>
                  <div className={`text-sm ${textSec}`}>
                    {day.countType === 'time' ? 'Tempo' : 'Repetições'}
                  </div>
                </>
              )}
              
              {day.type === 'descanso' && (
                <>
                  <div className="text-3xl">😴</div>
                  <div className={`text-sm ${textSec}`}>Descanso</div>
                </>
              )}
              
              {day.type === 'avaliacao' && (
                <>
                  <div className="text-3xl">📊</div>
                  <div className={`text-sm ${textSec}`}>Avaliação</div>
                </>
              )}
              
              {day.completed && (
                <div className="text-green-500 text-sm font-bold mt-2">✓ CONCLUÍDO</div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const CaloriesView = () => {
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
    
    const workoutCounts = history.reduce((acc, curr) => {
        acc[curr.exerciseId] = (acc[curr.exerciseId] || 0) + 1;
        return acc;
    }, {});
    
    const topExerciseId = Object.keys(workoutCounts).reduce((a, b) => workoutCounts[a] > workoutCounts[b] ? a : b, null);
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
                  <div className={`text-blue-500 font-extrabold text-lg`}>{entry.reps} {entry.type === 'workout' ? (exercise?.id === 'prancha' ? 'seg' : 'Reps') : 'Reps'}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };
  
  const SettingsModal = () => (
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
          onClick={() => setCurrentView('plan')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${currentView === 'plan' ? 'text-green-500 bg-green-500/20' : textSec}`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs font-semibold">Plano</span>
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
      {currentView === 'plan' && <WorkoutPlanView />}
      {currentView === 'calories' && <CaloriesView />}
      {currentView === 'stats' && <StatsView />}
    </div>
  );
};

export default App;
