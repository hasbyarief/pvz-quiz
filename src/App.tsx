import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlantType,
  ZombieType,
  GameState,
  PlantInstance,
  ZombieInstance,
  ProjectileInstance,
  SunInstance,
  LawnMowerInstance,
  ParticleEffect
} from './types/game';
import {
  GRID_ROWS,
  GRID_COLS,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  CELL_WIDTH,
  CELL_HEIGHT,
  LAWN_LEFT_OFFSET,
  LAWN_WIDTH,
  INITIAL_SUN,
  SKY_SUN_INTERVAL,
  SUN_VALUE,
  QUIZ_SUN_VALUE,
  SUN_LIFETIME,
  PLANTS,
  SUNFLOWER_PRODUCE_INTERVAL,
  PEASHOOTER_SHOOT_INTERVAL,
  PEA_DAMAGE,
  PEA_SPEED,
  SNOW_PEA_SLOW_DURATION,
  CHERRY_BOMB_FUSE,
  CHERRY_BOMB_DAMAGE,
  ZOMBIE_SPEED_NORMAL,
  ZOMBIE_SPEED_FLAG,
  ZOMBIE_BODY_HP,
  ZOMBIE_CONE_ARMOR_HP,
  ZOMBIE_BUCKET_ARMOR_HP,
  ZOMBIE_DAMAGE_PER_SEC,
  LAWN_MOWER_SPEED,
  GAME_WAVES,
  ZOMBIE_SPAWN_X
} from './game/constants';
import { soundManager } from './audio/soundManager';
import { HUD } from './components/HUD';
import { LawnGrid } from './components/LawnGrid';
import { Modals } from './components/Modals';
import { SunQuizModal } from './components/SunQuizModal';
import { PlantRenderer } from './components/svg/PlantRenderer';
import { ShovelSVG } from './components/svg/ShovelSVG';
import { SubjectCategory, SUBJECTS, getRandomQuestion, resetQuizDeck, QuizQuestion } from './game/quizData';

