
export const IHttpServerToken = "IHttpServer";

export interface IHttpServer {
    start(port: number): void;
}