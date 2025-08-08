import {Avatar as ChakraAvatar, defineStyle} from "@chakra-ui/react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {UserRecord} from "@shared/types/user";
import {FC} from "react";

interface UserAvatarProps {
    user: UserRecord;
}

export const Avatar: FC<UserAvatarProps> = ({user}) => {
    const {pb} = useAppContext();

    const ringCss = defineStyle({
        outlineWidth: "3px",
        outlineColor: user?.color ? user.color : 'white',
        outlineOffset: "2px",
        outlineStyle: "solid",
    })

    return (
        <ChakraAvatar.Root css={ringCss}>
            <ChakraAvatar.Fallback></ChakraAvatar.Fallback>
            {
                user?.avatar ?
                    <ChakraAvatar.Image src={pb.files.getURL(user, user.avatar)}/>
                    : null
            }
        </ChakraAvatar.Root>
    )
}