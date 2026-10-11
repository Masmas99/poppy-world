import { Quest, SaveDataV1, GameSettings, DogCustomization } from '@/types/game';

const SAVE_KEY = 'PW_SAVE_V1';

export const INITIAL_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  cameraSensitivity: 1.0,
  graphicsQuality: 'high',
};

export const INITIAL_CUSTOMIZATION: DogCustomization = {
  collarColor: '#e63946', // vibrant red collar
  furTone: 'corgi_golden',
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_bones',
    title: 'Snack Search',
    description: 'Find and collect 5 golden bones hidden around Green Meadow.',
    type: 'collect',
    currentProgress: 0,
    targetProgress: 5,
    rewardBones: 3,
    rewardCoins: 50,
    completed: false,
    rewardClaimed: false,
  },
  {
    id: 'quest_fetch',
    title: 'Playful Fetch',
    description: 'Find the red bouncy ball and kick or roll it back near the Doghouse!',
    type: 'fetch',
    currentProgress: 0,
    targetProgress: 1,
    rewardBones: 2,
    rewardCoins: 30,
    completed: false,
    rewardClaimed: false,
  },
  {
    id: 'quest_bark_npc',
    title: 'Friendly Greeting',
    description: 'Find Barnaby the Cat near the windmill and give a friendly bark (Q)!',
    type: 'interaction',
    currentProgress: 0,
    targetProgress: 1,
    rewardBones: 2,
    rewardCoins: 40,
    completed: false,
    rewardClaimed: false,
  },
];

export const getDefaultSaveData = (): SaveDataV1 => ({
  version: 1,
  timestamp: Date.now(),
  bones: 0,
  coins: 0,
  collectedBoneIds: [],
  collectedCoinIds: [],
  activeQuestId: 'quest_bones',
  quests: JSON.parse(JSON.stringify(INITIAL_QUESTS)),
  unlockedAreas: ['green_meadow'],
  customization: { ...INITIAL_CUSTOMIZATION },
  settings: { ...INITIAL_SETTINGS },
});

export const saveGame = (data: SaveDataV1): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const payload: SaveDataV1 = {
      ...data,
      version: 1,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('Failed to save Puppy World data:', err);
    return false;
  }
};

export const loadGame = (): SaveDataV1 => {
  if (typeof window === 'undefined') return getDefaultSaveData();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return getDefaultSaveData();

    const parsed = JSON.parse(raw);

    // Validate schema
    if (parsed && parsed.version === 1 && Array.isArray(parsed.collectedBoneIds)) {
      return {
        version: 1,
        timestamp: parsed.timestamp || Date.now(),
        bones: typeof parsed.bones === 'number' ? parsed.bones : 0,
        coins: typeof parsed.coins === 'number' ? parsed.coins : 0,
        collectedBoneIds: parsed.collectedBoneIds || [],
        collectedCoinIds: parsed.collectedCoinIds || [],
        activeQuestId: parsed.activeQuestId || 'quest_bones',
        quests: Array.isArray(parsed.quests) && parsed.quests.length > 0 ? parsed.quests : INITIAL_QUESTS,
        unlockedAreas: Array.isArray(parsed.unlockedAreas) ? parsed.unlockedAreas : ['green_meadow'],
        customization: {
          ...INITIAL_CUSTOMIZATION,
          ...(parsed.customization || {}),
        },
        settings: {
          ...INITIAL_SETTINGS,
          ...(parsed.settings || {}),
        },
        dogPosition: parsed.dogPosition,
      };
    }
    console.warn('Incompatible save version found, reverting to fallback defaults.');
    return getDefaultSaveData();
  } catch (err) {
    console.error('Error loading save data, using defaults:', err);
    return getDefaultSaveData();
  }
};

export const hasExistingSave = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem(SAVE_KEY);
  } catch {
    return false;
  }
};
