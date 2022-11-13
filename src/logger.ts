/// <reference path="interfaces.ts" />
/// <reference path="collector.ts" />
/// <reference path="handler.ts" />

namespace Logging {
  export namespace logger {

    export class BaseLogger {
      protected readonly collectors: Record<string, DataCollector>;
      protected readonly handlers: Array<EntryHandler>;

      constructor(options?: any) {
        options = options || {};
        this.collectors = options.collectors || {
          'navigation': new Logging.collector.NavigationCollector(),
          'screen': new Logging.collector.ScreenCollector(),
          'performance': new Logging.collector.PerformanceCollector()
        };
        this.handlers = options.handlers || [];
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

      protected gatherMetadata(): LogEntryMetadata {
          return {
            timestamp: new Date,
            data: this.collect(),
            type: 'Browser'
          };
      }

      protected executeHandlers(entry: BaseLogEntry) {
        var success = true;
        for (var key in this.handlers) {

          var handler: EntryHandler = this.handlers[key];
          try {
            handler.handle(entry);
          } catch (e) {
            console.error(e);
            success = false;
          }

        }
        return success;
      }
    }

    export class Logger extends BaseLogger {
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
        const entry: LogEntry = {
            type: 'ASSERT',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public clear() {
        const entry: LogEntry = {
            type: 'CLEAR',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public debug() {
        const entry: LogEntry = {
            type: 'DEBUG',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public error() {
        const entry: LogEntry = {
            type: 'ERROR',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public info() {
        const entry: LogEntry = {
            type: 'INFO',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public log() {
        const entry: LogEntry = {
            type: 'LOG',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public warn() {
        const entry: LogEntry = {
            type: 'WARN',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
      }

      public group() {
        const entry: LogEntry = {
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
      }

      public groupEnd() {
        const entry: LogEntry = {
            type: 'GROUPEND',
            arguments: this.toArray(arguments),
            metadata: this.gatherMetadata()
          };
        this.entries.push(entry);
        this.executeHandlers(entry);
        this.groups.pop();
      }
    }

    export class EventLogger extends BaseLogger implements EventLogger {

      constructor(options?: any) {
        super(options);
        this.handle = this.handle.bind(this);
      }

      stringifyEvent(event: Event) {
        const obj: any = {};
        for (let k in event) {
          obj[k] = event[k as keyof Event];
        }
        return JSON.stringify(obj, function(key, value) {
          if (value instanceof Node) return 'Node';
          if (value instanceof Window) return 'Window';
          if (value instanceof Error) {return { message: value.message, stack: value.stack }};
          return value;
        }, ' ');
      }

      handle(event: Event): boolean {
        const eventData: any = JSON.parse(this.stringifyEvent(event)),
          entry: LogEventEntry = {
            type: event.type,
            metadata: this.gatherMetadata(),
            event: eventData
          };

        var success = this.executeHandlers(entry);
        return success;
      }
    }

  }
}
