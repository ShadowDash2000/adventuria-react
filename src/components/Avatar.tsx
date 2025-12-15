import { type RefObject } from 'react';
import { Avatar as ChakraAvatar, type AvatarRootProps } from '@chakra-ui/react/avatar';
import type { UserRecord } from '@shared/types/user';
import { useAppContext } from '@context/AppContext';

interface AvatarProps extends AvatarRootProps {
    ref?: RefObject<HTMLDivElement | null>;
    user: UserRecord;
}

export const Avatar = ({ user, ref, ...props }: AvatarProps) => {
    const { pb } = useAppContext();
    const avatar = pb.files.getURL(user, user.avatar);

    return (
        <ChakraAvatar.Root
            ref={ref}
            outlineWidth=".25vw"
            outlineColor={user.color}
            outlineOffset="{spacing.0.5}"
            outlineStyle="solid"
            {...props}
        >
            <ChakraAvatar.Image src={avatar} />
        </ChakraAvatar.Root>
    );
};
