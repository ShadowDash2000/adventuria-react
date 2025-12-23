import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { queryKeys } from '@shared/queryClient';
import { useAppContext } from '@context/AppContext';

export const useRadioPreset = () => {
    const { pb } = useAppContext();

    return useQuery({
        queryFn: async () => {
            return pb
                .collection('audio_presets')
                .getFirstListItem<AudioPresetRecord>('slug = "radio"', { expand: 'audio' });
        },
        queryKey: queryKeys.radioAudioPreset,
    });
};
