import { useCallback, useEffect } from 'react';
import { type Content, EditorContent, useEditor, useEditorState } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Image from '@tiptap/extension-image';
import Paragraph from '@tiptap/extension-paragraph';
import { Box, Button, ButtonGroup, Text as ChakraText } from '@chakra-ui/react';
import { Dropcursor, Placeholder, CharacterCount, UndoRedo } from '@tiptap/extensions';
import { useKbdSettingsStore } from '@shared/hook/useKbdSettings';

interface ActionTextEditorProps {
    content?: Content;
    setContent?: (content: Content) => void;
    editable?: boolean;
    placeholder?: string;
    limit?: number;
}

const IMAGE_MAX_WIDTH = 600;
const IMAGE_MAX_HEIGHT = 400;

const clampImageSize = (width: number, height: number) => {
    if (!width || !height) {
        return { width: IMAGE_MAX_WIDTH, height: IMAGE_MAX_HEIGHT };
    }

    const scale = Math.min(1, IMAGE_MAX_WIDTH / width, IMAGE_MAX_HEIGHT / height);

    return {
        width: Math.round(width * scale),
        height: Math.round(height * scale),
    };
};

const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: element => element.getAttribute('width'),
                renderHTML: attributes => (attributes.width ? { width: attributes.width } : {}),
            },
            height: {
                default: null,
                parseHTML: element => element.getAttribute('height'),
                renderHTML: attributes => (attributes.height ? { height: attributes.height } : {}),
            },
        };
    },
});

