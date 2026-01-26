import { Box, Collapsible, Heading, Icon, Separator } from '@chakra-ui/react';
import type { RuleRecord } from '@shared/types/rules';
import { LuChevronUp } from 'react-icons/lu';

interface RulesItemProps extends Collapsible.RootProps {
    rule: RuleRecord;
}

export const RulesItem = ({ rule, ...rest }: RulesItemProps) => {
    return (
        <Collapsible.Root {...rest}>
            <Collapsible.Trigger
                w="full"
                display="flex"
                gap={2}
                alignItems="center"
                cursor="pointer"
            >
                <Heading as="h3">{rule.title}</Heading>
                <Collapsible.Indicator
                    transition="transform 0.2s"
                    _open={{ transform: 'rotate(180deg)' }}
                >
                    <Icon size="lg">
                        <LuChevronUp />
                    </Icon>
                </Collapsible.Indicator>
            </Collapsible.Trigger>
            <Separator w="full" borderColor="border.inverted" my={2} />
            <Collapsible.Content>
                <Box dangerouslySetInnerHTML={{ __html: rule.content }} />
            </Collapsible.Content>
        </Collapsible.Root>
    );
};
