import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';

export class Teleport extends ActionDispenser {
    buttonNode(): ReactNode {
        return null;
    }

    color() {
        return 'orange';
    }

    name() {
        return 'Лестница/Яма';
    }

    key() {
        return 'teleport';
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
