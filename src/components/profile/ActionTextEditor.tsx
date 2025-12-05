import './action-text-editor.css';
import { type FC, useCallback } from 'react';
import { type Content, EditorContent, useEditor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Image from '@tiptap/extension-image';
import Paragraph from '@tiptap/extension-paragraph';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Dropcursor, Placeholder } from '@tiptap/extensions';

interface ActionTextEditorProps {
    content?: Content;
    setContent?: (content: Content) => void;
    editable?: boolean;
    placeholder?: string;
}

export const ActionTextEditor: FC<ActionTextEditorProps> = ({
    content,
    setContent,
    editable = true,
    placeholder,
}) => {
    const editor = useEditor(
        {
            extensions: [
                Document,
                Paragraph,
                Text,
                Image.configure({ resize: { enabled: true, alwaysPreserveAspectRatio: true } }),
                Dropcursor,
                Placeholder.configure({ placeholder: placeholder }),
            ],
            content: content,
            editable: editable,
            onUpdate: ({ editor }) => {
                if (setContent) setContent(editor.getHTML());
            },
        },
        [editable],
    );

    const addImage = useCallback(() => {
        const url = window.prompt('URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    return (
        <>
            <ButtonGroup pb={2}>
                <Button onClick={() => addImage()}>Вставить изображение</Button>
            </ButtonGroup>
            <EditorContent editor={editor} className="tiptap-editor" />
        </>
    );
};
