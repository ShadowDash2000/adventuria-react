import { UserActionsList } from '../profile/UserActionsList';
import { useParams } from 'react-router-dom';
import { CollectionListInfiniteProvider } from '@context/CollectionListInfiniteContext';
import { useAppContext } from '@context/AppContext';
import { Sort } from '@shared/hook/useSort';
import { CollectionOneFilterProvider } from '@context/CollectionOneFilterContext';
import { Flex } from '@chakra-ui/react';
import { UserProfile } from '../profile/UserProfile';

const Profile = () => {
    const { pb } = useAppContext();
    const login = useParams().login;

    return (
        <Flex w={{ base: '60vw', mdDown: '100%' }} direction="column" gap="{spacing.5}">
            <CollectionOneFilterProvider
                collection={pb.collection('users')}
                filter={`name = "${login}"`}
            >
                <CollectionListInfiniteProvider
                    collection={pb.collection('actions')}
                    pageSize={24}
                    initialSort={new Map([['created', Sort.DESC]])}
                    filter={`user.name = "${login}"`}
                    expand="activity,cell,cell.filter.activities,user"
                >
                    <UserProfile />
                    <UserActionsList />
                </CollectionListInfiniteProvider>
            </CollectionOneFilterProvider>
        </Flex>
    );
};

export default Profile;
