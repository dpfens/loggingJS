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
                        deviceMemory: navigator.deviceMemory,
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
            var BaseIDCollector = (function () {
                function BaseIDCollector() {
                }
                BaseIDCollector.uniqueId = function () {
                    if (crypto && crypto.randomUUID) {
                        return crypto.randomUUID();
                    }
                    if (crypto.getRandomValues) {
                        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (c) {
                            return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
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
                };
                return BaseIDCollector;
            }());
            browser.BaseIDCollector = BaseIDCollector;
            var PageIDCollector = (function (_super) {
                __extends(PageIDCollector, _super);
                function PageIDCollector() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PageIDCollector.prototype.collect = function () {
                    if (!PageIDCollector._id) {
                        PageIDCollector._id = PageIDCollector.uniqueId();
                    }
                    return PageIDCollector._id;
                };
                return PageIDCollector;
            }(BaseIDCollector));
            browser.PageIDCollector = PageIDCollector;
            var SessionIDCollector = (function (_super) {
                __extends(SessionIDCollector, _super);
                function SessionIDCollector(key) {
                    var _this = _super.call(this) || this;
                    _this._id;
                    _this.key = key;
                    return _this;
                }
                SessionIDCollector.prototype.collect = function () {
                    if (!this._id) {
                        var persistedValue = sessionStorage.getItem(this.key);
                        if (!persistedValue) {
                            persistedValue = SessionIDCollector.uniqueId();
                            sessionStorage.setItem(this.key, persistedValue);
                        }
                        this._id = persistedValue;
                    }
                    return this._id;
                };
                return SessionIDCollector;
            }(BaseIDCollector));
            browser.SessionIDCollector = SessionIDCollector;
        })(browser = collector.browser || (collector.browser = {}));
    })(collector = Logging.collector || (Logging.collector = {}));
})(Logging || (Logging = {}));
var Logging;
(function (Logging) {
    var entry;
    (function (entry) {
        var BaseEntry = (function () {
            function BaseEntry(type, metadata) {
                this.type = type;
                this.metadata = metadata;
            }
            BaseEntry.prototype.getMessage = function () {
                throw Error('message is undefined');
            };
            BaseEntry.prototype.toJSON = function () {
                return {
                    type: this.type,
                    metadata: this.metadata
                };
            };
            BaseEntry.prototype.stringify = function () {
                return JSON.stringify(this);
            };
            return BaseEntry;
        }());
        entry.BaseEntry = BaseEntry;
        var MessageEntry = (function (_super) {
            __extends(MessageEntry, _super);
            function MessageEntry(type, metadata, args) {
                var _this = _super.call(this, type, metadata) || this;
                _this.arguments = args;
                return _this;
            }
            MessageEntry.prototype.getMessage = function () {
                return this.arguments.join(' ');
            };
            MessageEntry.prototype.toJSON = function () {
                var output = _super.prototype.toJSON.call(this);
                output.arguments = this.arguments;
                return output;
            };
            return MessageEntry;
        }(BaseEntry));
        entry.MessageEntry = MessageEntry;
        var EventEntry = (function (_super) {
            __extends(EventEntry, _super);
            function EventEntry(type, metadata, event) {
                var _this = _super.call(this, type, metadata) || this;
                _this.event = event;
                return _this;
            }
            EventEntry.prototype.getMessage = function () {
                return this.event.message;
            };
            EventEntry.prototype.toJSON = function () {
                var output = _super.prototype.toJSON.call(this);
                output.event = JSON.parse(this.stringifyEvent(this.event));
                return output;
            };
            EventEntry.prototype.generateQuerySelector = function (node) {
                if (node.tagName.toLowerCase() == "html")
                    return "html";
                var str = node.tagName.toLowerCase();
                str += (node.id != "") ? "#" + node.id : "";
                if (node.className) {
                    var classes = node.className.split(/\s/);
                    for (var i = 0; i < classes.length; i++) {
                        str += "." + classes[i];
                    }
                }
                if (node.hasAttribute("href")) {
                    str += '[href="' + node.getAttribute('href') + '"]';
                }
                if (node.hasAttribute("src")) {
                    str += '[src="' + node.getAttribute('src') + '"]';
                }
                return this.generateQuerySelector(node.parentNode) + " > " + str;
            };
            EventEntry.prototype.stringifyEvent = function (event) {
                var obj = {};
                for (var k in event) {
                    obj[k] = event[k];
                }
                var self = this;
                return JSON.stringify(obj, function (key, value) {
                    if (value instanceof Node)
                        return self.generateQuerySelector(value);
                    if (value instanceof Window)
                        return 'Window';
                    if (value instanceof Error) {
                        return { message: value.message, stack: value.stack };
                    }
                    ;
                    return value;
                }, ' ');
            };
            return EventEntry;
        }(BaseEntry));
        entry.EventEntry = EventEntry;
    })(entry = Logging.entry || (Logging.entry = {}));
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
            HTMLHandler.prototype.buildTimestampElement = function (timestamp) {
                var entryDate = new Date(timestamp * 1000), timestampFormatted = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString(), element = document.createElement('time');
                element.textContent = timestampFormatted;
                return element;
            };
            HTMLHandler.prototype.buildArgumentsElement = function (message, type) {
                var element = document.createElement('span'), color = this.MESSAGELEVELS[type];
                element.setAttribute('class', 'message');
                element.style.color = color;
                element.textContent = message;
                return element;
            };
            HTMLHandler.prototype.buildMetadataElement = function (metadata) {
                var element = document.createElement('div');
                return element;
            };
            HTMLHandler.prototype.render = function (entry) {
                var timestampElement = this.buildTimestampElement(entry.metadata.timestamp), message = entry.getMessage(), messageElement = this.buildArgumentsElement(message, entry.type), metadataElement = this.buildMetadataElement(entry.metadata), element = document.createElement('div');
                element.append(timestampElement, messageElement, metadataElement);
                return element;
            };
            HTMLHandler.prototype.handle = function (entry) {
                var entryElement = this.render(entry);
                entryElement.setAttribute('class', 'level-' + entry.type);
                this.element.appendChild(entryElement);
                return true;
            };
            return HTMLHandler;
        }());
        handler.HTMLHandler = HTMLHandler;
        var ConsoleHandler = (function () {
            function ConsoleHandler() {
            }
            ConsoleHandler.prototype.isSupported = function () {
                return typeof console !== 'undefined';
            };
            ConsoleHandler.prototype.handle = function (entry) {
                var type = entry.type.toLowerCase();
                if (console && console[type]) {
                    console[type](entry);
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
                _this.timeout = timeout || 0;
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
        var PrioritizedTaskScheduler = (function (_super) {
            __extends(PrioritizedTaskScheduler, _super);
            function PrioritizedTaskScheduler(priority) {
                if (priority === void 0) { priority = 'background'; }
                var _this = _super.call(this) || this;
                _this.priority = priority;
                _this.controller = new window.TaskController({ priority: priority });
                return _this;
            }
            PrioritizedTaskScheduler.prototype.push = function (handler, entry) {
                window.scheduler.postTask(function () {
                    handler.handle(entry);
                }, { signal: this.controller.signal });
            };
            PrioritizedTaskScheduler.prototype.abort = function () {
                this.controller.abort();
            };
            PrioritizedTaskScheduler.prototype.setPriority = function (priority) {
                this.priority = priority;
                this.controller.setPriority(priority);
            };
            PrioritizedTaskScheduler.isSupported = function () {
                return 'scheduler' in window;
            };
            return PrioritizedTaskScheduler;
        }(BaseScheduler));
        scheduler.PrioritizedTaskScheduler = PrioritizedTaskScheduler;
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
                this.scheduler = options.scheduler || (Logging.scheduler.IdleBackgroundScheduler.isSupported() ? new Logging.scheduler.IdleBackgroundScheduler() : new Logging.scheduler.BlockingScheduler());
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
            BaseLogger.prototype.addCollector = function (key, collector) {
                if (!(key in this.collectors)) {
                    this.collectors[key] = collector;
                }
            };
            BaseLogger.prototype.removeCollector = function (key) {
                if (key in this.collectors) {
                    delete this.collectors[key];
                }
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
            BaseLogger.prototype.addHandler = function (handler) {
                if (this.handlers.indexOf(handler) === -1) {
                    this.handlers.push(handler);
                }
            };
            BaseLogger.prototype.removeHandler = function (handler) {
                var index = this.handlers.indexOf(handler);
                if (index > -1) {
                    this.handlers.splice(index, 1);
                }
            };
            BaseLogger.DEFAULTBROWSERCOLLECTORS = {
                'navigation': new Logging.collector.browser.NavigationCollector(),
                'screen': new Logging.collector.browser.ScreenCollector(),
                'performance': new Logging.collector.browser.PerformanceCollector(),
                'pageID': new Logging.collector.browser.PageIDCollector(),
                'sessionID': new Logging.collector.browser.SessionIDCollector('LoggingJS_SessionID')
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
                var args = this.toArray(arguments);
                var assertion = args.shift();
                if (assertion) {
                    return;
                }
                var entry = new Logging.entry.MessageEntry('ASSERT', this.gatherMetadata(), args);
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.clear = function () {
                var entry = new Logging.entry.MessageEntry('CLEAR', this.gatherMetadata(), this.toArray(arguments));
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.debug = function () {
                var entry = new Logging.entry.MessageEntry('DEBUG', this.gatherMetadata(), this.toArray(arguments));
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.error = function () {
                var entry = new Logging.entry.MessageEntry('ERROR', this.gatherMetadata(), this.toArray(arguments));
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.info = function () {
                var entry = new Logging.entry.MessageEntry('INFO', this.gatherMetadata(), this.toArray(arguments));
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.log = function () {
                var entry = new Logging.entry.MessageEntry('LOG', this.gatherMetadata(), this.toArray(arguments));
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.warn = function () {
                var entry = new Logging.entry.MessageEntry('WARN', this.gatherMetadata(), this.toArray(arguments));
                this.entries.push(entry);
                this.executeHandlers(entry);
            };
            MessageLogger.prototype.group = function () {
                var entry = new Logging.entry.MessageEntry('GROUP', this.gatherMetadata(), this.toArray(arguments));
                this.entries.push(entry);
                this.executeHandlers(entry);
                if (arguments.length > 0) {
                    var groupLabel = arguments[0];
                    this.groups.push(groupLabel);
                }
            };
            MessageLogger.prototype.groupEnd = function () {
                var entry = new Logging.entry.MessageEntry('GROUPEND', this.gatherMetadata(), this.toArray(arguments));
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
            EventLogger.prototype.handle = function (event) {
                console.log(event.srcElement);
                var entry = new Logging.entry.EventEntry(event.type.toUpperCase(), this.gatherMetadata(), event);
                this.executeHandlers(entry);
                return true;
            };
            return EventLogger;
        }(BaseLogger));
        logger.EventLogger = EventLogger;
    })(logger = Logging.logger || (Logging.logger = {}));
})(Logging || (Logging = {}));
//# sourceMappingURL=logging.js.map