import { Status } from '@chakra-ui/react';
import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { GamesWheelModal } from './GamesWheelModal';

export class RollWheel extends ActionDispenser {
    buttonNode(): ReactElement {
        return <GamesWheelModal key={this.key()} />;
    }

    color() {
        return 'purple';
    }

    name() {
        return 'Выролял';
    }

    key() {
        return 'roll-wheel';
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
