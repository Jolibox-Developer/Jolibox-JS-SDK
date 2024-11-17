const PlatformWebSDK = 1000 as const;

export interface IDevice {
  platform: typeof PlatformWebSDK;
  os: string;
  appVersion: string;
  appId: string; // for external SDK, "1 - H5", "2 - App"
  model: string;
  brand: string;
  uuid: string; // 前端生成的唯一标识，用来串整个埋点
  jsSdkVersion: string | null;
  // extra: Record<string, any> | null;
  extra: Record<string, string | boolean | number | null> | null;
}

export enum EPageName {
  GamePage = "GamePage",
}

export enum EProject {
  WebSDK = "web-sdk",
  AppSDK = "app-sdk",
}

export interface IPage {
  name: `${EPageName}`;
  params: Record<string, any> | null;
}

export enum EventType {
  Other = 0, // default
  Route = 1, // event name must be "Route"
  Click = 2,
  View = 3,
  Expose = 4,
  Swipe = 5,
  Input = 6,
  Select = 7,
  SwitchOn = 8,
  SwitchOff = 9,
  Submit = 10,
  Scroll = 11,
  Hide = 12,

  System = 1000, // used for web sdk
  ErrorTrace = 1001, // used for web sdk
  UserDefined = 1002, // used for web sdk
}
export enum EventName {
  Route = "Route",
  Other = "Other",
  OpenGame = "OpenGame",
  PlayGame = "PlayGame",
  CloseGame = "CloseGame",
}

export interface IEvent {
  name: `${EventName}` | string;
  type: EventType; // use a higher ts version to get static analysis
  location: IPage | null;
  target: IPage | null;
  // extra: Record<string, any> | null;
  extra: Record<string, string | boolean | number | null> | null;
  timestamp: number; // in unix timestamp
  userId: string | null; // 没登陆时为空
}

export interface IEventPackage {
  protocolVersion: string;
  events: IEvent[];
  device: IDevice;
  project: `${EProject}`;
}
