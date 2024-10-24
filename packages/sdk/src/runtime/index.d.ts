declare global {
    interface Window {
        JoliboxRuntime: typeof JoliboxRuntime;
        JoliboxRuntimeEvents: typeof JoliboxRuntimeEvents;
    }
}
declare enum JoliboxRuntimeEvents {
    /**
     * Event dispatched when the loading starts
     */
    LOAD_START = "JOLIBOX_RUNTIME_LOAD_START",
    /**
     * Event dispatched when the loading is finished
     */
    LOAD_FINISHED = "JOLIBOX_RUNTIME_LOAD_FINISHED",
    /**
     * Event dispatched when the loading progress is updated
     */
    LOAD_PROGRESS = "JOLIBOX_RUNTIME_LOAD_PROGRESS"
}
/**
 * Jolibox Runtime, a set of utilities to interact with the Jolibox runtime
 * @class
 */
declare class JoliboxRuntime {
    /**
     * Notify the end of the loading, will close the loading splash screen
     */
    loadFinished: () => void;
    /**
     * Notify the progress of the loading, will update the loading splash screen
     * @param progress - The progress of the loading, should be an integer between 0 and 100
     */
    notifyLoadProgress: (progress: number) => void;
}

export { JoliboxRuntime, JoliboxRuntimeEvents, JoliboxRuntime as default };
