import { Image, type ImageProps } from '@chakra-ui/react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useAppContext } from '@context/AppContext';

interface CoverProps extends ImageProps {
    activity: { collectionName: string; id: RecordIdString; cover: string; cover_alt: string };
}

export const Cover = ({ activity, ...rest }: CoverProps) => {
    const { pb } = useAppContext();

    return (
        <Image {...rest} src={activity.cover || pb.files.getURL(activity, activity.cover_alt)} />
    );
};
