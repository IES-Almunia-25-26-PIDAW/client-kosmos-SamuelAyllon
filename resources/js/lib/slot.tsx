import * as React from 'react';

type AnyProps = Record<string, unknown>;

type SlotProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
};

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
    { children, ...slotProps },
    forwardedRef,
) {
    if (!React.isValidElement(children)) {
        return null;
    }

    const childElement = children as React.ReactElement<AnyProps>;
    const childProps = (childElement.props ?? {}) as AnyProps;
    const mergedProps = mergeProps(slotProps as AnyProps, childProps);

    const childRef = (childElement as unknown as { ref?: React.Ref<unknown> }).ref;
    mergedProps.ref = composeRefs(forwardedRef as React.Ref<unknown>, childRef);

    return React.cloneElement(childElement, mergedProps);
});

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
    const merged: AnyProps = { ...slotProps };

    for (const key of Object.keys(childProps)) {
        const slotValue = slotProps[key];
        const childValue = childProps[key];

        if (/^on[A-Z]/.test(key) && typeof slotValue === 'function' && typeof childValue === 'function') {
            merged[key] = (...args: unknown[]) => {
                (childValue as (...a: unknown[]) => unknown)(...args);
                (slotValue as (...a: unknown[]) => unknown)(...args);
            };
        } else if (key === 'style') {
            merged[key] = { ...(slotValue as object), ...(childValue as object) };
        } else if (key === 'className') {
            merged[key] = [slotValue, childValue].filter(Boolean).join(' ');
        } else {
            merged[key] = childValue !== undefined ? childValue : slotValue;
        }
    }

    return merged;
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
    return (node: T) => {
        for (const ref of refs) {
            if (!ref) continue;
            if (typeof ref === 'function') {
                ref(node);
            } else {
                (ref as React.MutableRefObject<T | null>).current = node;
            }
        }
    };
}
