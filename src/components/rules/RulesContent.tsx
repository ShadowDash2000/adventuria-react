import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { LuLoader } from 'react-icons/lu';
import NotFound from '@components/pages/404';
import { Flex, Text } from '@chakra-ui/react';
import type { ClientResponseError } from 'pocketbase';
import type { RuleRecord } from '@shared/types/rules';
import { RulesItem } from '@components/rules/RulesItem';

export const RulesContent = () => {
    const { pb } = useAppContext();

    const rules = useQuery({
        queryFn: () => pb.collection('rules').getFullList<RuleRecord>({ sort: 'sort' }),
        queryKey: [...queryKeys.rules, 'rules'],
        refetchOnWindowFocus: false,
    });

    if (rules.isPending) {
        return <LuLoader />;
    }

    if (rules.isError) {
        const e = rules.error as ClientResponseError;
        if (e.status === 404) return <NotFound />;

        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Flex gap={4} direction="column">
            {rules.data.map((rule, index) => (
                <RulesItem key={rule.id} rule={rule} defaultOpen={index === 0} />
            ))}
        </Flex>
    );
};
