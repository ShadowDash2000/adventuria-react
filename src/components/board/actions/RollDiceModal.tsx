import {type FC, useEffect, useState} from "react";
import {DiceFactory, type DiceFactoryItem} from "../dices";
import {Flex, For, Portal} from "@chakra-ui/react";
import {Button} from "@ui/button";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";

export const RollDiceModal: FC = () => {
    const {pb} = useAppContext();
    const [dices, setDices] = useState<DiceFactoryItem[] | null>(null);
    const [rolls, setRolls] = useState<number[] | null>(null);

    const roll = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/roll`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${pb.authStore.token}`,
                },
            });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Failed to update action`);
            }

            const resData = await res.json();

            if (!resData.success) {
                throw new Error(resData.error);
            }

            const dices = [];
            const rolls = [];
            for (const diceRoll of resData.data.dice_rolls) {
                dices.push(DiceFactory.create(diceRoll.type));
                rolls.push(diceRoll.roll);
            }

            setDices(dices);
            setRolls(rolls);
        } catch (e: any) {
            console.log(e?.message ?? "Unknown error");
        }
    }

    useEffect(() => {
        if (!dices || !rolls) return;

        for (const [i, dice] of dices.entries()) {
            dice.ref.current?.roll(rolls[i], 6);
        }
    }, [dices, rolls]);

    return (
        <>
            <Button onClick={async () => {
                if (dices) return;
                await roll();
            }}>
                Бросить кубик
            </Button>
            <Portal>
                <Flex
                    position="fixed"
                    gap="{spacing.40}"
                    top={0}
                    zIndex={100}
                >
                    {
                        dices ?
                            <For each={dices}>
                                {(dice) => (
                                    dice.element
                                )}
                            </For>
                            : null
                    }
                </Flex>
            </Portal>
        </>
    )
}