import { LuFerrisWheel } from 'react-icons/lu';
import { Button as ThemeButton } from '@theme/button';
import { invalidateAllActions } from '@shared/queryClient';
import { useAppContext } from '@context/AppContext';
import { useState } from 'react';
import { handleApiResponse } from '@shared/helpers/api';

export const Button = () => {
    const { pb } = useAppContext();
    const [loading, setLoading] = useState(false);

    const handleGenerateWheel = async () => {
        const res = await generateWheelRequest(pb.authStore.token);

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateAllActions();
    };

    return (
        <>
            <ThemeButton
                colorPalette="purple"
                loading={loading}
                onClick={async () => {
                    try {
                        setLoading(true);
                        await handleGenerateWheel();
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <LuFerrisWheel />
                Сгенерировать колесо
            </ThemeButton>
        </>
    );
};

type GenerateWheelSuccess = { success: true; message?: string; error?: never };

type GenerateWheelError = { success: false; message: string; error?: string };

type GenerateWheelResult = GenerateWheelSuccess | GenerateWheelError;

const generateWheelRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/generate-wheel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    });

    return (await res.json()) as GenerateWheelResult;
};
