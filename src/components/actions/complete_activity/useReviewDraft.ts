import { useEffect, useRef, useState } from 'react';
import { type Content as TipTapContent } from '@tiptap/core';
import { useDebounce } from '@uidotdev/usehooks';

type ReviewDraft = { content: TipTapContent; score: number };

const storageKey = 'review-draft';

export const useReviewDraft = () => {
    const draft = readDraft(storageKey);
    const [content, setContent] = useState<TipTapContent>(draft.content);
    const contentDebounced = useDebounce(content, 1000);
    const [score, setScore] = useState<number>(draft.score);
    const scoreDebounced = useDebounce(score, 500);
    const draftRef = useRef<ReviewDraft | null>(null);

    useEffect(() => {
        writeDraft(storageKey, { content: contentDebounced, score: scoreDebounced });
    }, [contentDebounced, scoreDebounced]);

    useEffect(() => {
        draftRef.current = { content, score };
    }, [content, score]);

    useEffect(() => {
        return () => {
            const draft = draftRef.current;
            if (!draft) return;
            writeDraft(storageKey, { content: draft.content, score: draft.score });
        };
    }, []);

    const clearDraft = () => {
        draftRef.current = null;

        try {
            localStorage.removeItem(storageKey);
        } catch {}

        const emptyDraft = createEmptyDraft();
        setContent(emptyDraft.content);
        setScore(emptyDraft.score);
    };

    return { content, setContent, score, setScore, clearDraft };
};

function readDraft(key: string): ReviewDraft {
    try {
        const raw = localStorage.getItem(key);

        return raw ? (JSON.parse(raw) as ReviewDraft) : createEmptyDraft();
    } catch {
        return createEmptyDraft();
    }
}

function writeDraft(key: string, draft: ReviewDraft) {
    try {
        localStorage.setItem(key, JSON.stringify(draft));
    } catch {}
}

function createEmptyDraft(): ReviewDraft {
    return { content: null, score: 0 };
}
