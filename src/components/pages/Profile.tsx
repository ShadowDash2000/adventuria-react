import { useParams } from 'react-router-dom';
import { useAppContext } from '@context/AppContext';
import { CollectionOneFilterProvider } from '@context/CollectionOneFilterContext';
import { Flex } from '@chakra-ui/react';
import { UserProfile } from '../profile/UserProfile';
import { ActionsList } from '@components/actions-list/ActionsList';
import { CellInfoModal } from '@components/board/cells/cell-info/CellInfoModal';

const Profile = () => {
    const { pb } = useAppContext();
    const login = useParams().login;

    return (
        <Flex w={{ base: '60vw', mdDown: '100%' }} direction="column" gap="{spacing.5}">
            <CollectionOneFilterProvider
                collection={pb.collection('users')}
                filter={`name = "${login}"`}
            >
                <UserProfile />
            </CollectionOneFilterProvider>
            <CellInfoModal />
            <ActionsList userName={login} />
        </Flex>
    );
};

export default Profile;
