import { IncomingMessage } from "http";
import { CoreOptions } from "request";
import { Url } from "url";

type ResponseRequest = CoreOptions & {
    uri: Url;
  };
export interface RequestResponse extends IncomingMessage {
    request: ResponseRequest;
    body: any;
    timingStart?: number;
    timings?: {
        socket: number;
        lookup: number;
        connect: number;
        response: number;
        end: number;
    };
    timingPhases?: {
        wait: number;
        dns: number;
        tcp: number;
        firstByte: number;
        download: number;
        total: number;
    };
}