/// <reference path="interfaces.ts" />


namespace Logging {
    export namespace entry {
  
        export abstract class BaseEntry implements BaseLogEntry {
            public readonly type: string;
            public readonly metadata: LogEntryMetadata;

            constructor(type: string, metadata: LogEntryMetadata) {
                this.type = type;
                this.metadata = metadata;
            }

            getMessage(): string {
                throw Error('message is undefined');
            }

            toJSON(): any {
                return {
                    type: this.type,
                    metadata: this.metadata
                };
            }

            stringify() {
                return JSON.stringify(this);
            }
        }

        export class MessageEntry extends BaseEntry implements LogEntry {
            public readonly arguments: Array<any>;

            constructor(type: string, metadata: LogEntryMetadata, args: Array<any>) {
                super(type, metadata);
                this.arguments = args;
            } 

            getMessage(): string {
                return this.arguments.join(' ');
            }

            toJSON(): any {
                console.log('test');
                var output = super.toJSON();
                output.arguments = this.arguments;
                return output;
            }
        }

        export class EventEntry extends BaseEntry implements LogEventEntry {
            public readonly event: ErrorEvent;

            constructor(type: string, metadata: LogEntryMetadata, event: ErrorEvent) {
                super(type, metadata);
                this.event = event;
            } 

            getMessage(): string {
                return this.event.message;
            }

            toJSON(): any {
                var output = super.toJSON();
                output.event = JSON.parse(this.stringifyEvent(this.event));
                return output;
            }

            stringifyEvent(event: Event): string {
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
        }

    }
}