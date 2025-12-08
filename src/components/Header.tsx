import { Flex, HStack, Icon, IconButton, Text } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { LoginModalButton } from './LoginModalButton';
import { Button } from '@ui/button';
import { Link } from 'react-router-dom';
import { CollectionListAllProvider } from '@context/CollectionListAllContext';
import { PlayersFloatingList } from './board/PlayersFloatingList';
import { Modal } from '@ui/modal';
import { Rules } from './Rules';
import { Settings } from './board/Settings';
import { PlayerInventory } from './board/inventory/PlayerInventory';
import { ItemsWheelModal } from './board/actions/roll-wheel/ItemsWheelModal';
import { PiCoinVerticalFill } from 'react-icons/pi';
import { GiSwapBag } from 'react-icons/gi';
import { Tooltip } from '@ui/tooltip';
import { RadioPlayer } from './board/RadioPlayer';
import { FaRadio } from 'react-icons/fa6';

export const Header = () => {
    const { pb, user } = useAppContext();
    const { isAuth, logout } = useAppContext();

    return (
        <>
            <Flex py={4} justify="center" gap={5} wrap="wrap">
                <Button asChild>
                    <Link to="/">Главная</Link>
                </Button>
                <Modal
                    lazyMount
                    unmountOnExit
                    title="Правила"
                    trigger={
                        <Button
                            rounded={'lg'}
                            colorPalette="{colors.green}"
                            hoverColorPalette="{colors.green.hover}"
                        >
                            Правила
                        </Button>
                    }
                >
                    <Rules />
                </Modal>
                {isAuth ? (
                    <Button
                        colorPalette="{colors.red}"
                        hoverColorPalette="{colors.red.hover}"
                        onClick={() => logout()}
                    >
                        Выйти
                    </Button>
                ) : (
                    <LoginModalButton />
                )}
            </Flex>
            <CollectionListAllProvider
                collection={pb.collection('users')}
                fields={'id,collectionName,name,avatar,color,is_stream_live'}
                refetchOnWindowFocus={false}
            >
                <PlayersFloatingList />
                {isAuth && <Settings />}
            </CollectionListAllProvider>
            {isAuth && (
                <>
                    <HStack
                        position="fixed"
                        left={0}
                        bottom={0}
                        pl={4}
                        pb={10}
                        zIndex={100}
                        justify="center"
                        align="center"
                    >
                        <PlayerInventory
                            userId={user?.id!}
                            trigger={
                                <Tooltip content="Инвентарь">
                                    <IconButton>
                                        <GiSwapBag />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <ItemsWheelModal />
                        <RadioPlayer
                            trigger={
                                <Tooltip content="Радиопопия">
                                    <IconButton>
                                        <FaRadio />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                    </HStack>
                    <HStack
                        position="fixed"
                        right={0}
                        bottom={0}
                        pr={4}
                        pb={10}
                        zIndex={100}
                        justify="center"
                        align="center"
                    >
                        <Tooltip content="Баланс">
                            <HStack>
                                <Text fontSize="3rem">{user.balance}</Text>
                                <Icon w="4rem" h="4rem" color="yellow.400">
                                    <PiCoinVerticalFill />
                                </Icon>
                            </HStack>
                        </Tooltip>
                    </HStack>
                </>
            )}
        </>
    );
};
