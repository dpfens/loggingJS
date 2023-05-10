interface DataCollector {
  collect(): any;
}

interface Timestamp {
  value: Date,
  offset: number,
  timestamp: number
}

interface LogEntryMetadata {
  timestamp: Timestamp,
  type: string,
  environment: string,
  data: any
}

interface BaseLogEntry {
  type: string,
  metadata: LogEntryMetadata,
  getMessage(): string,
  toJSON(): any
};


interface LogEntry extends BaseLogEntry {
  arguments: Array<any>
}

interface LogEventEntry extends BaseLogEntry {
  event: ErrorEvent
}

interface EntryHandler {
  handle(entry: BaseLogEntry): boolean;
}

interface EventLogger {
  handle(event: Event): boolean;
}
