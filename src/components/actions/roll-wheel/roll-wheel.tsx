import { Status } from '@chakra-ui/react';
import { type ReactElement } from 'react';
import { ActionDispenser } from '../action-base';
import { Modal } from '@components/actions/roll-wheel/activities-wheel/Modal';

export class RollWheel extends ActionDispenser {
    buttonNode(): ReactElement {
        return <Modal key={this.key()} />;
    }

    color() {
        return 'purple';
    }

    name() {
        return 'Выролял';
    }

    key() {
        return 'roll_wheel';
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
