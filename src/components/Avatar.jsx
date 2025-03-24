import {Avatar, defineStyle} from "@chakra-ui/react";

export const UserAvatar = ({src = '', color = 'white'}) => {
    const ringCss = defineStyle({
        outlineWidth: "3px",
        outlineColor: "colorPalette.500",
        outlineOffset: "2px",
        outlineStyle: "solid",
    })

    return (
        <Avatar.Root css={ringCss} colorPalette={color}>
            <Avatar.Fallback></Avatar.Fallback>
            <Avatar.Image src={src}></Avatar.Image>
        </Avatar.Root>
    )
}