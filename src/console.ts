import './collector.ts';

interface LogEntry {
  type: string,
  arguments: Array<any>,
  metadata: object
};

class Logger implements Console {
  private readonly console: Console | null;
  private readonly collectors: object;
  private readonly logs: Array<LogEntry>;
  private endpoints: Array<string>;
  private groups: Array<string>;

  constructor(options: any | null) {
    this.logs = [];

    options = options || {};
    this.console = options.console || window.console;

    this.collectors = options.collectors || {};

    var defaultEndpoint = window.location.host + '/logger';
    this.endpoints = options.endpoints || [defaultEndpoint];
  }

  protected toArray(iterable: any) {
    const output = [];
    for (var i = 0; i < iterable.length; i++) {
      output.push(iterable[i]);
    }
    return output;
  }

  protected gatherMetadata() {
      return {
        timestamp: new Date,
        stack: new Error().stack,
        lineNumber: new Error().lineNumber,
        memory: console.memory,
        groups: this.groups,
        type: 'Browser'
      };
  }

  public getLogs() {
    const output = [];
    for (var i = 0; i < this.logs.length; i++) {
      output.push(this.logs[i]);
    }
    return output;
  }

  public truncateLog() {
    this.logs.splice(0, this.logs.length);
  }

  public assert() {
    if (this.console) {
      this.console.assert.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'ASSERT',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
  }

  public clear() {this.console.assert.apply(this.console, arguments);
    if (this.console) {
      this.console.clear.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'CLEAR',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
  }

  public debug() {
    if (this.console) {
      this.console.debug.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'DEBUG',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
  }

  public error() {
    if (this.console) {
      this.console.error.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'ERROR',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
  }

  public info() {
    if (this.console) {
      this.console.info.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'INFO',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
  }

  public log() {
    if (this.console) {
      this.console.log.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'LOG',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
  }

  public warn() {
    if (this.console) {
      this.console.warn.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'WARN',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
  }

  public group() {
    if (this.console) {
      this.console.group.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'GROUP',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);

    if (arguments.length > 0) {
      var groupLabel = arguments[0];
      this.groups.push(groupLabel);
    }
  }

  public groupEnd() {
    if (this.console) {
      this.console.groupEnd.apply(this.console, arguments);
    }
    const metadata = this.gatherMetadata(),
      entry = {
        type: 'GROUPEND',
        arguments: this.toArray(arguments),
        metadata: metadata,
        data: {}
      };
    for (var key in this.collectors) {
      entry.data[key] = this.collectors[key].collect();
    }
    this.logs.push(entry);
    this.groups.pop();
  }
}
