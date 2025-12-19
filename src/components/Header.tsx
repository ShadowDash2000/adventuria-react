import { Flex } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { LoginModalButton } from './LoginModalButton';
import { Button } from '@ui/button';
import { Link } from 'react-router-dom';
import { CollectionListAllProvider } from '@context/CollectionListAllContext/CollectionListAllContext';
import { PlayersFloatingList } from './PlayersFloatingList';
import { UserMenu } from '@components/user-menu/UserMenu';

export const Header = () => {
    const { pb } = useAppContext();
    const { isAuth, logout } = useAppContext();

    return (
        <>
            <Flex py={4} justify="center" gap={5} wrap="wrap">
                <Button asChild>
                    <Link to="/">Главная</Link>
                </Button>
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
            </CollectionListAllProvider>
            {isAuth && <UserMenu />}
        </>
    );
};
