import { useRef } from 'react';
import { Flex, For, Portal } from '@chakra-ui/react';
import { Button } from '@ui/button';
import { LuDices } from 'react-icons/lu';
import { useRollDice } from '@components/actions/roll-dice/useRollDice';

export const RollDiceButton = () => {
    const diceSceneRef = useRef<HTMLDivElement>(null);
    const { roll, dices, canRoll } = useRollDice(diceSceneRef);

    return (
        <>
            <Button
                colorPalette="{colors.purple}"
                hoverColorPalette="{colors.purple.hover}"
                disabled={!canRoll}
                onClick={roll}
            >
                <LuDices />
                Бросить кубики
            </Button>
            <Portal>
                <Flex ref={diceSceneRef} position="fixed" gap="{spacing.40}" top={0} zIndex={100}>
                    {dices ? <For each={dices}>{dice => dice.element}</For> : null}
                </Flex>
            </Portal>
        </>
    );
};
