/// <reference path="interfaces.ts" />

namespace Logging {
  export namespace handler {
    interface EntryHandler {
      handle(entry: BaseLogEntry): boolean;
    }

    export class RESTHandler implements EntryHandler {
      protected readonly endpoint: string;
      protected readonly method: string;
      protected readonly headers: any;

      constructor(endpoint: string, options?: any) {
        this.endpoint = endpoint;
        options = options || {};
        this.method = options.method || 'POST';
        this.headers = options.headers || {};
      }

      static isSupported(): boolean {
        return true;
      }

      handleFetch(entry: BaseLogEntry): Promise<any> {
        const headers = this.headers;
        headers['Content-Type'] = 'application/json';
        return fetch(this.endpoint, {
          method: this.method,
          headers: headers,
          body: JSON.stringify(entry)
        });
      }

      handleXMLHTTPRequest(entry: BaseLogEntry) {
        const req = new XMLHttpRequest();
        req.open(this.method, this.endpoint);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        for(var key in this.headers) {
          req.setRequestHeader(key, this.headers[key]);
        }
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

    export class HTMLHandler implements EntryHandler {
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

      isSupported(): boolean {
        return typeof window !== 'undefined';
      }


      buildTimestampElement(timestamp: Timestamp): HTMLTimeElement {
        var entryDate = new Date(timestamp as any * 1000),
            timestampFormatted = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString(),
            element: HTMLTimeElement = document.createElement('time');
            element.textContent = timestampFormatted;
        return element;
      }

      buildArgumentsElement(message: string, type: string): HTMLSpanElement {
        var element: HTMLSpanElement = document.createElement('span'),
            color = this.MESSAGELEVELS[type];
        element.setAttribute('class', 'message');
        element.style.color = color;
        element.textContent = message;
        return element;
      }

      buildMetadataElement(metadata: LogEntryMetadata): HTMLDivElement {
        var element: HTMLDivElement = document.createElement('div');
        return element;
      }

      render(entry: BaseLogEntry): HTMLElement {
        var timestampElement: HTMLTimeElement = this.buildTimestampElement(entry.metadata.timestamp),
            message = entry.getMessage(),
            messageElement: HTMLSpanElement = this.buildArgumentsElement(message, entry.type),
            metadataElement: HTMLDivElement = this.buildMetadataElement(entry.metadata),
            element: HTMLDivElement = document.createElement('div');
        element.append(timestampElement, messageElement, metadataElement);
        return element;
      }

      handle(entry: BaseLogEntry): boolean {
        var entryElement = this.render(entry);
        entryElement.setAttribute('class', 'level-' + entry.type);
        this.element.appendChild(entryElement);
        return true;
      }
    }

    class ConsoleHandler implements EntryHandler {
      isSupported(): boolean {
        return typeof console !== 'undefined';
      }

      handle(entry: BaseLogEntry): boolean {
        var type = entry.type.toLowerCase();

        if (console && (console as any)[type]) {
          (console as any)[type](entry);
          return true;
        }
        return false;
      }
    }

  }
}
