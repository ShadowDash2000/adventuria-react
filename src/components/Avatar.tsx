import { type RefObject, useMemo } from 'react';
import { Avatar as ChakraAvatar, type AvatarRootProps } from '@chakra-ui/react/avatar';
import type { UserRecord } from '@shared/types/user';
import { useAppContext } from '@context/AppContextProvider';

interface AvatarProps extends AvatarRootProps {
    ref?: RefObject<HTMLDivElement | null>;
    user: UserRecord;
}

export const Avatar = ({ user, ref, ...props }: AvatarProps) => {
    const { pb } = useAppContext();
    const avatar = useMemo(() => pb.files.getURL(user, user.avatar), [user.avatar]);

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
