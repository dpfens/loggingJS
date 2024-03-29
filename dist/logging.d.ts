interface DataCollector {
    collect(): any;
}
interface Timestamp {
    value: Date;
    offset: number;
    timestamp: number;
}
interface LogEntryMetadata {
    timestamp: Timestamp;
    type: string;
    environment: string;
    data: any;
}
interface BaseLogEntry {
    type: string;
    metadata: LogEntryMetadata;
    getMessage(): string;
    toJSON(): any;
}
interface LogEntry extends BaseLogEntry {
    arguments: Array<any>;
}
interface LogEventEntry extends BaseLogEntry {
    event: ErrorEvent;
}
interface EntryHandler {
    handle(entry: BaseLogEntry): boolean;
}
interface EventLogger {
    handle(event: Event): boolean;
}
declare namespace Logging {
    namespace collector {
        namespace browser {
            class NavigationCollector implements DataCollector {
                collect(): any;
            }
            class ScreenCollector implements DataCollector {
                collect(): any;
                collectScreen(): any;
            }
            class PerformanceCollector implements DataCollector {
                collectMemory(): any;
                collect(): any;
            }
            class BaseIDCollector {
                static _id: string;
                static uniqueId(): string;
            }
            class PageIDCollector extends BaseIDCollector implements DataCollector {
                static _id: string;
                collect(): any;
            }
            class SessionIDCollector extends BaseIDCollector implements DataCollector {
                private _id;
                private key;
                constructor(key: string);
                collect(): any;
            }
        }
    }
}
declare namespace Logging {
    namespace entry {
        abstract class BaseEntry implements BaseLogEntry {
            readonly type: string;
            readonly metadata: LogEntryMetadata;
            constructor(type: string, metadata: LogEntryMetadata);
            getMessage(): string;
            toJSON(): any;
            stringify(): string;
        }
        class MessageEntry extends BaseEntry implements LogEntry {
            readonly arguments: Array<any>;
            constructor(type: string, metadata: LogEntryMetadata, args: Array<any>);
            getMessage(): string;
            toJSON(): any;
        }
        class EventEntry extends BaseEntry implements LogEventEntry {
            readonly event: ErrorEvent;
            constructor(type: string, metadata: LogEntryMetadata, event: ErrorEvent);
            getMessage(): string;
            toJSON(): any;
            generateQuerySelector(node: HTMLElement): string;
            stringifyEvent(event: Event): string;
        }
    }
}
declare namespace Logging {
    namespace handler {
        interface EntryHandler {
            handle(entry: BaseLogEntry): boolean;
        }
        export class RESTHandler implements EntryHandler {
            protected readonly endpoint: string;
            protected readonly method: string;
            protected readonly headers: any;
            constructor(endpoint: string, options?: any);
            static isSupported(): boolean;
            handleFetch(entry: BaseLogEntry): Promise<any>;
            handleXMLHTTPRequest(entry: BaseLogEntry): void;
            handle(entry: BaseLogEntry): boolean;
        }
        export class HTMLHandler implements EntryHandler {
            protected element: HTMLElement;
            protected MESSAGELEVELS: Record<string, string>;
            protected EVENTLEVELS: Record<string, string>;
            constructor(element: HTMLElement);
            isSupported(): boolean;
            buildTimestampElement(timestamp: Timestamp): HTMLTimeElement;
            buildArgumentsElement(message: string, type: string): HTMLSpanElement;
            buildMetadataElement(metadata: LogEntryMetadata): HTMLDivElement;
            render(entry: BaseLogEntry): HTMLElement;
            handle(entry: BaseLogEntry): boolean;
        }
        export {};
    }
}
interface Task {
    handler: EntryHandler;
    entry: BaseLogEntry;
}
declare namespace Logging {
    namespace scheduler {
        abstract class BaseScheduler {
            abstract push(handler: EntryHandler, entry: BaseLogEntry): void;
            static isSupported(): boolean;
        }
        class IdleBackgroundScheduler extends BaseScheduler {
            protected queue: Array<Task>;
            protected isHandling: number;
            protected timeout?: number;
            constructor(timeout?: number);
            push(handler: EntryHandler, entry: BaseLogEntry): void;
            protected startIdleProcessing(): void;
            protected handle(deadline: IdleDeadline): void;
            static isSupported(): boolean;
        }
        class BlockingScheduler extends BaseScheduler {
            protected timeout?: number;
            constructor(timeout?: number);
            push(handler: EntryHandler, entry: BaseLogEntry): void;
            static isSupported(): boolean;
        }
        class PrioritizedTaskScheduler extends BaseScheduler {
            protected priority: string;
            controller: any;
            constructor(priority?: string);
            push(handler: EntryHandler, entry: BaseLogEntry): void;
            abort(): void;
            setPriority(priority: string): void;
            static isSupported(): boolean;
        }
    }
}
declare namespace Logging {
    namespace logger {
        class BaseLogger {
            protected readonly collectors: Record<string, DataCollector>;
            protected readonly handlers: Array<EntryHandler>;
            protected readonly scheduler: Logging.scheduler.BaseScheduler;
            LOGENTRYTYPE: string;
            static DEFAULTBROWSERCOLLECTORS: Record<string, DataCollector>;
            constructor(options?: any);
            protected toArray(iterable: any): Array<any>;
            protected collect(): any;
            addCollector(key: string, collector: DataCollector): void;
            removeCollector(key: string): void;
            protected gatherMetadata(): LogEntryMetadata;
            protected executeHandlers(entry: BaseLogEntry): boolean;
            addHandler(handler: EntryHandler): void;
            removeHandler(handler: EntryHandler): void;
        }
        class MessageLogger extends BaseLogger {
            private readonly entries;
            private readonly groups;
            constructor(options?: any);
            truncateLog(): void;
            assert(): void;
            clear(): void;
            debug(): void;
            error(): void;
            info(): void;
            log(): void;
            warn(): void;
            group(): void;
            groupEnd(): void;
        }
        class EventLogger extends BaseLogger implements EventLogger {
            LOGENTRYTYPE: string;
            constructor(options?: any);
            handle(event: ErrorEvent): boolean;
        }
    }
}
//# sourceMappingURL=logging.d.ts.map