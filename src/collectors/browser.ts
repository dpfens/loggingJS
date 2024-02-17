/// <reference path="../interfaces.ts" />

namespace Logging {
  export namespace collector {

    export namespace browser {

      export class NavigationCollector implements DataCollector {

        collect(): any {
          const data: any = {
              appCodeName: (navigator as any).appCodeName,
              appName: (navigator as any).appName,
              appVersion: (navigator as any).appVersion,
              cookieEnabled: navigator.cookieEnabled,
              deviceConcurrency: (navigator as any).deviceConcurrency,
              deviceMemory: (navigator as any).deviceMemory,
              doNotTrack: navigator.doNotTrack,
              language: navigator.language,
              languages: navigator.languages,
              maxTouchPoints: navigator.maxTouchPoints,
              onLine: navigator.onLine,
              pdfViewerEnabled: (navigator as any).pdfViewerEnabled,
              platform: (navigator as any).platform,
              product: (navigator as any).product,
              productSub: (navigator as any).productSub,
              vendor: navigator.vendor,
              vendorSub: (navigator as any).vendorSub,
              userAgent: {
                value: navigator.userAgent,
                data: JSON.parse(JSON.stringify((navigator as any).userAgentData))
              },
              webdriver: navigator.webdriver
            };

          var userActivation = null;
          if ((navigator as any).userActivation) {
            userActivation = {
              isActive: (navigator as any).userActivation.isActive,
              hasBeenActive: (navigator as any).userActivation.hasBeenActive
            };
          }
          data.userActivation = userActivation;

          var connection = null;
          if ((navigator as any).connection) {
            var networkInformation = (navigator as any).connection;
            connection = {
              downlink: (networkInformation as any).downlink,
              downlinkMax: (networkInformation as any).downlinkMax,
              effectiveType: (networkInformation as any).effectiveType,
              rtt: (networkInformation as any).rtt,
              saveData: (networkInformation as any).saveData
            };
          }
          data.connection = connection;
          return data;
        }

      }


      export class ScreenCollector implements DataCollector {

        collect(): any {
          return {
            visibilityState: document.visibilityState,
            devicePixelRatio: window.devicePixelRatio,
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth,
            outerHeight: window.outerHeight,
            outerWidth: window.outerWidth,
            pageXOffset: window.pageXOffset,
            pageYOffset: window.pageYOffset,
            screen: this.collectScreen(),
            screenLeft: window.screenLeft,
            screenTop: window.screenTop,
            screenX: window.screenX,
            screenY: window.screenY,
            scrollX: window.scrollX,
            scrollY: window.scrollY
          }
        }

        collectScreen(): any {
          return {
            availHeight: window.screen.availHeight,
            availLeft: (window.screen as any).availLeft,
            availTop: (window.screen as any).availTop,
            availWidth: window.screen.availWidth,
            colorDepth: window.screen.colorDepth,
            height: window.screen.height,
            isExtended: (window.screen as any).isExtended,
            orientation: {
              angle: window.screen.orientation.angle,
              type: window.screen.orientation.type
            },
            pixelDepth: window.screen.pixelDepth,
            width: window.screen.width
          };
        }
      }


      export class PerformanceCollector implements DataCollector {

        collectMemory() {
          if ((window.performance as any).memory) {
            const output:any = {};
            for (var key in (window.performance as any).memory) {
              const value = (window.performance as any).memory[key];
              if (!window.isNaN(value)) {
                output[key] = value;
              }
            }
            return output;
          }
        }

        collect(): any {
          if (window.performance) {
            const output = window.performance.toJSON();
            if (window.performance && !!window.performance.getEntries) {
              output.entries = window.performance.getEntries();
            }
            const memory = this.collectMemory();
            if (memory) {
              output.memory = memory;
            }
            return output;
          }
        }

      }

      export class BaseIDCollector {
        static _id: string;

        static uniqueId() {
          if (crypto && crypto.randomUUID) {
              return crypto.randomUUID();
          }
          if (crypto.getRandomValues) {
            return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function(c: any) {
              return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            });
          }

          var uuid = "";
          for (var i = 0; i < 32; i++) {
              var random = Math.random() * 16 | 0;  

              if (i === 8 || i === 12 || i === 16 || i === 20) {
                  uuid += "-";
              }
              uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
          }
          return uuid;
        }
      }

      export class PageIDCollector extends BaseIDCollector implements DataCollector {
        static _id: string;

        collect(): any {
          if (!PageIDCollector._id) {
            PageIDCollector._id = PageIDCollector.uniqueId();
          }
          return PageIDCollector._id;
        }
      }


      export class SessionIDCollector extends BaseIDCollector implements DataCollector {
        private _id: any;
        private key: string;

        constructor(key: string) {
          super();
          this._id;
          this.key = key;
        }

        collect(): any {
          if (!this._id) {
            var persistedValue = sessionStorage.getItem(this.key);
            if (!persistedValue) {
              persistedValue = SessionIDCollector.uniqueId();
              sessionStorage.setItem(this.key, persistedValue);
            }
            this._id = persistedValue;
          }
          return this._id;
        }
      }

    }
  }
}
