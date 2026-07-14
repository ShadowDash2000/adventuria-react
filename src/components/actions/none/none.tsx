import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class None extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    color() {
        return 'orange';
    }

    name() {
        return 'Стартуем!';
    }

    key() {
        return 'none';
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
