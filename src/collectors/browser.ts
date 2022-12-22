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

    }
  }
}
