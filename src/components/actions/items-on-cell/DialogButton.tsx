import { Button } from '@theme/button';
import { LuFerrisWheel } from 'react-icons/lu';
import { useWheelDialog } from '@components/wheels';

export const DialogButton = () => {
    const { openWheel } = useWheelDialog();

    return (
        <Button colorPalette="purple" onClick={() => openWheel('items-on-cell')}>
            <LuFerrisWheel />
            Колесо предметов
        </Button>
    );
};
