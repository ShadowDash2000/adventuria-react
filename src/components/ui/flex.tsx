import {Flex as ChakraFlex, chakra} from "@chakra-ui/react";

export const Flex = chakra(ChakraFlex, {
    base: {
        bgImage: "linear-gradient(rgb(13, 34, 137), rgb(6, 9, 59))",
        boxShadow: "rgba(0, 0, 0, 0.3) 0 0 {spacing.1} {spacing.1} inset",
        border: "{spacing.0.5} solid rgb(198, 198, 198)",
        borderRadius: 12,

        _before: {
            content: '""',
            pointerEvents: 'none',
            inset: 0,
            position: 'absolute',
            border: '{spacing.1} solid white',
            borderRadius: 10,
        }
    },
});