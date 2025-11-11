import {FC, useMemo} from "react";
import {UserRecord} from "@shared/types/user";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Avatar as ChakraAvatar} from "@chakra-ui/react/avatar";

interface PlayerProps {
    x?: number;
    y?: number;
    user: UserRecord;
}

export const Player: FC<PlayerProps> = (
    {
        x = 0,
        y = 0,
        user
    }
) => {
    const {pb} = useAppContext();
    const avatar = useMemo(() => pb.files.getURL(user, user.avatar), [user.avatar]);

    return (
        <ChakraAvatar.Root
            position="absolute"
            zIndex={10}
            outlineWidth="{spacing.1}"
            outlineColor={user.color}
            outlineOffset="{spacing.0.5}"
            outlineStyle="solid"
            transform={`translate(${x}, ${y})`}
        >
            <ChakraAvatar.Image src={avatar}/>
        </ChakraAvatar.Root>
    )
}