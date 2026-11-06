import { useState } from 'react';
import { type DiceRoll, dices, useRollDice } from '@components/dices';
import { Button, For, HStack, VStack, Text, Field, NumberInput } from '@chakra-ui/react';

export const DicesSpawner = () => {
    const [pendingDices, setPendingDices] = useState<DiceRoll[] | null>(null);
    const [rollTime, setRollTime] = useState<string>('5');
    const { setPendingRoll } = useRollDice();

    return (
        <VStack align="left">
            <Text>Спавн кубов</Text>
            <HStack>
                <For each={Object.entries(dices)}>
                    {([diceType, dice]) => (
                        <Button
                            key={diceType}
                            onClick={() => {
                                setPendingDices(prevState => {
                                    const roll: DiceRoll = { dice: diceType, value: dice.roll() };

                                    if (!prevState) {
                                        return [roll];
                                    }
                                    return [...prevState, roll];
                                });
                            }}
                        >
                            {diceType}
                        </Button>
                    )}
                </For>
            </HStack>
            {pendingDices && (
                <HStack wrap="wrap">
                    <For each={pendingDices}>
                        {(diceRoll, index) => (
                            <HStack key={index}>
                                <Text>{diceRoll.dice}</Text>
                            </HStack>
                        )}
                    </For>
                </HStack>
            )}
            <Field.Root>
                <Field.Label>Время прокрута</Field.Label>
                <NumberInput.Root
                    value={rollTime}
                    min={1}
                    max={50}
                    onValueChange={({ value }) => setRollTime(value)}
                >
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
            </Field.Root>
            <Button
                disabled={pendingDices === null}
                onClick={() => {
                    if (!pendingDices) return;
                    setPendingRoll(pendingDices, parseInt(rollTime));
                    setPendingDices(null);
                }}
            >
                Ролл
            </Button>
        </VStack>
    );
};
