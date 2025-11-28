import {type FC} from "react";
import {useCollectionListAll} from "@context/CollectionListAllContext";
import {UserRecord} from "@shared/types/user";
import {Flex as ChakraFlex, Collapsible, For, Separator, HStack} from "@chakra-ui/react";
import {Flex} from "@ui/flex";
import {LuChevronUp} from "react-icons/lu";
import {Link} from "react-router-dom";
import {Avatar} from "../Avatar";

export const PlayersFloatingList: FC = () => {
    const {data: users} = useCollectionListAll<UserRecord>();

    return (
        <ChakraFlex
            zIndex={60}
            position="fixed"
            left={0}
            visibility={{base: 'visible', lgDown: 'hidden'}}
        >
            <Collapsible.Root
                defaultOpen
                minW="18rem"
            >
                <Collapsible.Trigger
                    w="100%"
                    py={3}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    justifyContent="start"
                >
                    Игроки
                    <Collapsible.Indicator
                        transition="transform 0.2s"
                        _open={{transform: "rotate(180deg)"}}
                    >
                        <LuChevronUp/>
                    </Collapsible.Indicator>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <Flex flexDir="column" p={5}>
                        <For each={users}>
                            {(user, index) => (
                                <Link to={`/profile/${user.name}`} key={index}>
                                    <HStack minH={16}>
                                        <Avatar user={user}/>
                                        {user.name}
                                    </HStack>
                                    <Separator size="md" borderColor="white" variant="dashed"/>
                                </Link>
                            )}
                        </For>
                    </Flex>
                </Collapsible.Content>
            </Collapsible.Root>
        </ChakraFlex>
    )
}