interface DataCollector {
    collect(): any;
}
interface LogEntryMetadata {
    timestamp: Date;
    type: string;
    environment: string;
    data: any;
}
interface BaseLogEntry {
    type: string;
    metadata: LogEntryMetadata;
}
interface LogEntry extends BaseLogEntry {
    arguments: Array<any>;
}
interface LogEventEntry extends BaseLogEntry {
    event: any;
}
interface EntryHandler {
    handle(entry: BaseLogEntry): boolean;
}
interface EventLogger {
    handle(event: Event): boolean;
}
declare namespace Logging {
    namespace collector {
        class NavigationCollector implements DataCollector {
            collect(): any;
        }
        class ScreenCollector implements DataCollector {
            collect(): any;
            collectScreen(): any;
        }
        class PerformanceCollector implements DataCollector {
            collect(): any;
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
            constructor(endpoint: string, options?: any);
            static isSupported(): boolean;
            handleFetch(entry: BaseLogEntry): Promise<any>;
            handleXMLHTTPRequest(entry: BaseLogEntry): void;
            handle(entry: BaseLogEntry): boolean;
        }
        export {};
    }
}
declare namespace Logging {
    namespace logger {
        class BaseLogger {
            protected readonly collectors: Record<string, DataCollector>;
            protected readonly handlers: Array<EntryHandler>;
            LOGENTRYTYPE: string;
            static DEFAULTCOLLECTORS: Record<string, DataCollector>;
            constructor(options?: any);
            protected toArray(iterable: any): Array<any>;
            protected collect(): any;
            protected gatherMetadata(): LogEntryMetadata;
            protected executeHandlers(entry: BaseLogEntry): boolean;
        }
        class Logger extends BaseLogger {
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
            stringifyEvent(event: Event): string;
            handle(event: Event): boolean;
        }
    }
}
//# sourceMappingURL=logging.d.ts.map