export default function App() {
  // Game lifecycle state
  const [gameState, setGameState] = useState<GameState>('READY');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [stageScale, setStageScale] = useState<number>(1);

  // Educational Quiz State (Dipilih di awal, terkunci saat bermain)
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>('fruits');
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(() => {
    const saved = Number(localStorage.getItem('pvzQuizHighestLevel') || '1');
    return Math.min(10, Math.max(1, Number.isFinite(saved) ? saved : 1));
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('pvzQuizCompletedLevels') || '[]').filter((n: unknown) => Number.isInteger(n) && Number(n) >= 1 && Number(n) <= 10); }
    catch { return []; }
  });
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [activeQuizSunId, setActiveQuizSunId] = useState<string | null>(null);

  // Economy & Inventory
  const [sun, setSun] = useState<number>(INITIAL_SUN);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [isShovelActive, setIsShovelActive] = useState<boolean>(false);
  const [cooldowns, setCooldowns] = useState<Record<PlantType, number>>({
    sunflower: 0,
    peashooter: 0,
    repeater: 0,
    wallnut: 0,
    cherrybomb: 0,
    snowpea: 0
  });

  // Entities state for UI rendering
  const [plants, setPlants] = useState<PlantInstance[]>([]);
  const [zombies, setZombies] = useState<ZombieInstance[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileInstance[]>([]);
  const [suns, setSuns] = useState<SunInstance[]>([]);
  const [lawnMowers, setLawnMowers] = useState<LawnMowerInstance[]>([
    { row: 0, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
    { row: 1, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
    { row: 2, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
    { row: 3, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
    { row: 4, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED }
  ]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);

  // Simulation Refs for single-source-of-truth delta-time loop
  const plantsRef = useRef<PlantInstance[]>([]);
  const zombiesRef = useRef<ZombieInstance[]>([]);
  const projectilesRef = useRef<ProjectileInstance[]>([]);
  const sunsRef = useRef<SunInstance[]>([]);
  const mowersRef = useRef<LawnMowerInstance[]>([]);
  const particlesRef = useRef<ParticleEffect[]>([]);

  // Wave & Spawning
  const [currentWaveIdx, setCurrentWaveIdx] = useState<number>(0);
  const [waveTimer, setWaveTimer] = useState<number>(0);
  const [waveAlert, setWaveAlert] = useState<string | null>(null);

  // Interaction & UI cursor
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Statistics for Victory / Game Over / Quiz summary
  const [stats, setStats] = useState({
    zombiesDefeated: 0,
    sunCollected: 0,
    lawnMowersSaved: 5,
    quizAnswered: 0,
    quizCorrect: 0
  });

  // Internal loop timers
  const lastTimeRef = useRef<number>(performance.now());
  const skySunTimerRef = useRef<number>(0);
  const skySunSpawnCountRef = useRef<number>(0);
  const subWaveSpawnedRef = useRef<Set<string>>(new Set());
  const soundCooldownRef = useRef<{ [key: string]: number }>({});
  const isOpeningQuizRef = useRef<boolean>(false);
  const quizAnsweredRef = useRef<number>(0);
  const quizCorrectRef = useRef<number>(0);
  // Overtime Final Wave: terus menambah pasukan selama target 25 jawaban benar belum tercapai.
  const finalWaveElapsedRef = useRef<number>(0);
  const finalWaveSpawnAccumulatorRef = useRef<number>(0);
  const finalWaveDynamicSpawnedRef = useRef<number>(0);

  // Sync state to refs on initialize
  const resetGame = useCallback((subjectOverride?: SubjectCategory) => {
    isOpeningQuizRef.current = false;
    setIsPaused(false);
    quizAnsweredRef.current = 0;
    quizCorrectRef.current = 0;
    resetQuizDeck(subjectOverride ?? selectedSubject);
    setSun(INITIAL_SUN);
    setSelectedPlant(null);
    setIsShovelActive(false);
    setActiveQuiz(null);
    setActiveQuizSunId(null);
    setCooldowns({
      sunflower: 0,
      peashooter: 0,
      repeater: 0,
      wallnut: 0,
      cherrybomb: 0,
      snowpea: 0
    });

    const initMowers: LawnMowerInstance[] = [
      { row: 0, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
      { row: 1, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
      { row: 2, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
      { row: 3, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED },
      { row: 4, x: 8, state: 'idle', speed: LAWN_MOWER_SPEED }
    ];

    plantsRef.current = [];
    zombiesRef.current = [];
    projectilesRef.current = [];
    sunsRef.current = [];
    mowersRef.current = initMowers;
    particlesRef.current = [];

    setPlants([]);
    setZombies([]);
    setProjectiles([]);
    setSuns([]);
    setLawnMowers(initMowers);
    setParticles([]);

    setCurrentWaveIdx(0);
    setWaveTimer(0);
    setWaveAlert(null);
    setStats({
      zombiesDefeated: 0,
      sunCollected: 0,
      lawnMowersSaved: 5,
      quizAnswered: 0,
      quizCorrect: 0
    });

    skySunTimerRef.current = 0;
    skySunSpawnCountRef.current = 0;
    subWaveSpawnedRef.current.clear();
    finalWaveElapsedRef.current = 0;
    finalWaveSpawnAccumulatorRef.current = 0;
    finalWaveDynamicSpawnedRef.current = 0;
    lastTimeRef.current = performance.now();
  }, [selectedSubject]);

  // Semua banner/peringatan wave otomatis hilang setelah 5 detik.
  useEffect(() => {
    if (!waveAlert) return;
    const timeoutId = window.setTimeout(() => setWaveAlert(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [waveAlert]);

  const currentLevelNumber = () => SUBJECTS.findIndex((subject) => subject.id === selectedSubject) + 1;

  const recordLevelCompletion = () => {
    const level = currentLevelNumber();
    const nextCompleted = Array.from(new Set([...completedLevels, level])).sort((a, b) => a - b);
    const nextUnlocked = Math.min(10, Math.max(highestUnlockedLevel, level + 1));
    setCompletedLevels(nextCompleted);
    setHighestUnlockedLevel(nextUnlocked);
    localStorage.setItem('pvzQuizCompletedLevels', JSON.stringify(nextCompleted));
    localStorage.setItem('pvzQuizHighestLevel', String(nextUnlocked));
  };

  const handleNextLevel = () => {
    const nextSubject = SUBJECTS[currentLevelNumber()];
    if (!nextSubject) {
      setGameState('READY');
      return;
    }
    setSelectedSubject(nextSubject.id);
    resetGame(nextSubject.id);
    setGameState('PLAYING');
    soundManager.startBgm();
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handleBackToMap = () => {
    setIsPaused(false);
    setGameState('READY');
  };

  const handleStartGame = () => {
    resetGame();
    setGameState('PLAYING');
    soundManager.startBgm();
    // Terapkan layar fullscreen otomatis saat mulai permainan
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handleRestart = () => {
    resetGame();
    setGameState('PLAYING');
    soundManager.startBgm();
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Keyboard and Right Click handlers to cancel selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPlant(null);
        setIsShovelActive(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      handleResize();
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Responsive 16:9 Stage Scaling (with comfortable margin when windowed)
    const handleResize = () => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const scaleX = winW / STAGE_WIDTH;
      const scaleY = winH / STAGE_HEIGHT;
      // Fit 16:9 stage into current viewport with gentle padding so it's not overly stretched
      const baseScale = Math.min(scaleX, scaleY);
      setStageScale(document.fullscreenElement ? baseScale : baseScale * 0.96);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Right-click cancel handler (Crucial PvZ mechanic)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPlant(null);
    setIsShovelActive(false);
  };

  // Plant selection handler
  const handleSelectPlant = (type: PlantType) => {
    setIsShovelActive(false);
    setSelectedPlant((prev) => (prev === type ? null : type));
  };

  // Shovel toggle handler
  const handleToggleShovel = () => {
    setSelectedPlant(null);
    setIsShovelActive((prev) => !prev);
  };

  // Sound mute toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  // Pause toggle
  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
    lastTimeRef.current = performance.now();
  };

  // =========================================================================
  // EDUCATIONAL QUIZ SUN INTERACTION
  // Player clicks/taps sun -> Generates quiz question with instant response!
  // =========================================================================
  const handleSunClick = (sunId: string, e?: React.SyntheticEvent) => {
    if (gameState !== 'PLAYING' || isPaused) return;
    if (e) {
      e.stopPropagation();
    }
    if (activeQuiz || isOpeningQuizRef.current) return; // quiz already open or opening

    const sunItem = sunsRef.current.find((s) => s.id === sunId);
    if (!sunItem || sunItem.isCollected) return;

    // Matahari quiz ditandai dengan isQuiz: true (berikon tanda tanya ?)
    const shouldShowQuiz = !!sunItem.isQuiz && quizCorrectRef.current < 25;

    if (shouldShowQuiz) {
      isOpeningQuizRef.current = true;
      const question = getRandomQuestion(selectedSubject);
      setActiveQuiz(question);
      setActiveQuizSunId(sunId);
    } else {
      // Matahari biasa yang terserap: 25 poin
      soundManager.playSunCollect();
      setSun((prev) => prev + SUN_VALUE);
      setStats((prev) => ({ ...prev, sunCollected: prev.sunCollected + SUN_VALUE }));

      // Floating "+25" particle
      particlesRef.current.push({
        id: `sunText-${Date.now()}-${Math.random()}`,
        type: 'sunText',
        x: sunItem.x,
        y: sunItem.y,
        text: `+${SUN_VALUE}`,
        lifetime: 0.8,
        maxLifetime: 0.8
      });

      sunItem.isCollected = true;
    }
  };

  // Answer callback from SunQuizModal
  const handleQuizAnswer = (isCorrect: boolean) => {
    // Every submitted answer is counted as an attempt, but only correct
    // answers advance the 25-question victory requirement.
    const nextQuizAnswered = quizAnsweredRef.current + 1;
    quizAnsweredRef.current = nextQuizAnswered;

    const nextQuizCorrect = quizCorrectRef.current + (isCorrect ? 1 : 0);
    if (isCorrect) quizCorrectRef.current = nextQuizCorrect;

    setStats((prev) => ({
      ...prev,
      quizAnswered: nextQuizAnswered,
      quizCorrect: nextQuizCorrect
    }));

    if (activeQuizSunId) {
      const sunItem = sunsRef.current.find((s) => s.id === activeQuizSunId);
      if (sunItem && !sunItem.isCollected) {
        // Each quiz sun can be answered only once. A wrong answer consumes
        // the sun but does not advance the correct-answer target.
        sunItem.isCollected = true;
        if (isCorrect) {
          soundManager.playSunCollect();
          setSun((prev) => prev + QUIZ_SUN_VALUE);
          setStats((prev) => ({ ...prev, sunCollected: prev.sunCollected + QUIZ_SUN_VALUE }));

          particlesRef.current.push({
            id: `sunText-${Date.now()}-${Math.random()}`,
            type: 'sunText',
            x: sunItem.x,
            y: sunItem.y,
            text: `+${QUIZ_SUN_VALUE}`,
            lifetime: 0.8,
            maxLifetime: 0.8
          });
        }
      }
    }

    // Close quiz modal & resume game smoothly
    setActiveQuiz(null);
    setActiveQuizSunId(null);
    isOpeningQuizRef.current = false;
    lastTimeRef.current = performance.now();

    // Victory requires 25 correct answers AND completion of wave 5.
    const currentWaveDef = GAME_WAVES[currentWaveIdx];
    const allSubWavesSpawned = currentWaveDef && currentWaveDef.subWaves.every((_, subIdx) =>
      subWaveSpawnedRef.current.has(`${currentWaveIdx}-${subIdx}`)
    );
    const hasClearedWave5 = currentWaveIdx >= GAME_WAVES.length - 1 && allSubWavesSpawned && zombiesRef.current.length === 0;

    if (nextQuizCorrect >= 25 && hasClearedWave5) {
      recordLevelCompletion();
      setGameState('VICTORY');
      soundManager.playVictory();
    }
  };

  // Cell Click: Place Plant or Dig with Shovel
  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'PLAYING' || isPaused || activeQuiz !== null) return;
    const existingIndex = plantsRef.current.findIndex((p) => p.row === row && p.col === col);

    // Shovel action: remove plant
    if (isShovelActive) {
      if (existingIndex !== -1) {
        soundManager.playPlant();
        plantsRef.current.splice(existingIndex, 1);
        setPlants([...plantsRef.current]);
        setIsShovelActive(false);
      }
      return;
    }

    // Placing a plant
    if (selectedPlant && existingIndex === -1) {
      const config = PLANTS[selectedPlant];
      if (sun >= config.cost) {
        setSun((prev) => prev - config.cost);
        soundManager.playPlant();

        // Start recharge cooldown for this plant type
        setCooldowns((prev) => ({
          ...prev,
          [selectedPlant]: config.cooldown
        }));

        const newPlant: PlantInstance = {
          id: `plant-${Date.now()}-${Math.random()}`,
          type: selectedPlant,
          row,
          col,
          hp: config.hp,
          maxHp: config.hp,
          lastShootTime: 0,
          lastProduceTime: selectedPlant === 'sunflower' ? 5.0 : 0,
          fuseTimer: selectedPlant === 'cherrybomb' ? CHERRY_BOMB_FUSE : undefined
        };

        plantsRef.current.push(newPlant);
        setPlants([...plantsRef.current]);
        setSelectedPlant(null); // Ghost cursor disappears upon placement!
      }
    }
  };

  // =========================================================================
  // MAIN GAME ENGINE LOOP (Delta-Time, Frame-Rate Independent)
  // Pauses automatically during quiz modal so students can solve without panic!
  // =========================================================================
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused || activeQuiz !== null) return;

    let animId: number;

    const gameLoop = (now: number) => {
      // Calculate deltaTime in seconds, clamp to 0.1s
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Update Sound Cooldowns
      Object.keys(soundCooldownRef.current).forEach((k) => {
        if (soundCooldownRef.current[k] > 0) {
          soundCooldownRef.current[k] -= dt;
        }
      });

      // 1. UPDATE SEED CARD COOLDOWNS
      setCooldowns((prev) => {
        let changed = false;
        const next = { ...prev };
        (Object.keys(next) as PlantType[]).forEach((type) => {
          if (next[type] > 0) {
            next[type] = Math.max(0, next[type] - dt);
            changed = true;
          }
        });
        return changed ? next : prev;
      });

      // 2. SPAWN SKY SUN
      const currentWaveDef = GAME_WAVES[currentWaveIdx];
      skySunTimerRef.current += dt;
      const finalWaveScriptComplete = currentWaveIdx >= GAME_WAVES.length - 1 && !!currentWaveDef && currentWaveDef.subWaves.every((_, subIdx) => subWaveSpawnedRef.current.has(`${currentWaveIdx}-${subIdx}`));
      // Selama Final Wave overtime, matahari kuis tetap lebih sering muncul meski zombie masih hidup.
      const sunInterval = (finalWaveScriptComplete && quizCorrectRef.current < 25) ? 2.5 : SKY_SUN_INTERVAL;

      if (skySunTimerRef.current >= sunInterval) {
        skySunTimerRef.current = 0;
        const targetRow = Math.floor(Math.random() * GRID_ROWS);
        const targetCol = Math.floor(Math.random() * (GRID_COLS - 1));
        const spawnX = LAWN_LEFT_OFFSET + targetCol * CELL_WIDTH + CELL_WIDTH / 2;
        const targetY = targetRow * CELL_HEIGHT + CELL_HEIGHT / 2;

        // Rasio kemunculan matahari langit: 10 biasa : 5 kuis (pola 2:1).
        // Setiap matahari ketiga menjadi kuis; setelah 25 jawaban benar,
        // seluruh matahari berikutnya menjadi matahari biasa.
        const isQuiz = quizCorrectRef.current < 25 && skySunSpawnCountRef.current % 3 === 2;
        skySunSpawnCountRef.current += 1;

        sunsRef.current.push({
          id: `skySun-${Date.now()}-${Math.random()}`,
          x: spawnX,
          y: -30,
          targetY,
          value: isQuiz ? QUIZ_SUN_VALUE : SUN_VALUE,
          lifetime: SUN_LIFETIME,
          isCollected: false,
          collectAnimProgress: 0,
          source: 'sky',
          isQuiz
        });
      }

      // 3. UPDATE SUNS (FLOAT, FLY, DESPAWN)
      sunsRef.current = sunsRef.current
        .map((s) => {
          if (s.isCollected) {
            const nextProgress = s.collectAnimProgress + dt * 3.5;
            return {
              ...s,
              collectAnimProgress: nextProgress,
              y: s.y - dt * 280
            };
          }

          let newY = s.y;
          if (s.y < s.targetY) {
            newY = Math.min(s.targetY, s.y + dt * 90);
          }

          return {
            ...s,
            y: newY,
            lifetime: s.lifetime - dt
          };
        })
        .filter((s) => (s.isCollected ? s.collectAnimProgress < 1.0 : s.lifetime > 0));

      // 4. WAVE PROGRESSION & SPAWNS
      if (currentWaveDef) {
        setWaveTimer((prevTime) => {
          const nextTime = prevTime + dt;

          // Check subwaves to spawn
          currentWaveDef.subWaves.forEach((subWave, subIdx) => {
            const key = `${currentWaveIdx}-${subIdx}`;
            if (nextTime >= subWave.timeOffset && !subWaveSpawnedRef.current.has(key)) {
              subWaveSpawnedRef.current.add(key);

              // Spawn the zombies
              subWave.zombies.forEach((zDef, zIdx) => {
                const assignedRow = zDef.row !== undefined ? zDef.row : Math.floor(Math.random() * GRID_ROWS);
                const isCone = zDef.type === 'conehead';
                const isBucket = zDef.type === 'buckethead';
                const isFlag = zDef.type === 'flag';

                // Ketahanan mengikuti PvZ original: tubuh 270 HP, helm/ember terpisah.
                const hp = ZOMBIE_BODY_HP;
                const speed = isFlag ? ZOMBIE_SPEED_FLAG : ZOMBIE_SPEED_NORMAL;

                zombiesRef.current.push({
                  id: `zombie-${Date.now()}-${zIdx}-${Math.random()}`,
                  type: zDef.type,
                  row: assignedRow,
                  x: ZOMBIE_SPAWN_X + zIdx * 35,
                  hp,
                  maxHp: hp,
                  coneHp: isCone ? ZOMBIE_CONE_ARMOR_HP : undefined,
                  bucketHp: isBucket ? ZOMBIE_BUCKET_ARMOR_HP : undefined,
                  speed,
                  isEating: false,
                  eatingTargetId: null,
                  slowTimer: 0,
                  animTime: Math.random() * 5
                });
              });

              if (!soundCooldownRef.current['groan'] || soundCooldownRef.current['groan'] <= 0) {
                soundManager.playZombieGroan();
                soundCooldownRef.current['groan'] = 8.0;
              }
            }
          });

          // FINAL WAVE OVERTIME: setelah 28 zombie terjadwal muncul, pasukan tambahan
          // terus berdatangan sampai pemain menjawab benar 25 soal.
          if (currentWaveIdx === GAME_WAVES.length - 1 && currentWaveDef.subWaves.every((_, subIdx) => subWaveSpawnedRef.current.has(`${currentWaveIdx}-${subIdx}`)) && quizCorrectRef.current < 25) {
            finalWaveElapsedRef.current += dt;
            finalWaveSpawnAccumulatorRef.current += dt;

            // ENDLESS FINAL WAVE: tidak ada batas jumlah zombie selama jawaban
            // benar masih di bawah 25. Tambahan kumulatif mencapai +12 pada 20 dtk,
            // +22 pada 40 dtk, +32 pada 60 dtk, +42 pada 80 dtk, dan seterusnya.
            // Spawn pertama dimulai setelah 5 detik, lalu target terus naik tanpa batas.
            const elapsed = finalWaveElapsedRef.current;
            const dynamicTarget = elapsed < 20
              ? Math.floor(elapsed / 5) * 3
              : 12 + Math.floor((elapsed - 20) / 20) * 10;

            if (finalWaveSpawnAccumulatorRef.current >= 5 && finalWaveDynamicSpawnedRef.current < dynamicTarget) {
              finalWaveSpawnAccumulatorRef.current = 0;
              const batchSize = Math.min(3, dynamicTarget - finalWaveDynamicSpawnedRef.current);
              const batchIndex = Math.floor(finalWaveDynamicSpawnedRef.current / 3);
              // Kelompok bergantian ke lima jalur; anggota satu kelompok datang pada jalur sama.
              const row = batchIndex % GRID_ROWS;

              for (let i = 0; i < batchSize; i++) {
                const dynamicIndex = finalWaveDynamicSpawnedRef.current + i;
                const type = dynamicIndex % 11 === 10
                  ? 'flag'
                  : dynamicIndex % 5 === 4
                    ? 'buckethead'
                    : dynamicIndex % 3 === 2
                      ? 'conehead'
                      : 'basic';
                const isCone = type === 'conehead';
                const isBucket = type === 'buckethead';
                const isFlag = type === 'flag';
                const hp = ZOMBIE_BODY_HP;

                zombiesRef.current.push({
                  id: `final-overtime-${Date.now()}-${dynamicIndex}-${Math.random()}`,
                  type,
                  row,
                  x: ZOMBIE_SPAWN_X + i * 34,
                  hp,
                  maxHp: hp,
                  coneHp: isCone ? ZOMBIE_CONE_ARMOR_HP : undefined,
                  bucketHp: isBucket ? ZOMBIE_BUCKET_ARMOR_HP : undefined,
                  speed: isFlag ? ZOMBIE_SPEED_FLAG : ZOMBIE_SPEED_NORMAL,
                  isEating: false,
                  eatingTargetId: null,
                  slowTimer: 0,
                  animTime: Math.random() * 5
                });
              }

              finalWaveDynamicSpawnedRef.current += batchSize;
              if (!soundCooldownRef.current['groan'] || soundCooldownRef.current['groan'] <= 0) {
                soundManager.playZombieGroan();
                soundCooldownRef.current['groan'] = 8.0;
              }
            }
          }

          // Check wave banner alert
          if (currentWaveDef.isHugeWave && nextTime >= 1.0 && nextTime <= 4.0) {
            setWaveAlert(currentWaveDef.isFinalWave ? 'FINAL WAVE!' : 'GELOMBANG BESAR MENDEKAT!');
            if (!soundCooldownRef.current['alarm'] || soundCooldownRef.current['alarm'] <= 0) {
              soundManager.playHugeWave();
              soundCooldownRef.current['alarm'] = 5.0;
            }
          }

          // Advance wave if all subwaves spawned AND all zombies eliminated
          const allSubWavesSpawned = currentWaveDef.subWaves.every((_, subIdx) =>
            subWaveSpawnedRef.current.has(`${currentWaveIdx}-${subIdx}`)
          );

          if (allSubWavesSpawned && zombiesRef.current.length === 0) {
            if (currentWaveIdx < GAME_WAVES.length - 1) {
              // Each wave gets its own timer. Without resetting it, the next
              // wave's scheduled sub-waves could all spawn immediately.
              setCurrentWaveIdx((prev) => prev + 1);
              return 0;
            } else {
              // Wave 5 is clear; the player still needs 25 correct answers.
              if (quizCorrectRef.current >= 25) {
                recordLevelCompletion();
                setGameState('VICTORY');
                soundManager.playVictory();
              } else {
                setWaveAlert(`JAWAB BENAR ${25 - quizCorrectRef.current} KUIS LAGI UNTUK MENANG!`);
              }
            }
          }

          return nextTime;
        });
      }

      // 5. UPDATE PLANTS (SHOOTING, SUNFLOWER, CHERRY BOMB FUSE)
      const remainingPlants: PlantInstance[] = [];

      plantsRef.current.forEach((plant) => {
        // Cherry Bomb: Fuse countdown & 3x3 blast
        if (plant.type === 'cherrybomb' && plant.fuseTimer !== undefined) {
          const nextFuse = plant.fuseTimer - dt;
          if (nextFuse <= 0) {
            // EXPLODE!
            soundManager.playExplosion();
            const plantX = LAWN_LEFT_OFFSET + plant.col * CELL_WIDTH + CELL_WIDTH / 2;
            const plantY = plant.row * CELL_HEIGHT + CELL_HEIGHT / 2;

            particlesRef.current.push({
              id: `boom-${Date.now()}-${Math.random()}`,
              type: 'explosion',
              x: plantX,
              y: plantY,
              lifetime: 0.9,
              maxLifetime: 0.9
            });

            // Instant kill in 3x3 radius
            zombiesRef.current.forEach((z) => {
              const rowDiff = Math.abs(z.row - plant.row);
              const colOfZombie = (z.x - LAWN_LEFT_OFFSET) / CELL_WIDTH;
              const colDiff = Math.abs(colOfZombie - plant.col);

              if (rowDiff <= 1 && colDiff <= 1.4) {
                z.hp = 0;
                setStats((prevStats) => ({
                  ...prevStats,
                  zombiesDefeated: prevStats.zombiesDefeated + 1
                }));
              }
            });

            return;
          } else {
            remainingPlants.push({ ...plant, fuseTimer: nextFuse });
            return;
          }
        }

        // Sunflower: Periodically produce sun (+25 poin)
        if (plant.type === 'sunflower') {
          const nextProduce = plant.lastProduceTime + dt;
          if (nextProduce >= SUNFLOWER_PRODUCE_INTERVAL) {
            const plantX = LAWN_LEFT_OFFSET + plant.col * CELL_WIDTH + CELL_WIDTH / 2;
            const plantY = plant.row * CELL_HEIGHT + CELL_HEIGHT / 2;

            sunsRef.current.push({
              id: `sunflowerSun-${Date.now()}-${Math.random()}`,
              x: plantX + (Math.random() * 20 - 10),
              y: plantY - 10,
              targetY: plantY + 22,
              value: SUN_VALUE,
              lifetime: SUN_LIFETIME,
              isCollected: false,
              collectAnimProgress: 0,
              source: 'sunflower',
              isQuiz: false
            });

            soundManager.playSunProduce();

            remainingPlants.push({ ...plant, lastProduceTime: 0 });
            return;
          }

          remainingPlants.push({ ...plant, lastProduceTime: nextProduce });
          return;
        }

        // Peashooter, Repeater (Lv. 2) & Snow Pea: Shoot if zombie is in front in that row
        if (plant.type === 'peashooter' || plant.type === 'repeater' || plant.type === 'snowpea') {
          const isIce = plant.type === 'snowpea';
          const isRepeater = plant.type === 'repeater';
          const plantX = LAWN_LEFT_OFFSET + plant.col * CELL_WIDTH;
          const nextShoot = plant.lastShootTime + dt;

          const hasZombieInFront = zombiesRef.current.some(
            (z) => z.row === plant.row && z.x > plantX && z.x < LAWN_WIDTH + 60
          );

          if (hasZombieInFront && nextShoot >= PEASHOOTER_SHOOT_INTERVAL) {
            soundManager.playShoot(isIce);
            // First pea
            projectilesRef.current.push({
              id: `pea-${Date.now()}-${Math.random()}`,
              type: isIce ? 'snowpea' : 'pea',
              row: plant.row,
              x: plantX + 68,
              damage: PEA_DAMAGE,
              speed: PEA_SPEED
            });

            // Repeater (Lv. 2): Menembak 2x (peluru kedua meluncur beriringan)
            if (isRepeater) {
              projectilesRef.current.push({
                id: `pea-rep-${Date.now()}-${Math.random()}`,
                type: 'pea',
                row: plant.row,
                x: plantX + 32,
                damage: PEA_DAMAGE,
                speed: PEA_SPEED
              });
            }

            remainingPlants.push({ ...plant, lastShootTime: 0 });
            return;
          }

          remainingPlants.push({ ...plant, lastShootTime: nextShoot });
          return;
        }

        // Other plants (Wall-nut)
        remainingPlants.push(plant);
      });

      plantsRef.current = remainingPlants;

      // 6. UPDATE PROJECTILES & COLLISION DETECTION WITH ZOMBIES
      const remainingProjectiles: ProjectileInstance[] = [];

      projectilesRef.current.forEach((proj) => {
        const nextX = proj.x + proj.speed * dt;
        let hasHit = false;

        // Check collision with zombies
        for (const zombie of zombiesRef.current) {
          if (zombie.hp > 0 && zombie.row === proj.row && Math.abs(zombie.x - nextX) < 24) {
            hasHit = true;
            const isIce = proj.type === 'snowpea';
            soundManager.playHit(isIce);

            particlesRef.current.push({
              id: `hit-${Date.now()}-${Math.random()}`,
              type: isIce ? 'frost' : 'splat',
              x: nextX,
              y: proj.row * CELL_HEIGHT + CELL_HEIGHT * 0.35,
              lifetime: 0.25,
              maxLifetime: 0.25
            });

            let remainingDmg = proj.damage;
            if (zombie.bucketHp !== undefined && zombie.bucketHp > 0) {
              zombie.bucketHp = Math.max(0, zombie.bucketHp - remainingDmg);
              remainingDmg = 0;
            } else if (zombie.coneHp !== undefined && zombie.coneHp > 0) {
              zombie.coneHp = Math.max(0, zombie.coneHp - remainingDmg);
              remainingDmg = 0;
            }

            zombie.hp -= remainingDmg;
            if (isIce) {
              zombie.slowTimer = SNOW_PEA_SLOW_DURATION;
            }

            if (zombie.hp <= 0) {
              setStats((prevStats) => ({
                ...prevStats,
                zombiesDefeated: prevStats.zombiesDefeated + 1
              }));
            }
            break;
          }
        }

        if (!hasHit && nextX < LAWN_WIDTH + 80) {
          remainingProjectiles.push({ ...proj, x: nextX });
        }
      });

      projectilesRef.current = remainingProjectiles;

      // 7. UPDATE ZOMBIES (MOVEMENT, BITING PLANTS, BREACH CHECKS)
      let isGameOver = false;

      zombiesRef.current = zombiesRef.current
        .filter((z) => z.hp > 0)
        .map((zombie) => {
          const nextSlowTimer = Math.max(0, zombie.slowTimer - dt);
          const isSlowed = nextSlowTimer > 0;
          const currentSpeed = isSlowed ? zombie.speed * 0.5 : zombie.speed;

          // Check if touching any plant in front of it
          const plantToEat = plantsRef.current.find((p) => {
            if (p.row !== zombie.row) return false;
            const plantX = LAWN_LEFT_OFFSET + p.col * CELL_WIDTH + CELL_WIDTH / 2;
            return Math.abs(zombie.x - plantX) < 26;
          });

          if (plantToEat) {
            // Eating the plant
            plantToEat.hp -= ZOMBIE_DAMAGE_PER_SEC * dt;

            if (!soundCooldownRef.current[`chomp-${zombie.id}`] || soundCooldownRef.current[`chomp-${zombie.id}`] <= 0) {
              soundManager.playChomp();
              soundCooldownRef.current[`chomp-${zombie.id}`] = 0.55;
            }

            // Remove plant if dead
            if (plantToEat.hp <= 0) {
              plantsRef.current = plantsRef.current.filter((p) => p.id !== plantToEat.id);
            }

            return {
              ...zombie,
              isEating: true,
              eatingTargetId: plantToEat.id,
              slowTimer: nextSlowTimer,
              animTime: zombie.animTime + dt
            };
          }

          // Shambling forward
          const nextX = zombie.x - currentSpeed * dt;

          // Check Lawn Mower trigger threshold (x <= 85)
          const mower = mowersRef.current.find((m) => m.row === zombie.row);
          if (mower && mower.state === 'idle' && nextX <= LAWN_LEFT_OFFSET) {
            soundManager.playLawnMower();
            mower.state = 'triggered';
          }

          // Breach without lawn mower -> Game Over!
          if (nextX <= 15) {
            isGameOver = true;
          }

          return {
            ...zombie,
            x: nextX,
            isEating: false,
            eatingTargetId: null,
            slowTimer: nextSlowTimer,
            animTime: zombie.animTime + dt
          };
        });

      if (isGameOver) {
        setGameState('GAMEOVER');
        soundManager.playGameOver();
      }

      // 8. UPDATE LAWN MOWERS (RUSH & KILL ZOMBIES)
      let savedMowersCount = 0;
      mowersRef.current = mowersRef.current.map((mower) => {
        if (mower.state === 'idle') {
          savedMowersCount++;
          return mower;
        }
        if (mower.state === 'triggered') {
          const nextX = mower.x + mower.speed * dt;

          // Obliterate any zombie in its path
          zombiesRef.current = zombiesRef.current.filter((z) => {
            if (z.row === mower.row && z.x <= nextX + 45) {
              setStats((prevStats) => ({
                ...prevStats,
                zombiesDefeated: prevStats.zombiesDefeated + 1
              }));
              return false;
            }
            return true;
          });

          if (nextX > LAWN_WIDTH + 100) {
            return { ...mower, x: nextX, state: 'offscreen' as const };
          }
          return { ...mower, x: nextX };
        }
        return mower;
      });

      setStats((prev) => ({ ...prev, lawnMowersSaved: savedMowersCount }));

      // 9. UPDATE PARTICLES
      particlesRef.current = particlesRef.current
        .map((pt) => ({ ...pt, lifetime: pt.lifetime - dt }))
        .filter((pt) => pt.lifetime > 0);

      // SYNC ALL REFS TO REACT STATE FOR UI RENDERING
      setPlants([...plantsRef.current]);
      setZombies([...zombiesRef.current]);
      setProjectiles([...projectilesRef.current]);
      setSuns([...sunsRef.current]);
      setLawnMowers([...mowersRef.current]);
      setParticles([...particlesRef.current]);

      // Request next frame
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [gameState, isPaused, currentWaveIdx, activeQuiz]);

  // Calculate current wave progress (0..1)
  const totalWaves = GAME_WAVES.length;
  const currentWaveDef = GAME_WAVES[currentWaveIdx];
  const maxWaveTime = currentWaveDef ? currentWaveDef.subWaves[currentWaveDef.subWaves.length - 1].timeOffset + 15 : 45;
  const waveProgress = Math.min(1.0, waveTimer / maxWaveTime);

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center relative select-none"
      onContextMenu={handleContextMenu}
    >
      {/* Background Ambience: Extends edge-to-edge so there is NEVER an empty screen */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c2438] via-[#091a13] to-[#040d09] z-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-sky-900/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-emerald-950/60 to-transparent" />
      </div>

      {/* 16:9 STAGE CONTAINER (1280x720) Styled like classic PvZ garden window */}
      <div
        className="relative z-10 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_0_3px_#27170a] rounded-2xl border-4 border-[#4a2e16] bg-gradient-to-b from-[#182316] via-[#101b10] to-[#0a120a] p-1.5 shrink-0"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${stageScale})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Keluar dari fullscreen' : 'Masuk fullscreen'}
          aria-label={isFullscreen ? 'Keluar dari fullscreen' : 'Masuk fullscreen'}
          className="absolute top-3 right-3 z-[80] flex items-center justify-center w-9 h-9 rounded-lg border border-amber-300/50 bg-[#271609]/90 text-amber-100 shadow-lg hover:bg-amber-700/90 hover:text-white active:scale-95 transition"
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" />
              <path d="M3 8l6-5M21 8l-6-5M3 16l6 5M21 16l-6 5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          )}
        </button>

        {/* TOP: HUD Inventory */}
        <HUD
          sun={sun}
          selectedPlant={selectedPlant}
          isShovelActive={isShovelActive}
          onSelectPlant={handleSelectPlant}
          onToggleShovel={handleToggleShovel}
          cooldowns={cooldowns}
          currentWave={currentWaveIdx + 1}
          totalWaves={totalWaves}
          waveProgress={waveProgress}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
          onRestart={handleRestart}
          selectedSubject={selectedSubject}
          quizStats={{
            answered: stats.quizAnswered,
            correct: stats.quizCorrect
          }}
        />

        {/* CENTER: Main Lawn Grid */}
        <main className="w-full flex items-center justify-center my-0.5 overflow-visible shrink-0">
          <LawnGrid
            plants={plants}
            zombies={zombies}
            projectiles={projectiles}
            suns={suns}
            lawnMowers={lawnMowers}
            particles={particles}
            selectedPlant={selectedPlant}
            isShovelActive={isShovelActive}
            hoveredCell={hoveredCell}
            mousePos={mousePos}
            onCellClick={handleCellClick}
            onCellHover={(r, c) => {
              if (r === null || c === null) {
                setHoveredCell(null);
              } else {
                setHoveredCell({ row: r, col: c });
              }
            }}
            onSunClick={handleSunClick}
            onContextMenu={handleContextMenu}
          />
        </main>

        {/* BOTTOM: Authentic PvZ Wooden Footer Bar */}
        <footer className="w-full h-11 px-4 flex items-center justify-between rounded-xl border-t-2 border-[#804e25] border-b-2 border-[#1c1006] bg-gradient-to-r from-[#3e2311] via-[#4d2c14] to-[#3e2311] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] text-xs relative select-none">
          {/* Decorative Corner Rivets / Brass Bolts */}
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-900 border border-amber-950/80 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-amber-950/70" />
          </div>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-amber-900 border border-amber-950/80 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-amber-950/70" />
          </div>

          {/* Center: Game title and creator credit */}
          <div className="w-full h-full flex items-center justify-center gap-3 sm:gap-5 px-8">
            <span className="text-amber-400 text-lg sm:text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]" aria-hidden="true">🌻</span>
            <span className="h-1 w-10 sm:w-20 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_1px_3px_rgba(0,0,0,0.8)]" aria-hidden="true" />
            <span className="text-xl sm:text-2xl font-black tracking-wide text-amber-400 uppercase font-sans drop-shadow-[0_2px_1px_rgba(0,0,0,0.95)]">
              PVZ-QUIZ
            </span>
            <span className="text-xs sm:text-lg font-bold text-amber-100 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.95)]">
              created by hasbyarief
            </span>
            <span className="h-1 w-10 sm:w-20 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.8)]" aria-hidden="true" />
            <span className="text-amber-400 text-lg sm:text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]" aria-hidden="true">🌻</span>
          </div>
        </footer>
      </div>

      {/* EDUCATIONAL SUN QUIZ MODAL */}
      {activeQuiz && (
        <SunQuizModal
          question={activeQuiz}
          onAnswer={handleQuizAnswer}
        />
      )}

      {/* MODALS & OVERLAYS */}
      <Modals
        gameState={gameState}
        onStartGame={handleStartGame}
        onRestartGame={handleRestart}
        waveAlert={waveAlert}
        selectedSubject={selectedSubject}
        onSelectSubject={(subj) => {
          setSelectedSubject(subj);
          resetQuizDeck(subj);
        }}
        highestUnlockedLevel={highestUnlockedLevel}
        completedLevels={completedLevels}
        onNextLevel={handleNextLevel}
        onBackToMap={handleBackToMap}
        stats={stats}
      />

      {/* ROOT-LEVEL GHOST CURSOR (Pixel-perfect tracking directly on mouse cursor with zero scale offset) */}
      {mousePos && (selectedPlant || isShovelActive) && (
        <div
          className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            width: Math.round(72 * stageScale),
            height: Math.round(72 * stageScale),
            opacity: 0.65
          }}
        >
          {selectedPlant && <PlantRenderer type={selectedPlant} />}
          {isShovelActive && <ShovelSVG />}
        </div>
      )}
    </div>
  );
}