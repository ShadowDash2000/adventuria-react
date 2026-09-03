import { type ReactNode, useState } from 'react';
import { ActionDispenser } from '../action-base';
import { Button } from '@theme/button';
import { FaFlagCheckered } from 'react-icons/fa';
import { useAppContext } from '@context/AppContext';
import { handleApiResponse } from '@shared/helpers/api';
import {
    invalidateAllActions,
    invalidateGameState,
    invalidatePlayersProgress,
} from '@shared/queryClient';

export class Start extends ActionDispenser {
    buttonNode(): ReactNode {
        return <StartButton />;
    }

    key() {
        return 'start';
    }
}

const StartButton = () => {
    const { pb } = useAppContext();
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        const res = await startRequest(pb.authStore.token);

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateAllActions();
        await invalidateGameState();
        await invalidatePlayersProgress();
    };

    return (
        <>
            <Button
                colorPalette="orange"
                loading={loading}
                onClick={async () => {
                    try {
                        setLoading(true);
                        await handleStart();
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <FaFlagCheckered />
                Начать!
            </Button>
        </>
    );
};

type StartSuccess = { success: true; message?: string; error?: never };

type StartError = { success: false; message: string; error: string };

type StartResult = StartSuccess | StartError;

const startRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as StartResult;
};
