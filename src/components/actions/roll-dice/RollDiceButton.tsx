import { LuDices } from 'react-icons/lu';
import { useRollDice } from '@components/actions/roll-dice/useRollDice';
import { Button } from '@theme/button';

export const RollDiceButton = () => {
    const { roll, canRoll, isPending } = useRollDice();

    return (
        <>
            <Button colorPalette="purple" loading={isPending} disabled={!canRoll} onClick={roll}>
                <LuDices />
                Бросить кубики
            </Button>
        </>
    );
};
