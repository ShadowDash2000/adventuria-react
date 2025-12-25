import { Collapsible, Stack, VStack } from '@chakra-ui/react';
import { ActionTextEditor } from '@components/profile/ActionTextEditor';
import type { HTMLContent } from '@tiptap/react';
import { Button } from '@theme/button';
import { LuChevronDown } from 'react-icons/lu';
import HTMLReactParser from 'html-react-parser';

interface UserActionCommentProps {
    isEditing: boolean;
    comment: string;
    draft: HTMLContent;
    setDraft: (content: HTMLContent) => void;
}

const COMMENT_MAX_LENGTH = 1000;

export const UserActionComment = ({
    isEditing,
    comment,
    draft,
    setDraft,
}: UserActionCommentProps) => {
    return (
        <>
            {isEditing ? (
                <VStack alignItems="start" p={2} h="20vw">
                    <ActionTextEditor
                        placeholder="Введите комментарий..."
                        content={draft}
                        setContent={content => setDraft(content as HTMLContent)}
                        editable={isEditing}
                    />
                </VStack>
            ) : comment.length > COMMENT_MAX_LENGTH ? (
                <Collapsible.Root collapsedHeight={200}>
                    <Collapsible.Content
                        _closed={{
                            shadow: 'inset 0 -12px 12px -12px var(--shadow-color)',
                            shadowColor: 'blackAlpha.500',
                        }}
                    >
                        <Stack wordBreak="break-word">{HTMLReactParser(comment)}</Stack>
                    </Collapsible.Content>
                    <Collapsible.Trigger asChild mt="4">
                        <Button>
                            <Collapsible.Context>
                                {ctx => (ctx.open ? 'Скрыть' : 'Показать')}
                            </Collapsible.Context>
                            <Collapsible.Indicator
                                transition="transform 0.2s"
                                _open={{ transform: 'rotate(180deg)' }}
                            >
                                <LuChevronDown />
                            </Collapsible.Indicator>
                        </Button>
                    </Collapsible.Trigger>
                </Collapsible.Root>
            ) : (
                <Stack wordBreak="break-word">{HTMLReactParser(comment)}</Stack>
            )}
        </>
    );
};
