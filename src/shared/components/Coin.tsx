import CoinImage from '@public/coin.png';
import { Image, ImageProps } from '@chakra-ui/react';

export const Coin = ({ ...props }: ImageProps) => {
    return <Image {...props} src={CoinImage} />;
};
