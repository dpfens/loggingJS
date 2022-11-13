"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
;
var Logging;
(function (Logging) {
    var collector;
    (function (collector) {
        var NavigationCollector = (function () {
            function NavigationCollector() {
            }
            NavigationCollector.prototype.collect = function () {
                var data = {
                    appCodeName: navigator.appCodeName,
                    appName: navigator.appName,
                    appVersion: navigator.appVersion,
                    cookieEnabled: navigator.cookieEnabled,
                    deviceConcurrency: navigator.deviceConcurrency,
                    doNotTrack: navigator.doNotTrack,
                    language: navigator.language,
                    maxTouchPoints: navigator.maxTouchPoints,
                    onLine: navigator.onLine,
                    pdfViewerEnabled: navigator.pdfViewerEnabled,
                    platform: navigator.platform,
                    product: navigator.product,
                    productSub: navigator.productSub,
                    vendor: navigator.vendor,
                    vendorSub: navigator.vendorSub,
                    userAgent: {
                        value: navigator.userAgent,
                        data: JSON.parse(JSON.stringify(navigator.userAgentData))
                    }
                };
                var userActivation = null;
                if (navigator.userActivation) {
                    userActivation = {
                        isActive: navigator.userActivation.isActive,
                        hasBeenActive: navigator.userActivation.hasBeenActive
                    };
                }
                data.userActivation = userActivation;
                return data;
            };
            return NavigationCollector;
        }());
        collector.NavigationCollector = NavigationCollector;
        var ScreenCollector = (function () {
            function ScreenCollector() {
            }
            ScreenCollector.prototype.collect = function () {
                return {
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
                };
            };
            ScreenCollector.prototype.collectScreen = function () {
                return {
                    availHeight: window.screen.availHeight,
                    availLeft: window.screen.availLeft,
                    availTop: window.screen.availTop,
                    availWidth: window.screen.availWidth,
                    colorDepth: window.screen.colorDepth,
                    height: window.screen.height,
                    isExtended: window.screen.isExtended,
                    orientation: {
                        angle: window.screen.orientation.angle,
                        type: window.screen.orientation.type
                    },
                    pixelDepth: window.screen.pixelDepth,
                    width: window.screen.width
                };
            };
            return ScreenCollector;
        }());
        collector.ScreenCollector = ScreenCollector;
        var PerformanceCollector = (function () {
            function PerformanceCollector() {
            }
            PerformanceCollector.prototype.collect = function () {
                var output = JSON.parse(JSON.stringify(window.performance));
                output.entries = JSON.parse(JSON.stringify(window.performance.getEntries()));
                return output;
            };
            return PerformanceCollector;
        }());
        collector.PerformanceCollector = PerformanceCollector;
    })(collector = Logging.collector || (Logging.collector = {}));
})(Logging || (Logging = {}));
var Logging;
(function (Logging) {
    var handler;
    (function (handler) {
        var RESTHandler = (function () {
            function RESTHandler(endpoint, options) {
                this.endpoint = endpoint;
                options = options || {};
                this.method = options.method || 'POST';
            }
            RESTHandler.isSupported = function () {
                return true;
            };
            RESTHandler.prototype.handleFetch = function (entry) {
                return fetch(this.endpoint, {
                    method: this.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entry)
                });
            };
            RESTHandler.prototype.handleXMLHTTPRequest = function (entry) {
                var req = new XMLHttpRequest();
                req.open(this.method, this.endpoint);
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                req.send(JSON.stringify(entry));
            };
            RESTHandler.prototype.handle = function (entry) {
                if ('fetch' in window) {
                    this.handleFetch(entry);
                }
                else {
                    this.handleXMLHTTPRequest(entry);
                }
                return true;
            };
            return RESTHandler;
        }());
        handler.RESTHandler = RESTHandler;
        var HTMLHandler = (function () {
            function HTMLHandler(element) {
                this.element = element;
            }
            HTMLHandler.prototype.render = function (entry) {
                var output = '';
                return output;
            };
            HTMLHandler.prototype.handle = function (entry) {
                this.element.innerHTML += this.render(entry);
                return true;
            };
            return HTMLHandler;
        }());
    })(handler = Logging.handler || (Logging.handler = {}));
})(Logging || (Logging = {}));
var Logging;
(function (Logging) {
    var logger;
    (function (logger) {
        var BaseLogger = (function () {
            function BaseLogger(options) {
                this.LOGENTRYTYPE = 'Log';
                options = options || {};
                this.collectors = options.collectors || BaseLogger.DEFAULTCOLLECTORS;
                this.handlers = options.handlers || [];
            }
            BaseLogger.prototype.toArray = function (iterable) {
                var output = [];
                for (var i = 0; i < iterable.length; i++) {
                    output.push(iterable[i]);
                }
                return output;
            };
            BaseLogger.prototype.collect = function () {
                var data = {};
                for (var key in this.collectors) {
                    var collector = this.collectors[key];
                    data[key] = collector.collect();
                }
                return data;
            };
            BaseLogger.prototype.gatherMetadata = function () {
                return {
                    timestamp: new Date,
                    data: this.collect(),
                    type: this.LOGENTRYTYPE,
                    environment: window ? 'Browser' : 'NodeJS'
                };
            };
            BaseLogger.prototype.executeHandlers = function (entry) {
                var success = true;
                for (var key in this.handlers) {
                    var handler = this.handlers[key];
                    try {
                        handler.handle(entry);
                    }
                    catch (e) {
                        console.error(e);
                        success = false;
                    }
                }
                return success;
            };
            BaseLogger.DEFAULTCOLLECTORS = {
                'navigation': new Logging.collector.NavigationCollector(),
                'screen': new Logging.collector.ScreenCollector(),
                'performance': new Logging.collector.PerformanceCollector()
            };
            return BaseLogger;
        }());
        logger.BaseLogger = BaseLogger;
        var MessageLogger = (function (_super) {
            __extends(MessageLogger, _super);
            function MessageLogger(options) {
                var _this = _super.call(this, options) || this;
                _this.entries = [];
                _this.groups = [];
                return _this;
            }
            MessageLogger.prototype.truncateLog = function () {
                this.entries.splice(0, this.entries.length);
            };
            MessageLogger.prototype.assert = function () {
                var entry = {
                    type: 'ASSERT',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.clear = function () {
                var entry = {
                    type: 'CLEAR',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.debug = function () {
                var entry = {
                    type: 'DEBUG',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.error = function () {
                var entry = {
                    type: 'ERROR',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.info = function () {
                var entry = {
                    type: 'INFO',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.log = function () {
                var entry = {
                    type: 'LOG',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.warn = function () {
                var entry = {
                    type: 'WARN',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.group = function () {
                var entry = {
                    type: 'GROUP',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
                if (arguments.length > 0) {
                    var groupLabel = arguments[0];
                    this.groups.push(groupLabel);
                }
            };
            MessageLogger.prototype.groupEnd = function () {
                var entry = {
                    type: 'GROUPEND',
                    arguments: this.toArray(arguments),
                    metadata: this.gatherMetadata()
                };
                this.entries.push(entry);
                this.executeHandlers(entry);
                this.groups.pop();
            };
            return MessageLogger;
        }(BaseLogger));
        logger.MessageLogger = MessageLogger;
        var EventLogger = (function (_super) {
            __extends(EventLogger, _super);
            function EventLogger(options) {
                var _this = _super.call(this, options) || this;
                _this.LOGENTRYTYPE = 'Event';
                _this.handle = _this.handle.bind(_this);
                return _this;
            }
            EventLogger.prototype.stringifyEvent = function (event) {
                var obj = {};
                for (var k in event) {
                    obj[k] = event[k];
                }
                return JSON.stringify(obj, function (key, value) {
                    if (value instanceof Node)
                        return 'Node';
                    if (value instanceof Window)
                        return 'Window';
                    if (value instanceof Error) {
                        return { message: value.message, stack: value.stack };
                    }
                    ;
                    return value;
                }, ' ');
            };
            EventLogger.prototype.handle = function (event) {
                var eventData = JSON.parse(this.stringifyEvent(event)), entry = {
                    type: event.type,
                    metadata: this.gatherMetadata(),
                    event: eventData
                };
                var success = this.executeHandlers(entry);
                return success;
            };
            return EventLogger;
        }(BaseLogger));
        logger.EventLogger = EventLogger;
    })(logger = Logging.logger || (Logging.logger = {}));
})(Logging || (Logging = {}));
//# sourceMappingURL=logging.js.map