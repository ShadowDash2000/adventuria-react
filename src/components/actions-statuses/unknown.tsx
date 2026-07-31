import { Status } from '@chakra-ui/react';
import { ActionStatusDispenser } from '@components/actions-statuses/action-status-base';

export class Unknown extends ActionStatusDispenser {
    color() {
        return 'red';
    }

    name() {
        return '[ДАННЫЕ УДАЛЕНЫ]';
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
