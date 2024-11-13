import { xUserAgent } from "./xua";

class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.joliboxenv?.apiBaseURL ?? "https://api.jolibox.com";
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
    headers = Object.assign({}, headers, {
      "x-user-agent": xUserAgent(),
      "Content-Type": "application/json",
    });
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return (await response.json()) as T;
  }
}

export const httpClient = new HttpClient();
