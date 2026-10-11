import { create } from 'zustand';
import {
  DogAnimationState,
  DogCustomization,
  GameSettings,
  GameStateStatus,
  MobileInputState,
  Quest,
  SaveDataV1,
} from '@/types/game';
import {
  getDefaultSaveData,
  hasExistingSave,
  loadGame,
  saveGame,
  INITIAL_QUESTS,
} from '@/utils/saveSystem';
import { soundManager } from '@/utils/soundManager';

interface GameStoreState {
  gameState: GameStateStatus;
  bones: number;
  coins: number;
  collectedBoneIds: string[];
  collectedCoinIds: string[];
  quests: Quest[];
  activeQuestId: string;
  unlockedAreas: string[];
  customization: DogCustomization;
  settings: GameSettings;
  animationState: DogAnimationState;
  interactionPrompt: string | null;
  activeInteractionAction: (() => void) | null;
  barkCounter: number;
  completedQuestCelebration: Quest | null;
  feedbackMessage: string | null;
  mobileInput: MobileInputState;
  hasSaveFile: boolean;

  // Actions
  initSaveState: () => void;
  startGame: (isContinue?: boolean) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  quitToMenu: () => void;
  setAnimationState: (state: DogAnimationState) => void;
  setInteractionPrompt: (prompt: string | null, action?: (() => void) | null) => void;
  collectBone: (id: string) => void;
  collectCoin: (id: string) => void;
  bark: () => void;
  interact: () => void;
  feedDog: () => void;
  sleepDog: () => void;
  updateQuestProgress: (questId: string, amount: number) => void;
  claimQuestReward: (questId: string) => void;
  dismissCelebration: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  setCustomization: (newCustom: Partial<DogCustomization>) => void;
  setMobileInput: (input: Partial<MobileInputState>) => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameState: 'menu',
  bones: 0,
  coins: 0,
  collectedBoneIds: [],
  collectedCoinIds: [],
  quests: INITIAL_QUESTS,
  activeQuestId: 'quest_bones',
  unlockedAreas: ['green_meadow'],
  customization: { collarColor: '#e63946', furTone: 'corgi_golden' },
  settings: {
    masterVolume: 0.8,
    bgmVolume: 0.5,
    sfxVolume: 0.8,
    cameraSensitivity: 1.0,
    graphicsQuality: 'high',
  },
  animationState: 'idle',
  interactionPrompt: null,
  activeInteractionAction: null,
  barkCounter: 0,
  completedQuestCelebration: null,
  feedbackMessage: null,
  mobileInput: {
    moveX: 0,
    moveY: 0,
    jump: false,
    sprint: false,
    bark: false,
    interact: false,
  },
  hasSaveFile: false,

  initSaveState: () => {
    const exists = hasExistingSave();
    set({ hasSaveFile: exists });
  },

  startGame: (isContinue = false) => {
    let loaded: SaveDataV1;
    if (isContinue && hasExistingSave()) {
      loaded = loadGame();
    } else {
      loaded = getDefaultSaveData();
      saveGame(loaded);
    }

    soundManager.setVolumes(
      loaded.settings.masterVolume,
      loaded.settings.bgmVolume,
      loaded.settings.sfxVolume
    );
    soundManager.startBGM();

    set({
      gameState: 'playing',
      bones: loaded.bones,
      coins: loaded.coins,
      collectedBoneIds: loaded.collectedBoneIds,
      collectedCoinIds: loaded.collectedCoinIds,
      quests: loaded.quests,
      activeQuestId: loaded.activeQuestId,
      unlockedAreas: loaded.unlockedAreas,
      customization: loaded.customization,
      settings: loaded.settings,
      hasSaveFile: true,
      animationState: 'idle',
      interactionPrompt: null,
      activeInteractionAction: null,
    });
  },

