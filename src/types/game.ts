export type PlantType = 'sunflower' | 'peashooter' | 'repeater' | 'wallnut' | 'cherrybomb' | 'snowpea';

export type ZombieType = 'basic' | 'conehead' | 'buckethead' | 'flag';

export type GameState = 'READY' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER';

export interface PlantConfig {
  type: PlantType;
  name: string;
  cost: number;
  hp: number;
  cooldown: number; // in seconds
  description: string;
}

export interface PlantInstance {
  id: string;
  type: PlantType;
  row: number; // 0..4
  col: number; // 0..8
  hp: number;
  maxHp: number;
  lastShootTime: number;
  lastProduceTime: number;
  fuseTimer?: number; // for Cherry Bomb (counts down from 1.0s)
  hasExploded?: boolean;
}

export interface ZombieInstance {
  id: string;
  type: ZombieType;
  row: number; // 0..4
  x: number; // in px from lawn left edge (0 to ~920)
  hp: number;
  maxHp: number;
  coneHp?: number;
  bucketHp?: number;
  speed: number; // px per second
  isEating: boolean;
  eatingTargetId: string | null;
  slowTimer: number; // seconds remaining of slow effect
  animTime: number; // for walk bob and bite cycle
}

export interface ProjectileInstance {
  id: string;
  type: 'pea' | 'snowpea';
  row: number;
  x: number;
  damage: number;
  speed: number; // px per sec
}

export interface SunInstance {
  id: string;
  x: number; // px
  y: number; // px
  targetY: number; // final resting px
  value: number;
  lifetime: number; // seconds alive
  isCollected: boolean;
  collectAnimProgress: number; // 0..1 flying to HUD
  source: 'sky' | 'sunflower';
  isQuiz?: boolean;
}

export interface LawnMowerInstance {
  row: number;
  x: number;
  state: 'idle' | 'triggered' | 'offscreen';
  speed: number;
}

export interface ParticleEffect {
  id: string;
  type: 'splat' | 'frost' | 'explosion' | 'sunText' | 'bite';
  x: number;
  y: number;
  text?: string;
  color?: string;
  lifetime: number; // seconds remaining
  maxLifetime: number;
}
