import type { Graffiti, Url, Identifier } from '~/types.d';

/*
 * Returns only host- & pathname from an URL string without hash, parameters or
 * protocol. Removes trailing slashes from path.
 */
export function normalizeUrl(url: string): string {
  const { host, pathname } = new URL(url);
  return `${host}${pathname.endsWith('/') ? pathname.slice(0, -1) : pathname}`;
}

/*
 * Stores and returns graffiti data for all known urls.
 */
export class Storage {
  private storage: {
    [url: Url]: {
      [id: Identifier]: Graffiti;
    };
  };

  constructor() {
    this.storage = {};
  }

  set(url: Url, id: Identifier, value: Graffiti) {
    if (!(url in this.storage)) {
      this.storage[url] = {};
    }

    this.storage[url][id] = value;
  }

  get(url: Url, id: Identifier): Graffiti | undefined {
    if (!(url in this.storage)) {
      return undefined;
    }

    if (!(id in this.storage[url])) {
      return undefined;
    }

    return this.storage[url][id];
  }

  getUrl(url: Url): Graffiti[] {
    if (!(url in this.storage)) {
      return [];
    }

    return Object.keys(this.storage[url]).map((id: Identifier) => {
      return this.storage[url][id];
    });
  }

  getAll(): Graffiti[] {
    return Object.keys(this.storage)
      .map((url) => {
        return this.getUrl(url);
      })
      .flat();
  }
}

/*
 * Cancelable queue of tasks which executes final callback when all tasks
 * finished.
 */
class Task {
  cancelled: boolean;
  finished: boolean;

  private tasks: Promise<void>[];

  constructor() {
    this.tasks = [];
    this.cancelled = false;
    this.finished = false;
  }

  async add(task: () => Promise<void>) {
    if (this.cancelled) {
      return;
    }

    const promise = task();
    this.tasks.push(promise);
    await promise;
  }

  async finish(task: () => Promise<void>) {
    if (this.finished || this.cancelled) {
      return;
    }

    this.finished = true;

    await Promise.all(this.tasks);

    if (this.cancelled) {
      return;
    }

    await task();
  }

  cancel() {
    this.cancelled = true;
  }
}

/*
 * Manages a list of tasks.
 */
export class TaskManager {
  private tasks: { [taskId: number]: Task };

  constructor() {
    this.tasks = {};
  }

  async add(taskId: number, task: () => Promise<void>) {
    if (!(taskId in this.tasks) || this.tasks[taskId].cancelled) {
      this.tasks[taskId] = new Task();
    }

    return this.tasks[taskId].add(task);
  }

  async finish(taskId: number, task: () => Promise<void>) {
    if (!(taskId in this.tasks)) {
      return;
    }

    await this.tasks[taskId].finish(task);
  }

  clear(taskId: number) {
    if (!(taskId in this.tasks)) {
      return;
    }

    this.tasks[taskId].cancel();
  }
}
