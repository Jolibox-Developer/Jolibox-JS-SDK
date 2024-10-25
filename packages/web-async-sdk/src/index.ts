export * from "./ads";
import { JoliboxAdsImpl } from "./ads";

interface ICommandPipe {
  cmd: string;
  params: any;
}

declare global {
  interface JoliboxSDK {
    _commandPipe: Array<ICommandPipe> | JoliboxSDKPipeExecutor;
  }
  interface Window {
    joliboxsdk: JoliboxSDK;
    joliboxenv?: {
      testMode: boolean;
      apiBaseURL: string;
    };
  }
}

class JoliboxSDKPipeExecutor {
  ads = new JoliboxAdsImpl();

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
