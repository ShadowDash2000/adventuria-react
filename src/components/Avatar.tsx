import {type FC, useMemo} from "react";
import {Avatar as ChakraAvatar, type AvatarRootProps} from "@chakra-ui/react/avatar";
import type {UserRecord} from "@shared/types/user";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";

interface AvatarProps extends AvatarRootProps {
    user: UserRecord;
}

export const Avatar: FC<AvatarProps> = ({user, ...props}) => {
    const {pb} = useAppContext();
    const avatar = useMemo(() => pb.files.getURL(user, user.avatar), [user.avatar]);

    return (
        <ChakraAvatar.Root
            outlineWidth="{spacing.1}"
            outlineColor={user.color}
            outlineOffset="{spacing.0.5}"
            outlineStyle="solid"
            {...props}
        >
            <ChakraAvatar.Image src={avatar}/>
        </ChakraAvatar.Root>
    )
}