import { useParams } from 'react-router-dom';
import { CollectionListInfiniteProvider } from '@context/CollectionListInfiniteContext';
import { useAppContext } from '@context/AppContext';
import { Sort } from '@shared/hook/useSort';
import { CollectionOneFilterProvider } from '@context/CollectionOneFilterContext';
import { Flex } from '@chakra-ui/react';
import { UserProfile } from '../profile/UserProfile';
import { ActionsList } from '@components/ActionsList';

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
                    pageSize={10}
                    initialSort={new Map([['created', Sort.DESC]])}
                    filter={`user.name = "${login}"`}
                    expand={
                        'activity,cell,user,' +
                        'cell.filter.platforms,cell.filter.activities,cell.filter.developers,' +
                        'cell.filter.publishers,cell.filter.genres,cell.filter.tags,' +
                        'cell.filter.themes'
                    }
                >
                    <UserProfile />
                    <ActionsList />
                </CollectionListInfiniteProvider>
            </CollectionOneFilterProvider>
        </Flex>
    );
};

export default Profile;
