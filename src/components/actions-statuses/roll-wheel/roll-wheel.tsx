import { Status } from '@chakra-ui/react';
import { ActionStatusDispenser } from '@components/actions-statuses/action-status-base';

export class RollWheel extends ActionStatusDispenser {
    color() {
        return 'purple';
    }

    name() {
        return 'Выролял';
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
