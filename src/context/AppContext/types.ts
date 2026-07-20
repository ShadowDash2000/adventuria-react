import type { ReactNode } from 'react';
import type PocketBase from 'pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

type AppContextBase = {
    pb: PocketBase;
    availableActions: string[];
    login: () => void;
    logout: () => void;
} & CurrentSeasonState;

export type AppContextAuth = AppContextBase & {
    isAuth: true;
    player: PlayerRecord;
} & PlayerProgressState;

export type AppContextGuest = AppContextBase & {
    isAuth: false;
    player: null;
    playerProgress: null;
    isPlayerProgressPending: false;
    isPlayerProgressSuccess: false;
    isPlayerProgressError: false;
    playerProgressError: null;
};

export type AppProviderType = AppContextAuth | AppContextGuest;

export type AppContextProviderProps = { children: ReactNode };

type CurrentSeasonState =
    | {
          isCurrentSeasonSuccess: true;
          currentSeason: string;
          isCurrentSeasonPending: false;
          isCurrentSeasonError: false;
          currentSeasonError: null;
      }
    | {
          isCurrentSeasonSuccess: false;
          currentSeason: undefined;
          isCurrentSeasonPending: boolean;
          isCurrentSeasonError: boolean;
          currentSeasonError: Error | null;
      };

type PlayerProgressState =
    | {
          isPlayerProgressSuccess: true;
          playerProgress: PlayerProgressRecord;
          isPlayerProgressPending: false;
          isPlayerProgressError: false;
          playerProgressError: null;
      }
    | {
          isPlayerProgressSuccess: false;
          playerProgress: undefined;
          isPlayerProgressPending: boolean;
          isPlayerProgressError: boolean;
          playerProgressError: Error | null;
      };
