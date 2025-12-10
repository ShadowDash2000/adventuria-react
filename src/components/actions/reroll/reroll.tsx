import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class Reroll extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    color() {
        return 'blue';
    }

    name() {
        return 'Реролл';
    }

    key() {
        return 'reroll';
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