  pauseGame: () => {
    const s = get();
    if (s.gameState === 'playing') {
      // Auto save on pause
      saveGame({
        version: 1,
        timestamp: Date.now(),
        bones: s.bones,
        coins: s.coins,
        collectedBoneIds: s.collectedBoneIds,
        collectedCoinIds: s.collectedCoinIds,
        activeQuestId: s.activeQuestId,
        quests: s.quests,
        unlockedAreas: s.unlockedAreas,
        customization: s.customization,
        settings: s.settings,
      });
      set({ gameState: 'paused' });
    }
  },

  resumeGame: () => {
    const s = get();
    if (s.gameState === 'paused') {
      set({ gameState: 'playing' });
    }
  },

  quitToMenu: () => {
    const s = get();
    saveGame({
      version: 1,
      timestamp: Date.now(),
      bones: s.bones,
      coins: s.coins,
      collectedBoneIds: s.collectedBoneIds,
      collectedCoinIds: s.collectedCoinIds,
      activeQuestId: s.activeQuestId,
      quests: s.quests,
      unlockedAreas: s.unlockedAreas,
      customization: s.customization,
      settings: s.settings,
    });
    set({ gameState: 'menu', hasSaveFile: true });
  },

  setAnimationState: (animState: DogAnimationState) => {
    if (get().animationState !== animState) {
      set({ animationState: animState });
    }
  },

  setInteractionPrompt: (prompt, action = null) => {
    set({ interactionPrompt: prompt, activeInteractionAction: action });
  },

  collectBone: (id: string) => {
    const s = get();
    if (s.collectedBoneIds.includes(id)) return;

    soundManager.playBoneCollect();
    const newCollected = [...s.collectedBoneIds, id];
    const newBones = s.bones + 1;

    // Check bone quest progress
    const updatedQuests = s.quests.map((q) => {
      if (q.id === 'quest_bones' && !q.completed) {
        const nextProgress = Math.min(q.targetProgress, q.currentProgress + 1);
        const isDone = nextProgress >= q.targetProgress;
        return {
          ...q,
          currentProgress: nextProgress,
          completed: isDone,
        };
      }
      return q;
    });

    const justFinishedQuest = updatedQuests.find(
      (q) => q.id === 'quest_bones' && q.completed && !s.quests.find((oldQ) => oldQ.id === 'quest_bones')?.completed
    );

    set({
      bones: newBones,
      collectedBoneIds: newCollected,
      quests: updatedQuests,
      feedbackMessage: '+1 Golden Bone!',
    });

    if (justFinishedQuest) {
      get().claimQuestReward('quest_bones');
    }

    // Auto save
    saveGame({
      version: 1,
      timestamp: Date.now(),
      bones: newBones,
      coins: s.coins,
      collectedBoneIds: newCollected,
      collectedCoinIds: s.collectedCoinIds,
      activeQuestId: s.activeQuestId,
      quests: updatedQuests,
      unlockedAreas: s.unlockedAreas,
      customization: s.customization,
      settings: s.settings,
    });
  },

  collectCoin: (id: string) => {
    const s = get();
    if (s.collectedCoinIds.includes(id)) return;

    soundManager.playCoin();
    const newCollected = [...s.collectedCoinIds, id];
    const newCoins = s.coins + 10;

    set({
      coins: newCoins,
      collectedCoinIds: newCollected,
      feedbackMessage: '+10 Coins!',
    });
  },

  bark: () => {
    const s = get();
    soundManager.playBark();
    set((state) => ({
      barkCounter: state.barkCounter + 1,
      animationState: 'barking',
    }));

    // Trigger friendly greeting quest if player barks near Barnaby
    if (s.interactionPrompt?.toLowerCase().includes('barnaby')) {
      s.updateQuestProgress('quest_bark_npc', 1);
    }

    setTimeout(() => {
      if (get().animationState === 'barking') {
        set({ animationState: 'idle' });
      }
    }, 600);
  },

