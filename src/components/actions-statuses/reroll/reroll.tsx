import { Status } from '@chakra-ui/react';
import { ActionStatusDispenser } from '@components/actions-statuses/action-status-base';

export class Reroll extends ActionStatusDispenser {
    color() {
        return 'blue';
    }

    name() {
        return 'Реролл';
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
