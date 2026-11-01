import { Image, type ImageProps } from '@chakra-ui/react';

interface CoverProps extends ImageProps {
    coverUrl?: string;
    coverAltUrl?: string;
}

export const Cover = ({ coverUrl, coverAltUrl, ...rest }: CoverProps) => {
    return <Image {...rest} src={coverUrl || coverAltUrl} />;
};
