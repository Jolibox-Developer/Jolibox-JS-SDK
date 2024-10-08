export enum JoliboxRuntimeEvents {
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
  LOAD_PROGRESS = "JOLIBOX_RUNTIME_LOAD_PROGRESS",
}

window.dispatchEvent(new Event(JoliboxRuntimeEvents.LOAD_START));

/**
 * Jolibox Runtime, a set of utilities to interact with the Jolibox runtime
 * @class
 */
export class JoliboxRuntime {
  /**
   * Notify the end of the loading, will close the loading splash screen
   */
  static loadFinished = () => {
    const loadFinishedEvent = new Event(JoliboxRuntimeEvents.LOAD_FINISHED);
    window.dispatchEvent(loadFinishedEvent);
  };

  /**
   * Notify the progress of the loading, will update the loading splash screen
   * @param progress - The progress of the loading, should be an integer between 0 and 100
   */
  static notifyLoadProgress = (progress: number) => {
    const detail = Math.ceil(progress);
    const event = new CustomEvent(JoliboxRuntimeEvents.LOAD_PROGRESS, {
      detail,
    });
    window.dispatchEvent(event);
  };
}

export default JoliboxRuntime;