export const ActionTextEditor = ({
    content,
    setContent,
    editable = true,
    placeholder,
    limit = 5000,
}: ActionTextEditorProps) => {
    const editor = useEditor(
        {
            extensions: [
                Document,
                Paragraph,
                Text,
                ResizableImage.configure({
                    inline: true,
                    allowBase64: false,
                    resize: {
                        enabled: true,
                        alwaysPreserveAspectRatio: false,
                        minWidth: 50,
                        minHeight: 50,
                    },
                }),
                Dropcursor,
                UndoRedo,
                Placeholder.configure({ placeholder: placeholder }),
                CharacterCount.configure({ limit }),
            ],
            content: content,
            editable: editable,
            editorProps: {
                handlePaste: (view, event) => {
                    const files = Array.from(event.clipboardData?.files ?? []).filter(file =>
                        file.type.startsWith('image/'),
                    );

                    if (!files.length) return false;

                    event.preventDefault();
                    files.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const src = reader.result as string;
                            const image = new window.Image();
                            image.onload = () => {
                                const { width, height } = clampImageSize(
                                    image.naturalWidth,
                                    image.naturalHeight,
                                );
                                const node = view.state.schema.nodes.image.create({
                                    src,
                                    width,
                                    height,
                                });
                                const tr = view.state.tr.replaceSelectionWith(node).scrollIntoView();
                                view.dispatch(tr);
                            };
                            image.onerror = () => {
                                const node = view.state.schema.nodes.image.create({
                                    src,
                                    width: IMAGE_MAX_WIDTH,
                                    height: IMAGE_MAX_HEIGHT,
                                });
                                const tr = view.state.tr.replaceSelectionWith(node).scrollIntoView();
                                view.dispatch(tr);
                            };
                            image.src = src;
                        };
                        reader.readAsDataURL(file);
                    });

                    return true;
                },
                handleDrop: (view, event) => {
                    const files = Array.from(event.dataTransfer?.files ?? []).filter(file =>
                        file.type.startsWith('image/'),
                    );

                    if (!files.length) return false;

                    event.preventDefault();
                    const dropPosition = view.posAtCoords({
                        left: event.clientX,
                        top: event.clientY,
                    });

                    files.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const src = reader.result as string;
                            const image = new window.Image();
                            image.onload = () => {
                                const { width, height } = clampImageSize(
                                    image.naturalWidth,
                                    image.naturalHeight,
                                );
                                const node = view.state.schema.nodes.image.create({
                                    src,
                                    width,
                                    height,
                                });
                                const tr = dropPosition
                                    ? view.state.tr.insert(dropPosition.pos, node).scrollIntoView()
                                    : view.state.tr.replaceSelectionWith(node).scrollIntoView();
                                view.dispatch(tr);
                            };
                            image.onerror = () => {
                                const node = view.state.schema.nodes.image.create({
                                    src,
                                    width: IMAGE_MAX_WIDTH,
                                    height: IMAGE_MAX_HEIGHT,
                                });
                                const tr = dropPosition
                                    ? view.state.tr.insert(dropPosition.pos, node).scrollIntoView()
                                    : view.state.tr.replaceSelectionWith(node).scrollIntoView();
                                view.dispatch(tr);
                            };
                            image.src = src;
                        };
                        reader.readAsDataURL(file);
                    });

                    return true;
                },
            },
            onUpdate: ({ editor }) => {
                if (setContent) setContent(editor.getHTML());
            },
        },
        [editable],
    );

    const { characterCount } = useEditorState({
        editor,
        selector: context => ({
            characterCount: context.editor.storage.characterCount.characters(),
        }),
    });

    const incrementKbdBlock = useKbdSettingsStore(state => state.incrementAll);
    const decrementKbdBlock = useKbdSettingsStore(state => state.decrementAll);

    useEffect(() => {
        if (editable) {
            incrementKbdBlock();
            return () => decrementKbdBlock();
        }
    }, [editable, incrementKbdBlock, decrementKbdBlock]);

    const addImage = useCallback(() => {
        const url = window.prompt('URL');

        if (url) {
            const image = new window.Image();
            image.onload = () => {
                const { width, height } = clampImageSize(image.naturalWidth, image.naturalHeight);
                editor.chain().focus().setImage({ src: url, width, height }).run();
            };
            image.onerror = () => {
                editor
                    .chain()
                    .focus()
                    .setImage({ src: url, width: IMAGE_MAX_WIDTH, height: IMAGE_MAX_HEIGHT })
                    .run();
            };
            image.src = url;
        }
    }, [editor]);

    return (
        <>
            <ButtonGroup pb={2}>
                <Button onClick={() => addImage()}>Вставить изображение</Button>
            </ButtonGroup>
            <Box
                position="relative"
                className="tiptap-editor-container"
                flex="1"
                width="full"
                minH="0"
                border="1px solid"
                borderColor="border.emphasized"
                borderRadius="md"
                css={{
                    '& .tiptap-editor': { height: '100%', overflowY: 'auto' },
                    '& .ProseMirror': {
                        height: '100%',
                        overflow: 'auto',
                        wordBreak: 'break-word',
                        padding: '1.5rem',
                        outline: '1px solid grey',
                        '&:first-of-type': { marginTop: 0 },
                        '& img': {
                            display: 'block',
                            maxWidth: `${IMAGE_MAX_WIDTH}px`,
                            maxHeight: `${IMAGE_MAX_HEIGHT}px`,
                        },
                        '& [data-resize-wrapper]': {
                            maxWidth: `${IMAGE_MAX_WIDTH}px`,
                            maxHeight: `${IMAGE_MAX_HEIGHT}px`,
                        },
                        '& [data-resize-handle]': {
                            position: 'absolute',
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            borderRadius: '2px',
                            zIndex: 10,
                            '&:hover': { background: 'rgba(0, 0, 0, 0.8)' },
                            '&[data-resize-handle="top-left"], &[data-resize-handle="top-right"], &[data-resize-handle="bottom-left"], &[data-resize-handle="bottom-right"]':
                                { width: '0.5vw', height: '0.5vw' },
                            '&[data-resize-handle="top-left"]': {
                                top: '-4px',
                                left: '-4px',
                                cursor: 'nwse-resize',
                            },
                            '&[data-resize-handle="top-right"]': {
                                top: '-4px',
                                right: '-4px',
                                cursor: 'nesw-resize',
                            },
                            '&[data-resize-handle="bottom-left"]': {
                                bottom: '-4px',
                                left: '-4px',
                                cursor: 'nesw-resize',
                            },
                            '&[data-resize-handle="bottom-right"]': {
                                bottom: '-4px',
                                right: '-4px',
                                cursor: 'nwse-resize',
                            },
                            '&[data-resize-handle="top"], &[data-resize-handle="bottom"]': {
                                height: '6px',
                                left: '8px',
                                right: '8px',
                            },
                            '&[data-resize-handle="top"]': { top: '-3px', cursor: 'ns-resize' },
                            '&[data-resize-handle="bottom"]': {
                                bottom: '-3px',
                                cursor: 'ns-resize',
                            },
                            '&[data-resize-handle="left"], &[data-resize-handle="right"]': {
                                width: '6px',
                                top: '8px',
                                bottom: '8px',
                            },
                            '&[data-resize-handle="left"]': { left: '-3px', cursor: 'ew-resize' },
                            '&[data-resize-handle="right"]': { right: '-3px', cursor: 'ew-resize' },
                        },
                        '& [data-resize-state="true"] [data-resize-wrapper]': {
                            outline: '1px solid rgba(0, 0, 0, 0.25)',
                            borderRadius: '0.125rem',
                        },
                        '& p.is-editor-empty:first-of-type::before': {
                            color: '#adb5bd',
                            content: 'attr(data-placeholder)',
                            float: 'left',
                            height: 0,
                            pointerEvents: 'none',
                        },
                    },
                    '& .ProseMirror:focus-visible': {
                        outline: '-webkit-focus-ring-color auto 1px',
                    },
                }}
            >
                <EditorContent editor={editor} className="tiptap-editor" />
                {editable && (
                    <ChakraText
                        position="absolute"
                        top="2"
                        right="6"
                        fontSize="xs"
                        color="gray.500"
                        pointerEvents="none"
                        zIndex="1"
                    >
                        {characterCount} / {limit}
                    </ChakraText>
                )}
            </Box>
        </>
    );
};