  interact: () => {
    const action = get().activeInteractionAction;
    if (action) {
      action();
    } else {
      soundManager.playSniff();
      set({ animationState: 'sniffing' });
      setTimeout(() => {
        if (get().animationState === 'sniffing') {
          set({ animationState: 'idle' });
        }
      }, 700);
    }
  },

  feedDog: () => {
    soundManager.playSniff();
    set({
      animationState: 'eating',
      feedbackMessage: 'Yum! Your puppy enjoyed a tasty snack.',
    });
    setTimeout(() => {
      if (get().animationState === 'eating') {
        set({ animationState: 'idle' });
      }
    }, 1800);
  },

  sleepDog: () => {
    set({
      animationState: 'sleeping',
      feedbackMessage: 'Zzz... Your puppy is taking a nap. Move to wake up.',
    });
  },

  updateQuestProgress: (questId: string, amount: number) => {
    const s = get();
    const quest = s.quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    const nextVal = Math.min(quest.targetProgress, quest.currentProgress + amount);
    const isCompleted = nextVal >= quest.targetProgress;

    const updatedQuests = s.quests.map((q) =>
      q.id === questId ? { ...q, currentProgress: nextVal, completed: isCompleted } : q
    );

    set({ quests: updatedQuests });

    if (isCompleted) {
      get().claimQuestReward(questId);
    }
  },

  claimQuestReward: (questId: string) => {
    const s = get();
    const quest = s.quests.find((q) => q.id === questId);
    if (!quest || quest.rewardClaimed) return;

    soundManager.playQuestComplete();

    const newBones = s.bones + quest.rewardBones;
    const newCoins = s.coins + quest.rewardCoins;

    const updatedQuests = s.quests.map((q) =>
      q.id === questId ? { ...q, completed: true, rewardClaimed: true } : q
    );

    // Pick next active quest if current was finished
    const nextUnfinished = updatedQuests.find((q) => !q.completed);
    const nextActiveId = nextUnfinished ? nextUnfinished.id : questId;

    set({
      bones: newBones,
      coins: newCoins,
      quests: updatedQuests,
      activeQuestId: nextActiveId,
      completedQuestCelebration: quest,
      feedbackMessage: `Quest Completed: ${quest.title}!`,
    });

    saveGame({
      version: 1,
      timestamp: Date.now(),
      bones: newBones,
      coins: newCoins,
      collectedBoneIds: s.collectedBoneIds,
      collectedCoinIds: s.collectedCoinIds,
      activeQuestId: nextActiveId,
      quests: updatedQuests,
      unlockedAreas: s.unlockedAreas,
      customization: s.customization,
      settings: s.settings,
    });
  },

  dismissCelebration: () => {
    set({ completedQuestCelebration: null, feedbackMessage: null });
  },

  updateSettings: (newSettings) => {
    const s = get();
    const merged = { ...s.settings, ...newSettings };
    soundManager.setVolumes(merged.masterVolume, merged.bgmVolume, merged.sfxVolume);
    set({ settings: merged });
  },

  setCustomization: (newCustom) => {
    const s = get();
    const merged = { ...s.customization, ...newCustom };
    set({ customization: merged });
  },

  setMobileInput: (input) => {
    set((state) => ({
      mobileInput: { ...state.mobileInput, ...input },
    }));
  },

  resetProgress: () => {
    const defaults = getDefaultSaveData();
    saveGame(defaults);
    set({
      bones: 0,
      coins: 0,
      collectedBoneIds: [],
      collectedCoinIds: [],
      quests: JSON.parse(JSON.stringify(INITIAL_QUESTS)),
      activeQuestId: 'quest_bones',
      unlockedAreas: ['green_meadow'],
      customization: { collarColor: '#e63946', furTone: 'corgi_golden' },
      completedQuestCelebration: null,
      feedbackMessage: 'Progress reset to new game.',
    });
  },
}));
