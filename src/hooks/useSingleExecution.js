import {InteractionManager} from 'react-native';
import {useCallback, useState} from 'react';

/**
 * With any action passed in, it will only allow 1 such action to occur at a time.
 *
 * @returns {Object}
 */
function useSingleExecution() {
    const [isExecuting, setIsExecuting] = useState(false);
    const isExecutingRef = useRef();

    isExecutingRef.current = isExecuting;

    const singleExecution = useCallback(
        (action) =>
            (...params) => {
                if (isExecutingRef.current) {
                    return;
                }

                setIsExecuting(true);

                const execution = action(params);
                InteractionManager.runAfterInteractions(() => {
                    if (!(execution instanceof Promise)) {
                        setIsExecuting(false);
                        return;
                    }
                    execution.finally(() => {
                        setIsExecuting(false);
                    });
                });
            },
        [],
    );

    return {isExecuting, singleExecution};
}
