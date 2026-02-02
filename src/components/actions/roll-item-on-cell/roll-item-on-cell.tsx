import { Status } from '@chakra-ui/react';
import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { ItemOnCellWheelButton } from './ItemOnCellWheelButton';

export class RollItemOnCell extends ActionDispenser {
    buttonNode(): ReactElement {
        return <ItemOnCellWheelButton key={this.key()} />;
    }

    color() {
        return 'purple';
    }

    name() {
        return 'Выролил предмет';
    }

    key() {
        return 'roll-item-on-cell';
    }

    statusNode() {
        return (
            <Status.Root colorPalette={this.color()}>
                <Status.Indicator />
                {this.name()}
            </Status.Root>
        );
    }
}
