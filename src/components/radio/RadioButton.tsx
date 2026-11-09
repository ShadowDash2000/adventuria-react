import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import { FaRadio } from 'react-icons/fa6';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';

interface RadioButtonProps extends IconButtonProps {}

export const RadioButton = ({ ...props }: RadioButtonProps) => {
    const { isPlaying } = useAudioPlayer(AudioKey.radio);

    return (
        <IconButton {...props}>
            <FaRadio
                data-playing={isPlaying}
                data-not-playing={!isPlaying}
                className="radio-icon"
            />
        </IconButton>
    );
};
