import { Flex } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { LoginModalButton } from './LoginModalButton';
import { Button } from '@ui/button';
import { Link } from 'react-router-dom';
import { CollectionListAllProvider } from '@context/CollectionListAllContext';
import { PlayersFloatingList } from './board/PlayersFloatingList';
import { Modal } from '@ui/modal';
import { Rules } from './Rules';
import { Settings } from './board/Settings';

export const Header = () => {
    const { pb } = useAppContext();
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
                fields={'id,collectionName,name,avatar,color'}
                refetchOnWindowFocus={false}
            >
                <PlayersFloatingList />
                <Settings />
            </CollectionListAllProvider>
        </>
    );
};
