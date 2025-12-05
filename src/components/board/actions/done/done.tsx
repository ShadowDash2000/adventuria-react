import { Status } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ActionDispenser } from '../action-base';
import { DoneModal } from './DoneModal';

export class Done extends ActionDispenser {
    buttonNode(): ReactNode {
        return <DoneModal key={this.key()} />;
    }

    color() {
        return 'green';
    }

    name() {
        return 'Завершено';
    }

    key() {
        return 'done';
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
