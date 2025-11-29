import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Activity, Target, TrendingUp, Bell, Calendar, Utensils, Settings, ChevronRight, Play, Award, Flame, Menu, X, BarChart, Timer, CheckCircle, Circle } from 'lucide-react';

// === FUNÇÕES AUXILIARES ===
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightMeters = height / 100;
  return (weight / (heightMeters * heightMeters)).toFixed(1);
};

// === DADOS DOS EXERCÍCIOS (agora com tipo e animação) ===
const exercises = [
  { id: 'flexoes', name: 'Flexões', target: 'Peitoral', icon: '💪', color: 'from-red-500 to-orange-500', type: 'reps', gif: 'https://i.imgur.com/aoX8.gif' },
  { id: 'agachamento', name: 'Agachamento', target: 'Quadríceps', icon: '🦵', color: 'from-blue-500 to-cyan-500', type: 'reps', gif: 'https://i.imgur.com/agacha.gif' },
  { id: 'prancha', name: 'Prancha', target: 'Abdômen', icon: '🔥', color: 'from-yellow-500 to-orange-500', type: 'time', gif: 'https://i.imgur.com/prancha.gif' },
  { id: 'elevacao', name: 'Elevação Terra', target: 'Costas', icon: '⬆️', color: 'from-green-500 to-emerald-500', type: 'reps', gif: 'https://i.imgur.com/elevacao.gif' },
  { id: 'ponte', name: 'Ponte Glútea', target: 'Glúteos', icon: '🍑', color: 'from-purple-500 to-pink-500', type: 'time', gif: 'https://i.imgur.com/ponte.gif' },
  { id: 'pular_corda', name: 'Pular Corda', target: 'Cardio', icon: '🏃', color: 'from-cyan-500 to-blue-500', type: 'time', gif: 'https://i.imgur.com/pular.gif' }
];

