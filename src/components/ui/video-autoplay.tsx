import { Video } from '@ui/video';
import { type HTMLChakraProps } from '@chakra-ui/react';

export const VideoAutoplay = ({ ...props }: HTMLChakraProps<'video'>) => {
    return (
        <Video
            {...props}
            controls
            muted
            onMouseEnter={e => {
                const video = e.target as HTMLVideoElement;
                video.play();
                if (video.muted) {
                    video.volume = 0.1;
                    video.muted = false;
                }
            }}
            onMouseLeave={e => (e.target as HTMLVideoElement).pause()}
        />
    );
};
