import { useAppAuthContext } from '@context/AppContext';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { type WheelOFortuneHandle } from '@components/actions/roll-wheel/WheelOFortune';
import { RefObject, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useRollWheelStore } from './useRollWheelStore';

export interface UseRollWheelProps {
    wheelRef: RefObject<WheelOFortuneHandle | null>;
    spinRequest: () => Promise<SpinResult>;
    audioPresetSlug: string;
    onSpinComplete?: (result: SpinResultData) => Promise<void> | void;
}

export type SpinSuccess = { success: true; data: SpinResultData; error?: never };
export type SpinError = { success: false; error: string; data?: never };
export type SpinResult = SpinSuccess | SpinError;
export type SpinResultData = { fillerItems: FillerItem[]; winnerId: RecordIdString };
export type FillerItem = { id: RecordIdString; name: string; icon: string };

export const useWheel = ({
    wheelRef,
    spinRequest,
    audioPresetSlug,
    onSpinComplete,
}: UseRollWheelProps) => {
    const { pb } = useAppAuthContext();
    const { play } = useAudioPlayer(AudioKey.music);
    const { isSpinning, setIsSpinning } = useRollWheelStore();
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    useEffect(() => {
        return () => setIsSpinning(false);
    }, [setIsSpinning]);

    const audioPreset = useQuery({
        queryFn: async () => {
            return pb
                .collection('audio_presets')
                .getFirstListItem<AudioPresetRecord>(`slug = "${audioPresetSlug}"`, {
                    expand: 'audio',
                    fields:
                        'audio,' +
                        'expand.audio.id,expand.audio.collectionName,expand.audio.audio,expand.audio.duration',
                });
        },
        refetchOnWindowFocus: false,
        queryKey: ['roll-wheel-audio-preset', audioPresetSlug],
    });

    const handleSpin = async () => {
        const ref = wheelRef.current;
        if (!ref) return;

        const res = await spinRequest();

        if (!res.success) return;

        let duration = 10;
        if (audioPreset.isSuccess) {
            const randIndex = Math.floor(Math.random() * audioPreset.data.audio.length);
            const randAudio = audioPreset.data.expand!.audio[randIndex];
            duration = randAudio.duration;
            const audioUrl = pb.files.getURL(randAudio, randAudio.audio);
            await play(audioUrl);
        }

        setIsSpinning(true);
        ref.spin({ targetKey: res.data.winnerId, durationMs: duration * 1000 }).then(
            async currentIndex => {
                setIsSpinning(false);
                setCurrentItemIndex(currentIndex);
                if (onSpinComplete) {
                    await onSpinComplete(res.data);
                }
            },
        );
    };

    return { spinning: isSpinning, handleSpin, currentItemIndex, setCurrentItemIndex, audioPreset };
};
