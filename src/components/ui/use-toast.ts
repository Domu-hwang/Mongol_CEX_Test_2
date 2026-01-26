import * as React from 'react';

import { ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToastsMap = Map<
    ToastProps['id'],
    { toast: ToastProps; timeout: ReturnType<typeof setTimeout> }
>;

type Action =
    | {
        type: 'ADD_TOAST';
        toast: ToastProps;
    }
    | {
        type: 'UPDATE_TOAST';
        toast: ToastProps;
    }
    | {
        type: 'DISMISS_TOAST';
        toastId?: ToastProps['id'];
    }
    | {
        type: 'REMOVE_TOAST';
        toastId?: ToastProps['id'];
    };

interface State {
    toasts: ToastProps[];
}

const toastTimeouts = new WeakMap<ToastProps, ReturnType<typeof setTimeout>>();

const toastMap = new Map<string, ToastProps>();

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case 'DISMISS_TOAST': {
            const { toastId } = action;

            // ! Side effects !
            // If we're dismissing (currently showing) a toast, remove it after the pause
            if (toastId) {
                toastMap.delete(toastId);
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            open: false,
                        }
                        : t
                ),
            };
        }
        case 'REMOVE_TOAST':
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
        default:
            return state;
    }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
}

type Toast = Omit<ToastProps, 'id'>;

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function createToast({ ...props }: Toast) {
    const id = generateId();

    const update = (props: ToastProps) =>
        dispatch({
            type: 'UPDATE_TOAST',
            toast: { ...props, id },
        });

    const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) {
                    dismiss();
                }
            },
        },
    });

    return {
        id: id,
        dismiss,
        update,
    };
}

function useToast() {
    const [state, setState] = React.useState<State>(memoryState);

    React.useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        ...state,
        toast: React.useCallback((props: Toast) => createToast(props), []),
    };
}

export { useToast, createToast };