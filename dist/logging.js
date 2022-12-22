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
        var browser;
        (function (browser) {
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
                        languages: navigator.languages,
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
                        },
                        webdriver: navigator.webdriver
                    };
                    var userActivation = null;
                    if (navigator.userActivation) {
                        userActivation = {
                            isActive: navigator.userActivation.isActive,
                            hasBeenActive: navigator.userActivation.hasBeenActive
                        };
                    }
                    data.userActivation = userActivation;
                    var connection = null;
                    if (navigator.connection) {
                        var networkInformation = navigator.connection;
                        connection = {
                            downlink: networkInformation.downlink,
                            downlinkMax: networkInformation.downlinkMax,
                            effectiveType: networkInformation.effectiveType,
                            rtt: networkInformation.rtt,
                            saveData: networkInformation.saveData
                        };
                    }
                    data.connection = connection;
                    return data;
                };
                return NavigationCollector;
            }());
            browser.NavigationCollector = NavigationCollector;
            var ScreenCollector = (function () {
                function ScreenCollector() {
                }
                ScreenCollector.prototype.collect = function () {
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
            browser.ScreenCollector = ScreenCollector;
            var PerformanceCollector = (function () {
                function PerformanceCollector() {
                }
                PerformanceCollector.prototype.collectMemory = function () {
                    if (window.performance.memory) {
                        var output = {};
                        for (var key in window.performance.memory) {
                            var value = window.performance.memory[key];
                            if (!window.isNaN(value)) {
                                output[key] = value;
                            }
                        }
                        return output;
                    }
                };
                PerformanceCollector.prototype.collect = function () {
                    if (window.performance) {
                        var output = window.performance.toJSON();
                        if (window.performance && !!window.performance.getEntries) {
                            output.entries = window.performance.getEntries();
                        }
                        var memory = this.collectMemory();
                        if (memory) {
                            output.memory = memory;
                        }
                        return output;
                    }
                };
                return PerformanceCollector;
            }());
            browser.PerformanceCollector = PerformanceCollector;
        })(browser = collector.browser || (collector.browser = {}));
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
                this.headers = options.headers || {};
            }
            RESTHandler.isSupported = function () {
                return true;
            };
            RESTHandler.prototype.handleFetch = function (entry) {
                var headers = this.headers;
                headers['Content-Type'] = 'application/json';
                return fetch(this.endpoint, {
                    method: this.method,
                    headers: headers,
                    body: JSON.stringify(entry)
                });
            };
            RESTHandler.prototype.handleXMLHTTPRequest = function (entry) {
                var req = new XMLHttpRequest();
                req.open(this.method, this.endpoint);
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                for (var key in this.headers) {
                    req.setRequestHeader(key, this.headers[key]);
                }
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
                this.MESSAGELEVELS = {
                    'ASSERT': '#5A5A5A',
                    'DEBUG': '#00FF00',
                    'INFO': '#0000FF',
                    'WARN': '#FFD700',
                    'ERROR': '#FF0000',
                    'DEFAULT': '#5A5A5A'
                };
                this.EVENTLEVELS = {
                    'error': '#FF0000',
                    'DEFAULT': '#5A5A5A'
                };
                this.element = element;
            }
            HTMLHandler.prototype.isSupported = function () {
                return typeof window !== 'undefined';
            };
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
        var ConsoleHandler = (function () {
            function ConsoleHandler() {
            }
            ConsoleHandler.prototype.isSupported = function () {
                return typeof console !== 'undefined';
            };
            ConsoleHandler.prototype.handle = function (entry) {
                if (console && console.table) {
                    console.table(entry);
                    return true;
                }
                return false;
            };
            return ConsoleHandler;
        }());
    })(handler = Logging.handler || (Logging.handler = {}));
})(Logging || (Logging = {}));
var Logging;
(function (Logging) {
    var scheduler;
    (function (scheduler) {
        var BaseScheduler = (function () {
            function BaseScheduler() {
            }
            BaseScheduler.isSupported = function () {
                return false;
            };
            return BaseScheduler;
        }());
        scheduler.BaseScheduler = BaseScheduler;
        var IdleBackgroundScheduler = (function (_super) {
            __extends(IdleBackgroundScheduler, _super);
            function IdleBackgroundScheduler(timeout) {
                var _this = _super.call(this) || this;
                _this.queue = [];
                _this.isHandling = 0;
                _this.timeout = timeout;
                _this.handle = _this.handle.bind(_this);
                return _this;
            }
            IdleBackgroundScheduler.prototype.push = function (handler, entry) {
                var task = {
                    handler: handler,
                    entry: entry
                };
                this.queue.push(task);
                if (!this.isHandling) {
                    this.startIdleProcessing();
                }
            };
            IdleBackgroundScheduler.prototype.startIdleProcessing = function () {
                if (this.timeout) {
                    this.isHandling = requestIdleCallback(this.handle, { timeout: this.timeout });
                }
                else {
                    this.isHandling = requestIdleCallback(this.handle);
                }
            };
            IdleBackgroundScheduler.prototype.handle = function (deadline) {
                while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.queue.length > 0) {
                    var task = this.queue.shift();
                    task.handler.handle(task.entry);
                }
                if (this.queue.length) {
                    this.startIdleProcessing();
                }
                else {
                    this.isHandling = 0;
                }
            };
            IdleBackgroundScheduler.isSupported = function () {
                return 'requestIdleCallback' in window;
            };
            return IdleBackgroundScheduler;
        }(BaseScheduler));
        scheduler.IdleBackgroundScheduler = IdleBackgroundScheduler;
        var BlockingScheduler = (function (_super) {
            __extends(BlockingScheduler, _super);
            function BlockingScheduler(timeout) {
                var _this = _super.call(this) || this;
                _this.timeout = timeout;
                return _this;
            }
            BlockingScheduler.prototype.push = function (handler, entry) {
                if (this.timeout) {
                    setTimeout(function () {
                        handler.handle(entry);
                    }, this.timeout);
                }
                else {
                    handler.handle(entry);
                }
            };
            BlockingScheduler.isSupported = function () {
                return true;
            };
            return BlockingScheduler;
        }(BaseScheduler));
        scheduler.BlockingScheduler = BlockingScheduler;
    })(scheduler = Logging.scheduler || (Logging.scheduler = {}));
})(Logging || (Logging = {}));
var Logging;
(function (Logging) {
    var logger;
    (function (logger) {
        var BaseLogger = (function () {
            function BaseLogger(options) {
                this.LOGENTRYTYPE = 'Log';
                options = options || {};
                var collectors = options.collectors;
                if (!collectors) {
                    if (window) {
                        collectors = BaseLogger.DEFAULTBROWSERCOLLECTORS;
                    }
                    else {
                        collectors = {};
                    }
                }
                this.collectors = collectors;
                this.handlers = options.handlers || [];
                this.scheduler = options.scheduler || Logging.scheduler.IdleBackgroundScheduler.isSupported() ? new Logging.scheduler.IdleBackgroundScheduler() : new Logging.scheduler.BlockingScheduler();
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
                var now = new Date();
                return {
                    timestamp: {
                        value: now,
                        offset: now.getTimezoneOffset(),
                        timestamp: now.getTime()
                    },
                    data: this.collect(),
                    type: this.LOGENTRYTYPE,
                    environment: window ? 'Browser' : 'NodeJS'
                };
            };
            BaseLogger.prototype.executeHandlers = function (entry) {
                for (var key in this.handlers) {
                    var handler = this.handlers[key];
                    this.scheduler.push(handler, entry);
                }
                return true;
            };
            BaseLogger.DEFAULTBROWSERCOLLECTORS = {
                'navigation': new Logging.collector.browser.NavigationCollector(),
                'screen': new Logging.collector.browser.ScreenCollector(),
                'performance': new Logging.collector.browser.PerformanceCollector()
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
                var assertion = arguments[0];
                if (!assertion) {
                    return false;
                }
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
                this.executeHandlers(entry);
                return true;
            };
            return EventLogger;
        }(BaseLogger));
        logger.EventLogger = EventLogger;
    })(logger = Logging.logger || (Logging.logger = {}));
})(Logging || (Logging = {}));
//# sourceMappingURL=logging.js.map