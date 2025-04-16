import {Avatar, defineStyle} from "@chakra-ui/react";
import {useAppContext} from "../context/AppContextProvider.jsx";

export const UserAvatar = ({user}) => {
    const {pb} = useAppContext();

    const ringCss = defineStyle({
        outlineWidth: "3px",
        outlineColor: user?.color ? user.color : 'white',
        outlineOffset: "2px",
        outlineStyle: "solid",
    })

    return (
        <Avatar.Root css={ringCss}>
            <Avatar.Fallback></Avatar.Fallback>
            {
                user?.avatar ?
                    <Avatar.Image src={pb.files.getURL(user, user.avatar)}/>
                    : null
            }
        </Avatar.Root>
    )
}