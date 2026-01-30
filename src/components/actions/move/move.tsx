import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class Move extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    color() {
        return 'orange';
    }

    name() {
        return 'Переместился';
    }

    key() {
        return 'move';
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
