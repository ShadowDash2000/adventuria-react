import './dice.css';
import { useRollDiceStore } from './useRollDiceStore';
import { useEffect, useRef, useState } from 'react';
import type { DiceDispenser } from './dice-base';
import { dices } from './types';
import { Flex, For, Portal } from '@chakra-ui/react';

type Roll = { dice: DiceDispenser; value: number; durationSec: number };

const FADE_DURATION = 3;

export const DiceScene = () => {
    const diceSceneRef = useRef<HTMLDivElement>(null);
    const [rolls, setRolls] = useState<Roll[] | null>(null);
    const pendingRoll = useRollDiceStore(state => state.pendingRoll);
    const clearPendingRoll = useRollDiceStore(state => state.clearPendingRoll);

    useEffect(() => {
        if (!pendingRoll) {
            setRolls(null);
            return;
        }

        if (diceSceneRef.current) {
            diceSceneRef.current.style.opacity = '1';
        }

        const rolls: Roll[] = [];
        const durationDifference = 1;
        let curDuration = pendingRoll.durationSec - (pendingRoll.rolls.length - 1);

        pendingRoll.rolls.forEach((roll, i) => {
            const diceDispenser = dices[roll.dice];
            rolls.push({ dice: diceDispenser, value: roll.value, durationSec: curDuration });
            curDuration += durationDifference;
        });

        setRolls(rolls);

        const fadeoutTimer = setTimeout(() => {
            if (diceSceneRef.current) {
                diceSceneRef.current.style.opacity = '0';
            }
        }, pendingRoll.durationSec * 1000);

        const clearRollTimer = setTimeout(
            () => {
                clearPendingRoll();
            },
            (pendingRoll.durationSec + FADE_DURATION) * 1000,
        );

        return () => {
            clearTimeout(fadeoutTimer);
            clearTimeout(clearRollTimer);
        };
    }, [pendingRoll, clearPendingRoll]);

    useEffect(() => {
        return () => {
            clearPendingRoll();
        };
    }, [clearPendingRoll]);

    if (!rolls) {
        return null;
    }

    return (
        <Portal>
            <Flex
                ref={diceSceneRef}
                position="fixed"
                w="full"
                justifyContent="center"
                wrap="wrap"
                gap="{spacing.40}"
                top={0}
                zIndex={100}
                pointerEvents="none"
                transition={`opacity ${FADE_DURATION}s ease-in-out`}
            >
                <For each={rolls}>{roll => roll.dice.node(roll.value, roll.durationSec)}</For>
            </Flex>
        </Portal>
    );
};
