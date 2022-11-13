/// <reference path="interfaces.ts" />

namespace Logging {
  export namespace handler {
    interface EntryHandler {
      handle(entry: BaseLogEntry): boolean;
    }

    export class RESTHandler implements EntryHandler {
      protected readonly endpoint: string;
      protected readonly method: string;

      constructor(endpoint: string, method: string) {
        this.endpoint = endpoint;
        this.method = method;
      }

      static isSupported(): boolean {
        return true;
      }

      handleFetch(entry: BaseLogEntry): Promise<any> {
        return fetch(this.endpoint, {
          method: this.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(entry)
        });
      }

      handleXMLHTTPRequest(entry: BaseLogEntry) {
        const req = new XMLHttpRequest();
        req.open(this.method, this.endpoint);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(entry));
      }

      handle(entry: BaseLogEntry): boolean {
        if ('fetch' in window) {
          this.handleFetch(entry);
        } else {
          this.handleXMLHTTPRequest(entry);
        }

        return true;
      }
    }

  }
}
