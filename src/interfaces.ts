interface DataCollector {
  collect(): any;
}

interface LogEntryMetadata {
  timestamp: Date,
  type: string,
  environment: string,
  data: any
}

interface BaseLogEntry {
  type: string,
  metadata: LogEntryMetadata,
};


interface LogEntry extends BaseLogEntry {
  arguments: Array<any>
}

interface LogEventEntry extends BaseLogEntry {
  event: any
}

interface EntryHandler {
  handle(entry: BaseLogEntry): boolean;
}

interface EventLogger {
  handle(event: Event): boolean;
}
