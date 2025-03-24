import {UserAvatar} from "./Avatar.jsx";
import Undefined from '/src/assets/undefined.jpg';
import {Box, Button, ButtonGroup, For, Link, Tabs} from "@chakra-ui/react";
import {LoginModal} from "./LoginModal.jsx";
import {LuUser} from "react-icons/lu";
import {useUsersStore} from "../pocketbase/users.js";

export const Header = () => {
    const users = useUsersStore((state) => state.users);

    return (
        <header>
            <Box pt={3} px={28} className="flex justify-between items-end">
                <ButtonGroup size={'md'}>
                    <LoginModal/>
                    <Button
                        rounded={'lg'}
                        colorPalette={'green'}
                    >
                        Правила
                    </Button>
                </ButtonGroup>
                <Tabs.Root variant={'plain'} defaultValue={'1'}>
                    <Tabs.List bg={'bg.muted'} rounded={'lg'}>
                        <For each={Array.from(users.values())}
                        >
                            {(item, index) => (
                                <Tabs.Trigger key={item.id} value={index+1} asChild>
                                    <Link href={`/profile/${item.name}`}>
                                        <LuUser/>
                                        {item.name}
                                    </Link>
                                </Tabs.Trigger>
                            )}
                        </For>
                        <Tabs.Indicator rounded={'lg'} bg={'purple.400'}/>
                    </Tabs.List>
                    <Tabs.Content/>
                </Tabs.Root>
                <>
                    <div>
                        <UserAvatar src={Undefined} color={'green'}/>
                    </div>
                </>
            </Box>
        </header>
    )
}