import {UserAvatar} from "./Avatar.jsx";
import {Box, Button, ButtonGroup, HStack, Skeleton} from "@chakra-ui/react";
import {LoginModal} from "./LoginModal.jsx";
import {Suspense, useState} from "react";
import {useAppContext} from "../context/AppContextProvider.jsx";
import {HeaderTabs} from "./HeaderTabs.jsx";

export const Header = () => {
    const {user} = useAppContext();

    return (
        <Box py={4} px={28} className="flex justify-between items-end">
            <ButtonGroup size={'md'}>
                <LoginModal/>
                <Button
                    rounded={'lg'}
                    colorPalette={'green'}
                >
                    Правила
                </Button>
            </ButtonGroup>
            <Suspense fallback={
                <HStack width="50%">
                    <Skeleton height="10" width="25%"/>
                    <Skeleton height="10" width="25%"/>
                    <Skeleton height="10" width="25%"/>
                    <Skeleton height="10" width="25%"/>
                </HStack>
            }>
                <HeaderTabs/>
            </Suspense>
            <UserAvatar user={user}/>
        </Box>
    )
}