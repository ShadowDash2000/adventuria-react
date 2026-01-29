import type { CSSProperties } from 'react';
import { Collapsible, Stack, VStack } from '@chakra-ui/react';
import { ActionTextEditor } from '@components/profile/ActionTextEditor';
import type { HTMLContent } from '@tiptap/react';
import { Button } from '@theme/button';
import { LuChevronDown } from 'react-icons/lu';
import HTMLReactParser, { type DOMNode, attributesToProps } from 'html-react-parser';

interface UserActionCommentProps {
    isEditing: boolean;
    comment: string;
    draft: HTMLContent;
    setDraft: (content: HTMLContent) => void;
}

const COMMENT_MAX_LENGTH = 1000;

const renderComment = (html: string) =>
    HTMLReactParser(html, {
        replace: (domNode: DOMNode) => {
            if (!(domNode.type === 'tag' && domNode.name === 'img')) {
                return;
            }

            const { width, height } = domNode.attribs ?? {};
            const sizeStyle: CSSProperties = {};
            const widthValue = Number(width);
            const heightValue = Number(height);

            if (Number.isFinite(widthValue)) {
                sizeStyle.width = `${widthValue}px`;
            }
            if (Number.isFinite(heightValue)) {
                sizeStyle.height = `${heightValue}px`;
            }

            const props = attributesToProps(domNode.attribs ?? {});
            const style = { ...(props as { style?: CSSProperties }).style, ...sizeStyle };

            return <img {...props} style={style} />;
        },
    });

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
                        <Stack wordBreak="break-word">{renderComment(comment)}</Stack>
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
                <Stack wordBreak="break-word">{renderComment(comment)}</Stack>
            )}
        </>
    );
};
