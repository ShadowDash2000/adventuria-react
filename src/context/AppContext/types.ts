import type { ReactNode } from 'react';
import type PocketBase from 'pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { RecordIdString } from '@shared/types/pocketbase';

type AppContextBase = { pb: PocketBase; login: () => void; logout: () => void };

export type AppContextAuth = AppContextBase & {
    isAuth: true;
    playerId: RecordIdString;
} & AvailableActionsState &
    GameState;

export type AppContextGuest = AppContextBase & {
    isAuth: false;
    playerId: null;
} & AvailableActionsGuestState &
    GameGuestState;

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

type GameAuth = {
    id: RecordIdString;
    disabled: boolean;
    debug: boolean;
    season: RecordIdString;
    current_world: RecordIdString;
    balance: number;
    energy: number;
    drops_in_a_row: number;
    item_wheels_count: number;
};

type GameGuest = { season: RecordIdString };

type GameState =
    | {
          gameState: GameAuth;
          isGameStateSuccess: true;
          isGameStatePending: false;
          isGameStateError: false;
          gameStateError: null;
      }
    | {
          gameState: undefined;
          isGameStateSuccess: false;
          isGameStatePending: boolean;
          isGameStateError: boolean;
          gameStateError: Error | null;
      };

type GameGuestState =
    | {
          gameState: GameGuest;
          isGameStateSuccess: true;
          isGameStatePending: false;
          isGameStateError: false;
          gameStateError: null;
      }
    | {
          gameState: undefined;
          isGameStateSuccess: false;
          isGameStatePending: boolean;
          isGameStateError: boolean;
          gameStateError: Error | null;
      };
