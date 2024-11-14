export * from "./ads";
export * from "./analytics";
import { JoliboxAdsImpl } from "./ads";
import { JoliboxAnalyticsImpl } from "./analytics";

interface ICommandPipe {
  cmd: string;
  params: any;
}

declare global {
  interface JoliboxSDK {
    _commandPipe: Array<ICommandPipe> | JoliboxSDKPipeExecutor;
  }
  interface Window {
    __JOLIBOX_LOCAL_SDK_VERSION__: string;
    joliboxsdk: JoliboxSDK;
    joliboxenv?: {
      testMode: boolean;
      apiBaseURL: string;
    };
  }
}

class JoliboxSDKPipeExecutor {
  ads = new JoliboxAdsImpl();
  analytics = new JoliboxAnalyticsImpl();

  constructor() {
    const existingPipe = Array.from(
      (window.joliboxsdk._commandPipe as Array<ICommandPipe>) ?? []
    );
    window.joliboxsdk._commandPipe = this;
    existingPipe.forEach((command) => {
      this.push(command);
    });
  }

  push = (command: ICommandPipe) => {
    switch (command.cmd) {
      case "ads.init": {
        this.ads.init(command.params);
        break;
      }
      case "ads.adConfig": {
        this.ads.adConfig(command.params);
        break;
      }
      case "ads.adBreak": {
        this.ads.adBreak(command.params);
        break;
      }
      case "ads.adUnit": {
        this.ads.adUnit(command.params);
        break;
      }
    }
  };
}

new JoliboxSDKPipeExecutor();
