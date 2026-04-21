import { useParams } from 'react-router-dom';
import { useAppContext } from '@context/AppContext';
import { CollectionOneFilterProvider } from '@context/CollectionOneFilterContext';
import { Flex } from '@chakra-ui/react';
import { PlayerProfile } from '../profile/PlayerProfile';
import { ActionsList } from '@components/actions-list/ActionsList';
import { CellInfoModal } from '@components/board/cells/cell-info/CellInfoModal';
import { pbCollections } from '@shared/pbSchema';

const Profile = () => {
    const { pb } = useAppContext();
    const login = useParams().login;

    return (
        <Flex w={{ base: '1280px', xlDown: 'vw' }} direction="column" gap="{spacing.5}">
            <CollectionOneFilterProvider
                collection={pb.collection(pbCollections.players)}
                filter={`name = "${login}"`}
            >
                <PlayerProfile />
            </CollectionOneFilterProvider>
            <CellInfoModal />
            <ActionsList playerName={login} />
        </Flex>
    );
};

export default Profile;
