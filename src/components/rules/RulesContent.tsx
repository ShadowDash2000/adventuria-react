import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import NotFound from '@components/pages/404';
import { Flex, type FlexProps, Spinner, Text } from '@chakra-ui/react';
import type { ClientResponseError } from 'pocketbase';
import type { RuleRecord } from '@shared/types/rules';
import { RulesItem } from '@components/rules/RulesItem';

export const RulesContent = ({ ...props }: FlexProps) => {
    const { pb } = useAppContext();

    const rules = useQuery({
        queryFn: () => pb.collection('rules').getFullList<RuleRecord>({ sort: 'sort' }),
        queryKey: [...queryKeys.rules, 'rules'],
        refetchOnWindowFocus: false,
    });

    if (rules.isPending) {
        return <Spinner />;
    }

    if (rules.isError) {
        const e = rules.error as ClientResponseError;
        if (e.status === 404) return <NotFound />;

        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Flex {...props}>
            {rules.data.map((rule, index) => (
                <RulesItem key={rule.id} rule={rule} defaultOpen={index === 0} />
            ))}
        </Flex>
    );
};
