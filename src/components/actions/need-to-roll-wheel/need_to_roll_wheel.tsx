import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class NeedToRollWheel extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    color() {
        return 'orange';
    }

    name() {
        return 'Готовится крутить колесо';
    }

    key() {
        return 'need_to_roll_wheel';
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
