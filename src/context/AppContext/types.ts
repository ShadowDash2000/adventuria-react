import type { ReactNode } from 'react';
import type PocketBase from 'pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

type AppContextBase = {
    pb: PocketBase;
    login: () => void;
    logout: () => void;
} & CurrentSeasonState;

export type AppContextAuth = AppContextBase & {
    isAuth: true;
    player: PlayerRecord;
} & AvailableActionsState &
    PlayerProgressState;

export type AppContextGuest = AppContextBase & {
    isAuth: false;
    player: null;
} & AvailableActionsGuestState &
    PlayerProgressGuestState;

export type AppProviderType = AppContextAuth | AppContextGuest;

export type AppContextProviderProps = { children: ReactNode };

type AvailableActionsState =
    | {
          availableActions: string[];
          isAvailableActionsPending: false;
          isAvailableActionsSuccess: true;
          isAvailableActionsError: false;
          availableActionsError: null;
      }
    | {
          availableActions: string[];
          isAvailableActionsPending: boolean;
          isAvailableActionsSuccess: false;
          isAvailableActionsError: boolean;
          availableActionsError: Error;
      };

type AvailableActionsGuestState = {
    availableActions: string[];
    isAvailableActionsPending: false;
    isAvailableActionsSuccess: false;
    isAvailableActionsError: false;
    availableActionsError: null;
};

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

type PlayerProgressGuestState = {
    playerProgress: null;
    isPlayerProgressPending: false;
    isPlayerProgressSuccess: false;
    isPlayerProgressError: false;
    playerProgressError: null;
};
