import { PlantConfig, PlantType } from '../types/game';

export const GRID_ROWS = 5;
export const GRID_COLS = 9;

export const STAGE_WIDTH = 1280;
export const STAGE_HEIGHT = 720;

export const CELL_WIDTH = 104; // px width per cell
export const CELL_HEIGHT = 110; // px height per cell
export const LAWN_LEFT_OFFSET = 120; // space for house patio and lawn mowers
export const LAWN_GRID_WIDTH = GRID_COLS * CELL_WIDTH; // 936px
export const LAWN_WIDTH = LAWN_LEFT_OFFSET + LAWN_GRID_WIDTH; // 1056px
export const LAWN_HEIGHT = GRID_ROWS * CELL_HEIGHT; // 550px
export const RIGHT_STREET_WIDTH = STAGE_WIDTH - LAWN_WIDTH; // 224px street walkway
export const ZOMBIE_SPAWN_X = STAGE_WIDTH - 50; // 1230px (enters from street)

export const INITIAL_SUN = 100;
export const SKY_SUN_INTERVAL = 5.0; // Matahari alami jatuh setiap 5 detik
export const SUN_VALUE = 25; // Matahari biasa: 25 poin
export const QUIZ_SUN_VALUE = 50; // Kuis benar: 50 poin
export const SUN_LIFETIME = 14.0; // despawn after 14s

export const PLANTS: Record<PlantType, PlantConfig> = {
  sunflower: {
    type: 'sunflower',
    name: 'Sunflower',
    cost: 50,
    hp: 300,
    cooldown: 4.0,
    description: 'Menghasilkan energi matahari (+25 poin) secara berkala untuk kebun.'
  },
  peashooter: {
    type: 'peashooter',
    name: 'Peashooter',
    cost: 100,
    hp: 300,
    cooldown: 3.0,
    description: 'Menembak polong hijau ke arah zombie (Damage: 20).'
  },
  repeater: {
    type: 'repeater',
    name: 'Repeater',
    cost: 200,
    hp: 300,
    cooldown: 3.0,
    description: 'Menembak 2 peluru pea sekaligus secara beruntun (Damage 2x: 40).'
  },
  wallnut: {
    type: 'wallnut',
    name: 'Wall-nut',
    cost: 50,
    hp: 4000,
    cooldown: 9.0,
    description: 'Dinding pertahanan tebal dengan HP 4000.'
  },
  cherrybomb: {
    type: 'cherrybomb',
    name: 'Cherry Bomb',
    cost: 150,
    hp: 300,
    cooldown: 12.5,
    description: 'Meledak setelah 1 detik, memusnahkan zombie di area 3x3.'
  },
  snowpea: {
    type: 'snowpea',
    name: 'Snow Pea',
    cost: 175,
    hp: 300,
    cooldown: 3.75,
    description: 'Menembak peluru es, memperlambat zombie sebesar 50%.'
  }
};

export const SUNFLOWER_PRODUCE_INTERVAL = 20.0; // Sunflower menghasilkan matahari setiap 20 detik
export const PEASHOOTER_SHOOT_INTERVAL = 1.5; // seconds
export const PEA_DAMAGE = 20;
export const PEA_SPEED = 420; // px/s
export const SNOW_PEA_SLOW_DURATION = 3.0; // 3 seconds slow

export const CHERRY_BOMB_FUSE = 1.0; // 1 second fuse
export const CHERRY_BOMB_DAMAGE = 1800; // instant kill

export const ZOMBIE_SPEED_NORMAL = 18; // Kecepatan zombie biasa
export const ZOMBIE_SPEED_FLAG = ZOMBIE_SPEED_NORMAL * 1.5; // Zombie Flag 1,5x lebih cepat
export const QUIZ_WRONG_SCORE = 0; // Jawaban kuis salah tidak mendapat poin
export const ZOMBIE_DAMAGE_PER_SEC = 45; // 50% lebih sedikit damage gigitan zombie ke tanaman
export const LAWN_MOWER_SPEED = 620; // px/s when triggered

