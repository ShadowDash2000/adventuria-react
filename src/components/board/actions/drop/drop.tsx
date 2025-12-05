import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class Drop extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    color() {
        return 'red';
    }

    name() {
        return 'Дроп';
    }

    key() {
        return 'drop';
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
