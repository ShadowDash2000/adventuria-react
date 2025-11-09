import {Done} from "@shared/types/actions/done";
import {ActionController} from "@shared/types/actions/action-base";

export class ActionFactory {
    private static actions: Record<string, ActionController> = {
        'done': new Done(),
    }

    static get(actionType: string): ActionController {
        return this.actions[actionType]
    }
}