/// <reference path="interfaces.ts" />

interface Task {
  handler: EntryHandler,
  entry: BaseLogEntry
}

namespace Logging {
  export namespace scheduler {

    export abstract class BaseScheduler {

      public abstract push(handler: EntryHandler, entry: BaseLogEntry): void;
      public static isSupported(): boolean {
        return false;
      }

    }

    export class IdleBackgroundScheduler extends BaseScheduler {
      protected queue: Array<Task>;
      protected isHandling: number;
      protected timeout?: number;

      constructor(timeout?: number) {
        super();
        this.queue = [];
        this.isHandling = 0;
        this.timeout = timeout;
        this.handle = this.handle.bind(this);
      }

      public push(handler: EntryHandler, entry: BaseLogEntry): void {
        const task: Task = {
          handler: handler,
          entry: entry
        };
        this.queue.push(task);
        if (!this.isHandling) {
          this.startIdleProcessing();
        }
      }

      protected startIdleProcessing() {
        if (this.timeout) {
          this.isHandling = requestIdleCallback(this.handle, { timeout: this.timeout });
        } else {
          this.isHandling = requestIdleCallback(this.handle);
        }
      }

      protected handle(deadline: IdleDeadline) {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.queue.length > 0) {
            const task: Task = this.queue.shift() as Task;
            task.handler.handle(task.entry);
        }

        if (this.queue.length) {
          this.startIdleProcessing();
        } else {
          this.isHandling = 0;
        }
      }

      public static isSupported(): boolean {
        return 'requestIdleCallback' in window;
      }
    }


    export class BlockingScheduler extends BaseScheduler {
      protected timeout?: number;

      constructor(timeout?: number) {
        super();
        this.timeout = timeout;
      }

      public push(handler: EntryHandler, entry: BaseLogEntry): void {
        if (this.timeout) {
          setTimeout(function() {
            handler.handle(entry);
          }, this.timeout);
        } else {
          handler.handle(entry);
        }
      }

      public static isSupported(): boolean {
        return true;
      }

    }

  }
}
