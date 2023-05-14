/// <reference path="interfaces.ts" />
/// <reference path="collectors/browser.ts" />
/// <reference path="entry.ts" />
/// <reference path="handler.ts" />
/// <reference path="scheduler.ts" />

namespace Logging {
  export namespace logger {

    export class BaseLogger {
      protected readonly collectors: Record<string, DataCollector>;
      protected readonly handlers: Array<EntryHandler>;
      protected readonly scheduler: Logging.scheduler.BaseScheduler;
      LOGENTRYTYPE: string = 'Log';
      static DEFAULTBROWSERCOLLECTORS: Record<string, DataCollector> = {
        'navigation': new Logging.collector.browser.NavigationCollector(),
        'screen': new Logging.collector.browser.ScreenCollector(),
        'performance': new Logging.collector.browser.PerformanceCollector()
      };

      constructor(options?: any) {
        options = options || {};
        var collectors = options.collectors;
        if (!collectors) {
          if (window) {
            collectors = BaseLogger.DEFAULTBROWSERCOLLECTORS;
          } else {
            collectors = {};
          }
        }
        this.collectors = collectors;
        this.handlers = options.handlers || [];
        this.scheduler = options.scheduler || (Logging.scheduler.IdleBackgroundScheduler.isSupported() ? new Logging.scheduler.IdleBackgroundScheduler() : new Logging.scheduler.BlockingScheduler());
      }

      protected toArray(iterable: any): Array<any> {
        const output = [];
        for (var i = 0; i < iterable.length; i++) {
          output.push(iterable[i]);
        }
        return output;
      }

      protected collect(): any {
        const data: any = {};
        for (var key in this.collectors) {
          var collector: DataCollector = this.collectors[key as keyof Record<string, DataCollector>];
          data[key] = collector.collect();
        }
        return data;
      }

      public addCollector(key: string, collector: DataCollector): void {
        if (!(key in this.collectors)) {
          this.collectors[key] = collector;
        }
      }

      public removeCollector(key: string): void {
        if (key in this.collectors) {
          delete this.collectors[key];
        }
      }

      protected gatherMetadata(): LogEntryMetadata {
          const now = new Date();
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
      }

      protected executeHandlers(entry: BaseLogEntry) {
        for (var key in this.handlers) {
          var handler: EntryHandler = this.handlers[key];
          this.scheduler.push(handler, entry);
        }
        return true;
      }

      public addHandler(handler: EntryHandler): void {
        if (this.handlers.indexOf(handler) === -1) {
          this.handlers.push(handler);
        }
      }

      public removeHandler(handler: EntryHandler): void {
        var index = this.handlers.indexOf(handler);
        if (index > -1) {
          this.handlers.splice(index, 1);
        }
      }
    }

    export class MessageLogger extends BaseLogger {
      private readonly entries: Array<BaseLogEntry>;
      private readonly groups: Array<string>;

      constructor(options?: any) {
        super(options);
        this.entries = [];
        this.groups = [];
      }

      public truncateLog() {
        this.entries.splice(0, this.entries.length);
      }

      public assert() {
        var args = this.toArray(arguments);
        var assertion = args.shift();
        if (assertion) {
          return;
        }
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('ASSERT', this.gatherMetadata(), args);
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public clear() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('CLEAR', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public debug() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('DEBUG', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public error() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('ERROR', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public info() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('INFO', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public log() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('LOG', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public warn() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('WARN', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public group() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('GROUP', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);

        if (arguments.length > 0) {
          var groupLabel = arguments[0];
          this.groups.push(groupLabel);
        }
      }

      public groupEnd() {
        const entry: Logging.entry.MessageEntry = new Logging.entry.MessageEntry('GROUPEND', this.gatherMetadata(), this.toArray(arguments));
        this.entries.push(entry);
        this.executeHandlers(entry);
        this.groups.pop();
      }
    }

    export class EventLogger extends BaseLogger implements EventLogger {
      LOGENTRYTYPE: string = 'Event';

      constructor(options?: any) {
        super(options);
        this.handle = this.handle.bind(this);
      }

      handle(event: ErrorEvent): boolean {
        const entry: Logging.entry.EventEntry = new Logging.entry.EventEntry(event.type.toUpperCase(), this.gatherMetadata(), event);
        this.executeHandlers(entry);
        return true;
      }
    }

  }
}
