/// <reference path="interfaces.ts" />

namespace Logging {
  export namespace handler {
    interface EntryHandler {
      handle(entry: BaseLogEntry): boolean;
    }

    export class RESTHandler implements EntryHandler {
      protected readonly endpoint: string;
      protected readonly method: string;

      constructor(endpoint: string, options?: any) {
        this.endpoint = endpoint;
        options = options || {};
        this.method = options.method || 'POST';
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

    class HTMLHandler implements EntryHandler {
      protected element: HTMLElement;
      protected MESSAGELEVELS: Record<string, string> = {
        'ASSERT': '#5A5A5A',
        'DEBUG': '#00FF00',
        'INFO': '#0000FF',
        'WARN': '#FFD700',
        'ERROR': '#FF0000',
        'DEFAULT': '#5A5A5A'
      };
      protected EVENTLEVELS: Record<string, string> = {
        'error': '#FF0000',
        'DEFAULT': '#5A5A5A'
      };

      constructor(element: HTMLElement) {
        this.element = element;
      }

      render(entry: BaseLogEntry): string {
        var output = '';
        return output;
      }

      handle(entry: BaseLogEntry): boolean {
        this.element.innerHTML += this.render(entry);
        return true;
      }
    }

  }
}
