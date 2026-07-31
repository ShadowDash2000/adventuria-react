import { Status } from '@chakra-ui/react';
import { ActionStatusDispenser } from '@components/actions-statuses/action-status-base';

export class NeedToRollWheel extends ActionStatusDispenser {
    color() {
        return 'orange';
    }

    name() {
        return 'Готовится крутить колесо';
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
