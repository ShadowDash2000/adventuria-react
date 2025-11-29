import type {ReactNode} from "react";

export abstract class ActionDispenser {
    abstract buttonNode(): ReactNode

    abstract color(): string

    abstract name(): string

    abstract statusNode(): ReactNode
}