import {
  type IDevice,
  type IPage,
  type IEvent,
  type IEventPackage,
  EventName,
  EventType,
  EProject,
} from "./event";
import { HttpClient } from "../http";
import {
  getAppVersion,
  getDeviceId,
  getPlatform,
  //   getUAParser,
} from "../utils/xua";

// 手动列出键名[TODO后面看怎么通过程序动态生成 ts-transformer-keys目前报错]
const keysOfEvent: (keyof IEvent)[] = [
  "name",
  "type",
  "location",
  "target",
  "extra",
  "timestamp",
  "userId",
];
const keysOfDevice: (keyof IDevice)[] = [
  "platform",
  "os",
  "appVersion",
  "appId",
  "model",
  "brand",
  "uuid",
  "jsSdkVersion",
  "extra",
];
const keysOfPage: (keyof IPage)[] = ["name", "params"];

// import { keys } from 'ts-transformer-keys';
// const keysOfProps = keys<IEventPackage>();

function serializeObject<T>(obj: T, order: (keyof T)[]): any[] {
  return order.map((key) => {
    if (key === "params" && obj[key]) {
      const params = obj[key] as Record<string, any>;
      return Object.keys(params).reduce((acc, k) => {
        acc[k] = String(params[k]);
        return acc;
      }, {} as Record<string, any>);
    }
    return obj[key];
  });
}

function serializeEvent(event: IEvent): any[] {
  const location = event.location
    ? serializeObject(event.location, keysOfPage)
    : null;
  const target = event.target
    ? serializeObject(event.target, keysOfPage)
    : null;

  // 定义IEvent的序列化顺序
  return serializeObject({ ...event, location, target }, keysOfEvent);
}

function serializeEventPackage(eventPackage: IEventPackage): any[] {
  // 序列化事件数组
  const events = eventPackage.events.map((event) => serializeEvent(event));

  // 定义IDevice的序列化顺序
  const device = serializeObject(eventPackage.device, keysOfDevice);

  return [eventPackage.protocolVersion, events, device, eventPackage.project];
}

export interface IEventParams extends Partial<IEvent> {
  name: `${EventName}` | string;
  type: EventType;
}

export class EventTracker {
  private httpClient = new HttpClient({
    baseUrl:
      window.joliboxenv?.testMode ?? false
        ? "https://collect.jolibox.com"
        : "https://stg-collect.jolibox.com",
  });
  deviceInfo: IDevice | null = null;
  //   userId: string | null = null;

  async getDevice(): Promise<IDevice> {
    // const ua = getUAParser();
    return {
      platform: 1000,
      os: getPlatform(),
      appVersion: getAppVersion(),
      appId: "1",
      model: "UnknownModel",
      brand: "UnknownBrand",
      uuid: getDeviceId(),
      jsSdkVersion: window.__JOLIBOX_LOCAL_SDK_VERSION__ ?? null,
      extra: null,
    };
  }

  async getLocation(): Promise<IPage> {
    // const currentPage = Taro.getCurrentInstance();
    // const path = (currentPage.router?.path ?? "").split("?")[0];
    // const params = currentPage.router?.params ?? {};
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, any> = {};
    urlParams.forEach((value, key) => {
      params[key] = value;
    });
    return {
      //   name: pageMap[path] || "Unknown",
      name: "GamePage",
      params,
    };
  }

  //   async getUserId(): Promise<string | null> {
  //     return Taro.getStorageSync("userId") || "";
  //   }

  async trackEvent(event: IEventParams) {
    const location = event.location ? event.location : await this.getLocation();
    const target = event.target || null;
    const extra = event.extra || null;
    // if (this.userId === null) {
    //   this.userId = await this.getUserId();
    // }
    // const userId = this.userId;
    if (!this.deviceInfo) {
      this.deviceInfo = await this.getDevice();
    }
    const device = this.deviceInfo;
    const events: IEvent[] = [
      {
        ...event,
        location,
        target,
        extra,
        timestamp: Date.now(),
        userId: null,
      },
    ];
    const eventPackage: IEventPackage = {
      protocolVersion: "1.0.0",
      events,
      device,
      project: EProject.WebSDK,
    };
    // console.log(
    //   eventPackage,
    //   "serializeEventPackage:",
    //   serializeEventPackage(eventPackage)
    // );
    try {
      this.httpClient.post("/report", {
        data: serializeEventPackage(eventPackage),
      });
    } catch (error) {
      console.log("report Api error", error);
    }
  }
}
