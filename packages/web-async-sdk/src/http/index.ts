import { xUserAgent } from "../utils/xua";

interface IHttpClientInitParams {
  baseUrl?: string;
}

export class HttpClient {
  private baseUrl: string;
  private xua = xUserAgent();

  private getGameId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("gameId") ?? null;
  };

  constructor(config?: IHttpClientInitParams) {
    this.baseUrl =
      config?.baseUrl ??
      window.joliboxenv?.apiBaseURL ??
      "https://api.jolibox.com";
  }

  async get<T>(
    path: string,
    {
      query,
      headers,
    }: { query?: Record<string, string>; headers?: Record<string, string> }
  ) {
    const searchParams = new URLSearchParams(query);
    const search = searchParams.toString();
    const url = `${this.baseUrl}${path}${search ? `?${search}` : ""}`;
    headers = Object.assign({}, headers, { "x-user-agent": xUserAgent() });
    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    return (await response.json()) as T;
  }

  async post<T>(
    path: string,
    {
      data,
      query,
      headers,
    }: {
      data?: any;
      query?: Record<string, string>;
      headers?: Record<string, string>;
    }
  ) {
    const searchParams = new URLSearchParams(query);
    const search = searchParams.toString();
    const url = `${this.baseUrl}${path}${search ? `?${search}` : ""}`;
    const gameId = this.getGameId();
    headers = Object.assign(
      {},
      headers,
      {
        "x-user-agent": this.xua,
        "Content-Type": "application/json",
      },
      gameId ? { "x-game-id": gameId } : {}
    );
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await response.json()) as T;
  }
}
