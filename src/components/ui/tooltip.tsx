import { Portal, Tooltip as ChakraTooltip } from '@chakra-ui/react';
import type { RefObject, ReactNode, Ref } from 'react';

interface TooltipCProps extends ChakraTooltip.RootProps {
    content: ReactNode;
    showArrow?: boolean;
    children: ReactNode;
    disabled?: boolean;
    portalled?: boolean;
    contentProps?: ChakraTooltip.ContentProps;
    ref?: Ref<HTMLDivElement>;
    portalRef?: RefObject<HTMLElement>;
    asChildTrigger?: boolean;
}

export const Tooltip = ({
    showArrow,
    children,
    disabled,
    portalled = true,
    content,
    contentProps,
    ref,
    portalRef,
    asChildTrigger = true,
    ...props
}: TooltipCProps) => {
    if (disabled) return children;

    return (
        <ChakraTooltip.Root {...props}>
            <ChakraTooltip.Trigger asChild={asChildTrigger}>{children}</ChakraTooltip.Trigger>
            <Portal disabled={!portalled} container={portalRef}>
                <ChakraTooltip.Positioner>
                    <ChakraTooltip.Content ref={ref} {...contentProps}>
                        {showArrow && (
                            <ChakraTooltip.Arrow>
                                <ChakraTooltip.ArrowTip />
                            </ChakraTooltip.Arrow>
                        )}
                        {content}
                    </ChakraTooltip.Content>
                </ChakraTooltip.Positioner>
            </Portal>
        </ChakraTooltip.Root>
    );
};
