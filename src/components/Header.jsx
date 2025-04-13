import {UserAvatar} from "./Avatar.jsx";
import Undefined from '/src/assets/undefined.jpg';
import {Box, Button, ButtonGroup, For, HStack, Skeleton, Tabs, useTabs} from "@chakra-ui/react";
import {LoginModal} from "./LoginModal.jsx";
import {LuHouse, LuUser} from "react-icons/lu";
import {useUsersStore} from "../pocketbase/users.js";
import {Link, useParams} from "react-router-dom";
import {useState} from "react";

export const Header = () => {
    const params = useParams();
    const [tabValue, setTabValue] = useState(params?.login || 'main');
    const users = useUsersStore((state) => state.users);

    const isLoading = users.size === 0;

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
            {isLoading ? (
                <HStack width="50%">
                    <Skeleton height="10" width="25%"/>
                    <Skeleton height="10" width="25%"/>
                    <Skeleton height="10" width="25%"/>
                    <Skeleton height="10" width="25%"/>
                </HStack>
            ) : (
                <Tabs.Root value={tabValue} onValueChange={(e) => setTabValue(e.value)} variant={'plain'}>
                    <Tabs.List bg={'bg.muted'} rounded={'lg'}>
                        <Tabs.Trigger value="main" asChild>
                            <Link to={`/`}>
                                <LuHouse/>
                                Главная
                            </Link>
                        </Tabs.Trigger>
                        <For each={Array.from(users.values())}>
                            {(item, index) => (
                                <Tabs.Trigger key={index} value={item.name} asChild>
                                    <Link to={`/profile/${item.name}`}>
                                        <LuUser/>
                                        {item.name}
                                    </Link>
                                </Tabs.Trigger>
                            )}
                        </For>
                        <Tabs.Indicator rounded={'lg'} bg={'purple.400'}/>
                    </Tabs.List>
                </Tabs.Root>
            )}
            <>
                <div>
                    <UserAvatar src={Undefined} color={'green'}/>
                </div>
            </>
        </Box>
    )
}