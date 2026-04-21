import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { queryKeys } from '@shared/queryClient';
import { useAppContext } from '@context/AppContext';
import { audioPresetSchema, pbCollections } from '@shared/pbSchema';

export const useRadioPreset = () => {
    const { pb } = useAppContext();

    return useQuery({
        queryFn: async () => {
            return pb
                .collection(pbCollections.audio_presets)
                .getFirstListItem<AudioPresetRecord>(`${audioPresetSchema.slug} = "radio"`, {
                    expand: audioPresetSchema.audio,
                });
        },
        queryKey: queryKeys.radioAudioPreset,
    });
};