export interface WaveStep {
  timeOffset: number; // seconds after wave start
  zombies: Array<{ type: 'basic' | 'conehead' | 'buckethead' | 'flag'; row?: number }>;
}

export interface WaveDefinition {
  waveNumber: number;
  title: string;
  isHugeWave?: boolean;
  isFinalWave?: boolean;
  subWaves: WaveStep[];
}

// 50% Lebih Mudah: Jarak spawn lebih lapang, jumlah zombie lebih ramah untuk anak-anak belajar
const BASE_GAME_WAVES: WaveDefinition[] = [
  {
    waveNumber: 1,
    title: 'Gelombang 1: Zombie Pertama Muncul',
    subWaves: [
      { timeOffset: 18, zombies: [{ type: 'basic', row: 2 }] },
      { timeOffset: 42, zombies: [{ type: 'basic', row: 1 }] }
    ]
  },
  {
    waveNumber: 2,
    title: 'Gelombang 2: Pasukan Helm Kerucut',
    subWaves: [
      { timeOffset: 18, zombies: [{ type: 'basic', row: 0 }] },
      { timeOffset: 42, zombies: [{ type: 'conehead', row: 3 }] },
      { timeOffset: 66, zombies: [{ type: 'basic', row: 2 }] }
    ]
  },
  {
    waveNumber: 3,
    title: 'Gelombang 3: Gelombang Besar Mendekat!',
    isHugeWave: true,
    subWaves: [
      { timeOffset: 18, zombies: [{ type: 'flag', row: 2 }, { type: 'basic', row: 1 }] },
      { timeOffset: 48, zombies: [{ type: 'conehead', row: 3 }] },
      { timeOffset: 78, zombies: [{ type: 'basic', row: 2 }, { type: 'conehead', row: 4 }] }
    ]
  },
  {
    waveNumber: 4,
    title: 'Gelombang 4: Pasukan Ember Besi',
    subWaves: [
      { timeOffset: 18, zombies: [{ type: 'buckethead', row: 2 }] },
      { timeOffset: 48, zombies: [{ type: 'conehead', row: 1 }] },
      { timeOffset: 78, zombies: [{ type: 'buckethead', row: 4 }, { type: 'basic', row: 3 }] }
    ]
  },
  {
    waveNumber: 5,
    title: 'Gelombang 5: GELOMBANG TERAKHIR (FINAL WAVE)',
    isHugeWave: true,
    isFinalWave: true,
    subWaves: [
      {
        // Pembuka final wave diberi jeda lebih panjang.
        timeOffset: 20,
        zombies: [
          { type: 'flag', row: 2 },
          { type: 'conehead', row: 1 },
          { type: 'basic', row: 4 }
        ]
      },
      {
        // Gelombang kedua datang setelah jeda yang lebih lapang.
        timeOffset: 55,
        zombies: [
          { type: 'buckethead', row: 3 },
          { type: 'conehead', row: 0 },
          { type: 'basic', row: 2 }
        ]
      },
      {
        // Kelompok terakhir muncul lebih lambat.
        timeOffset: 90,
        zombies: [
          { type: 'buckethead', row: 2 },
          { type: 'conehead', row: 3 }
        ]
      }
    ]
  }
];


// Semua wave: setiap zombie dasar muncul 2 kali total.
// Wave 1-4: salinan kedua digeser 2 jalur agar lebih menyebar.
// Wave 5: zombie tambahan dibagi merata ke seluruh 5 jalur.
export const GAME_WAVES: WaveDefinition[] = BASE_GAME_WAVES.map((wave) => ({
  ...wave,
  subWaves: wave.subWaves.map((subWave) => {
    const doubledZombies = subWave.zombies.flatMap((zombie) => [
      { ...zombie },
      { ...zombie }
    ]);

    return {
      ...subWave,
      zombies: wave.waveNumber === 5
        ? doubledZombies.map((zombie, index) => ({
            ...zombie,
            row: index % GRID_ROWS
          }))
        : doubledZombies.map((zombie, index) => ({
            ...zombie,
            row: zombie.row === undefined
              ? undefined
              : (zombie.row + (index % 2) * 2) % GRID_ROWS
          }))
    };
  })
}));
