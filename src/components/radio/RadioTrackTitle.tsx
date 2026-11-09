import { Text } from '@chakra-ui/react';
import { useRadio } from '@components/radio/useRadio';

export const RadioTrackTitle = () => {
    const { currentTrack } = useRadio();

    return <Text>{currentTrack?.title || '-'}</Text>;
};