// Banco de alimentos (mantido igual (vou deixar só como referência)
const foodDatabase = [/* ... seu banco atual ... */];

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('titanFitnessUserData');
    return saved ? JSON.parse(saved) : { name: '', age: '', weight: '', height: '', goal: 'muscle', hasProfile: false };
  });

  const [workoutData, setWorkoutData] = useState(() => {
    const saved = localStorage.getItem('titanFitnessWorkoutData');
    return saved ? JSON.parse(saved) : {};
  });

  const [calorieTracking, setCalorieTracking] = useState(() => {
    const saved = localStorage.getItem('titanFitnessCalorieTracking');
    return saved ? JSON.parse(saved) : { enabled: false, dailyGoal: 2000, consumed: 0, meals: [] };
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('titanFitnessHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [assessmentMode, setAssessmentMode] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);

  // FIX 1: Evita que o teclado feche a cada letra (usando ref + autoFocus controlado)
  const inputRefs = useRef({});

  useEffect(() => {
    if (!userData.hasProfile) {
      // Força foco suave após montagem
      setTimeout(() => {
        if (inputRefs.current.name) inputRefs.current.name.focus();
      }, 500);
    }
  }, [userData.hasProfile]);

  // Persistência
  useEffect(() => {
    if (userData.hasProfile) localStorage.setItem('titanFitnessUserData', JSON.stringify(userData));
    localStorage.setItem('titanFitnessWorkoutData', JSON.stringify(workoutData));
    localStorage.setItem('titanFitnessCalorieTracking', JSON.stringify(calorieTracking));
    localStorage.setItem('titanFitnessHistory', JSON.stringify(history));
  }, [userData, workoutData, calorieTracking, history]);

  // Timer para prancha
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (!timerActive && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const textSec = darkMode ? 'text-gray-400' : 'text-gray-600';
  const primary = 'text-orange-500';

  const calculateTMB = useMemo(() => {
    if (!userData.weight || !userData.height || !userData.age) return 2000;
    const tmb = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * userData.age);
    return Math.round(userData.goal === 'weight_loss' ? tmb * 1.2 - 500 : tmb * 1.5 + 300);
  }, [userData]);

  // === GERAR PLANO COM 5 SÉRIES + DIA DE REAVALIAÇÃO A CADA 14 DIAS ===
  const generateWorkoutPlan = (maxRepsOrSeconds) => {
    const days = [];
    let base = Math.floor(maxRepsOrSeconds * 0.7);
    if (base < 8) base = 8;

    for (let i = 1; i <= 21; i++) { // 3 semanas
      if (i === 14) { // Dia 14 = reavaliação
        days.push({ day: i, type: 'reassess', exerciseId: selectedExercise.id });
      } else if (i % 2 === 1) {
        days.push({
          day: i,
          type: 'workout',
          sets: 5, // FIX 2: 5 séries
          target: Math.round(base + (i-1)/2 * 1.5),
          rest: 90,
          completed: false
        });
      } else {
        days.push({ day: i, type: 'rest' });
      }
    }
    return days;
  };

  const startAssessment = (ex) => {
    setSelectedExercise(ex);
    setAssessmentMode(true);
    setCurrentView('assessment');
  };

  const completeAssessment = (value) => {
    const isTimeBased = selectedExercise.type === 'time';
    const newPlan = generateWorkoutPlan(value);

    setWorkoutData(prev => ({
      ...prev,
      [selectedExercise.id]: {
        currentLevel: 1,
        max: value,
        history: [{ date: new Date().toISOString(), value }],
        plan: newPlan
      }
    }));
    setAssessmentMode(false);
    setSelectedExercise(selectedExercise);
    setCurrentView('activeWorkout');
  };

  const toggleDayCompletion = (exerciseId, dayIndex) => {
    setWorkoutData(prev => {
      const ex = prev[exerciseId];
      const newPlan = ex.plan.map((d, i) => i === dayIndex ? { ...d, completed: !d.completed } : d);
      return { ...prev, [exerciseId]: { ...ex, plan: newPlan } };
    });
  };

  // === VIEWS ===
  const ProfileSetup = () => (
    <div className={`min-h-screen \( {bg} \){text} p-6 flex items-center justify-center`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">⚡</div>
          <h1 className="text-4xl font-extrabold">Titan Fitness</h1>
        </div>

        <div className={`${cardBg} rounded-3xl p-8 shadow-2xl`}>
          <div className="space-y-6">
            <div>
              <label className={`block mb-2 font-bold ${primary}`}>Nome</label>
              <input
                ref={el => inputRefs.current.name = el}
                type="text"
                className={`w-full p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-lg`}
                value={userData.name}
                onChange={e => setUserData({...userData, name: e.target.value})}
                placeholder="Seu nome"
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block mb-2 font-bold ${primary}`}>Idade</label>
                <input type="number" className="w-full p-4 rounded-xl text-center" value={userData.age} onChange={e => setUserData({...userData, age: e.target.value})} />
              </div>
              <div>
                <label className={`block mb-2 font-bold ${primary}`}>Peso (kg)</label>
                <input type="number" step="0.1" className="w-full p-4 rounded-xl text-center" value={userData.weight} onChange={e => setUserData({...userData, weight: e.target.value})} />
              </div>
              <div>
                <label className={`block mb-2 font-bold ${primary}`}>Altura (cm)</label>
                <input type="number" className="w-full p-4 rounded-xl text-center" value={userData.height} onChange={e => setUserData({...userData, height: e.target.value})} />
              </div>
            </div>

            <div>
              <label className={`block mb-3 font-bold ${primary}`}>Objetivo</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setUserData({...userData, goal: 'muscle'})} className={userData.goal === 'muscle' ? 'bg-blue-600 text-white p-20' : 'bg-gray-700'}>
                  <div className="text-4xl">💪</div>Ganhar Massa
                </button>
                <button onClick={() => setUserData({...userData, goal: 'weight_loss'})} className={userData.goal === 'weight_loss' ? 'bg-orange-600 text-white p-20' : 'bg-gray-700'}>
                  <div className="text-4xl">🔥</div>Perder Peso
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setUserData({...userData, hasProfile: true});
                setCalorieTracking(prev => ({...prev, dailyGoal: calculateTMB, enabled: true}));
                setCurrentView('home');
              }}
              disabled={!userData.name || !userData.age || !userData.weight || !userData.height}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-5 rounded-2xl font-bold text-xl shadow-lg"
            >
              COMEÇAR AGORA
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // NOVA TELA: Treino Ativo com contador + animação
  const ActiveWorkoutView = () => {
    const ex = selectedExercise;
    const data = workoutData[ex.id];
    const today = new Date().getDay() + 1;
    const todayPlan = data.plan.find(d => d.day === today && d.type === 'workout');

    return (
      <div className={`min-h-screen \( {bg} \){text} p-6 pb-32`}>
        <button onClick={() => setCurrentView('workout')} className={`${primary} mb-4`}>← Voltar</button>

        <div className="text-center mb-8">
          <img src={ex.gif} alt={ex.name} className="w-64 h-64 object-cover rounded-3xl mx-auto shadow-2xl" />
          <h1 className="text-4xl font-extrabold mt-6">{ex.name}</h1>
          <p className="text-2xl mt-2">Nível {data.currentLevel}</p>
        </div>

        {ex.type === 'reps' ? (
          <div className={`${cardBg} rounded-3xl p-8 text-center`}>
            <div className="text-8xl font-extrabold text-orange-500 my-10">{currentReps}</div>
            <div className="flex justify-center gap-6">
              <button onClick={() => setCurrentReps(n => n + 1)} className="w-20 h-20 bg-green-600 rounded-full text-4xl">+</button>
              <button onClick={() => setCurrentReps(n => Math.max(0, n - 1))} className="w-20 h-20 bg-red-600 rounded-full text-4xl">−</button>
            </div>
            <button
              onClick={() => {
                const newValue = currentReps;
                if (newValue > data.max * 1.1) {
                  // Progredir nível
                  const newPlan = generateWorkoutPlan(newValue);
                  setWorkoutData(prev => ({
                    ...prev,
                    [ex.id]: { ...prev[ex.id], max: newValue, currentLevel: prev[ex.id].currentLevel + 1, plan: newPlan }
                  }));
                }
                toggleDayCompletion(ex.id, data.plan.findIndex(d => d.day === today));
                setCurrentView('home');
              }}
              className="mt-10 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-xl"
            >
              CONCLUIR TREINO
            </button>
          </div>
        ) : (
          // Modo tempo (prancha, etc)
          <div className={`${cardBg} rounded-3xl p-8 text-center`}>
            <div className="text-8xl font-extrabold text-orange-500 my-10">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`w-32 h-32 rounded-full text-4xl font-bold ${timerActive ? 'bg-red-600' : 'bg-green-600'}`}
            >
              {timerActive ? 'PARAR' : 'INICIAR'}
            </button>
            <button
              onClick={() => {
                setTimerActive(false);
                const newValue = timerSeconds;
                if (newValue > data.max * 1.15) {
                  const newPlan = generateWorkoutPlan(newValue);
                  setWorkoutData(prev => ({
                    ...prev,
                    [ex.id]: { ...prev[ex.id], max: newValue, currentLevel: prev[ex.id].currentLevel + 1, plan: newPlan }
                  }));
                }
                toggleDayCompletion(ex.id, data.plan.findIndex(d => d.day === today));
                setTimerSeconds(0);
                setCurrentView('home');
              }}
              className="mt-10 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-xl"
            >
              FINALIZAR
            </button>
          </div>
        )}
      </div>
    );
  };

  // WorkoutView atualizado com dias clicáveis
  const WorkoutView = () => {
    const ex = selectedExercise;
    const data = workoutData[ex.id];

    return (
      <div className={`min-h-screen \( {bg} \){text} p-6 pb-24`}>
        <button onClick={() => setCurrentView('home')} className={`${primary} text-lg`}>← Voltar</button>

        <div className="text-center my-8">
          <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${ex.color} rounded-2xl flex items-center justify-center text-5xl`}>
            {ex.icon}
          </div>
          <h1 className="text-3xl font-bold mt-4">{ex.name}</h1>
          <p className="text-xl">Nível {data.currentLevel} • Recorde: {data.max} {ex.type === 'time' ? 's' : 'reps'}</p>
        </div>

        <h2 className="text-2xl font-bold my-6">Plano de 21 Dias</h2>
        <div className="grid grid-cols-7 gap-3">
          {data.plan.map((day, idx) => (
            <button
              key={idx}
              onClick={() => day.type === 'workout' && toggleDayCompletion(ex.id, idx)}
              className={`p-4 rounded-xl \( {cardBg} shadow-lg \){
                day.type === 'rest' ? 'opacity-60' : ''
              } ${day.completed ? 'ring-4 ring-green-500' : ''}`}
            >
              <div className="font-bold">D{day.day}</div>
              {day.type === 'workout' && (
                <div className="text-sm mt-1">
                  {day.completed ? <CheckCircle className="w-8 h-8 text-green-500 mx-auto" /> : <Circle className="w-8 h-8 mx-auto" />}
                  <div>5x{day.target}</div>
                </div>
              )}
              {day.type === 'reassess' && <div className="text-orange-500 text-xs">Reavaliação</div>}
              {day.type === 'rest' && <div className="text-2xl">😴</div>}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentReps(0);
            setTimerSeconds(0);
            setTimerActive(false);
            setCurrentView('activeWorkout');
          }}
          className="w-full mt-10 bg-gradient-to-r from-orange-600 to-red-600 text-white py-5 rounded-2xl font-bold text-xl"
        >
          INICIAR TREINO DE HOJE
        </button>
      </div>
    );
  };

  // ... (resto das views: HomeView, CaloriesView, StatsView, SettingsModal, BottomNav permanecem iguais ou com pequenos ajustes)

  if (!userData.hasProfile) return <ProfileSetup />;

  return (
    <div className={`min-h-screen ${bg}`}>
      {currentView === 'home' && <HomeView />}
      {currentView === 'assessment' && <AssessmentView />}
      {currentView === 'workout' && <WorkoutView />}
      {currentView === 'activeWorkout' && <ActiveWorkoutView />}
      {currentView === 'calories' && <CaloriesView />}
      {currentView === 'stats' && <StatsView />}
      {settingsOpen && <SettingsModal />}
      <BottomNav />
    </div>
  );
};

export default App;
