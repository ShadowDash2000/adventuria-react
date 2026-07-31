import { Status } from '@chakra-ui/react';
import { ActionStatusDispenser } from '@components/actions-statuses/action-status-base';

export class Done extends ActionStatusDispenser {
    color() {
        return 'green';
    }

    name() {
        return 'Завершено';
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
