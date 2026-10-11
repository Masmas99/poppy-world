export type GameStateStatus = 'menu' | 'playing' | 'paused' | 'gameover';

export type DogAnimationState =
  | 'idle'
  | 'walking'
  | 'running'
  | 'sprinting'
  | 'jumping'
  | 'falling'
  | 'landing'
  | 'barking'
  | 'sniffing'
  | 'eating'
  | 'sleeping'
  | 'sitting'
  | 'swimming';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'collect' | 'fetch' | 'interaction' | 'exploration';
  currentProgress: number;
  targetProgress: number;
  rewardBones: number;
  rewardCoins: number;
  completed: boolean;
  rewardClaimed: boolean;
}

export interface GameSettings {
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  cameraSensitivity: number;
  graphicsQuality: 'low' | 'medium' | 'high';
}

export interface DogCustomization {
  collarColor: string; // e.g., '#e63946' (red), '#457b9d' (blue), '#ffd166' (gold), '#f72585' (pink)
  furTone: 'corgi_golden' | 'chocolate' | 'husky_gray';
}

export interface SaveDataV1 {
  version: 1;
  timestamp: number;
  bones: number;
  coins: number;
  collectedBoneIds: string[];
  collectedCoinIds: string[];
  activeQuestId: string;
  quests: Quest[];
  unlockedAreas: string[];
  customization: DogCustomization;
  settings: GameSettings;
  dogPosition?: [number, number, number];
}

export interface MobileInputState {
  moveX: number; // -1 to 1
  moveY: number; // -1 to 1
  jump: boolean;
  sprint: boolean;
  bark: boolean;
  interact: boolean;
}
