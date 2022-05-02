import { Storage, TaskManager, normalizeUrl } from '~/graffiti';

import type { Graffiti, Url, Identifier } from '~/types.d';

describe('normalizeUrl', () => {
  it('returns only host- and pathname without trailing slash', () => {
    expect(normalizeUrl('https://test.de/path')).toBe('test.de/path');
    expect(normalizeUrl('https://test.de/path/')).toBe('test.de/path');
    expect(normalizeUrl('http://test.de/path/')).toBe('test.de/path');
    expect(normalizeUrl('http://test.de/path#an')).toBe('test.de/path');
    expect(normalizeUrl('http://test.de/path/?q=2')).toBe('test.de/path');

    expect(normalizeUrl('https://test.de/index.html')).toBe(
      'test.de/index.html',
    );
    expect(normalizeUrl('https://test.de/index.html?q=23')).toBe(
      'test.de/index.html',
    );

    expect(normalizeUrl('http://localhost:3000/test?q=2&p=12')).toBe(
      'localhost:3000/test',
    );
  });
});

describe('Storage', () => {
  it('returns correct values', () => {
    const storage = new Storage();

    const url: Url = 'https://somedomain.com/with/a/normalized/path';
    const id: Identifier =
      '0020f6cec4fc2091b1719e598a10c25c503b44394f6e2acbc085f4e0739df15df414';
    const graffiti: Graffiti = {
      id,
      version:
        '00202ac873c800c3a67653cf93f9256ab4785e50ebd3691e46f14506bb6259206ced',
      author:
        '9dd0b1e0f33f582887c6e268d9f3a61c666a56ab230731946ec41e2bd7531ef6',
      mode: 'spray',
      path: [
        [22, 22, 0.5],
        [50, 100, 0.5],
      ],
      target: '.some > .selector',
    };

    storage.set(url, id, graffiti);

    const anotherUrl: Url = 'https://domain.com';
    const anotherId: Identifier =
      '00200eb94c5bf1abe1fe2076c9676a510d1c19ea45022bad7c07a9a67b7ecc0bdf36';
    const anotherGraffiti: Graffiti = {
      id: anotherId,
      version:
        '0020a15933b4e69111aa25c32fdf44c63b0c05110dd0ccff18837d55bfe2f2e7666f',
      author:
        'ac2ba676c388c3c7144d1d8099d2a0d21aa5845fd2dcfb40ea1d225cebe6f797',
      mode: 'music',
      path: [
        [100, 50, 0.5],
        [150, 50, 0.5],
        [200, 150, 0.5],
      ],
      target: '.another > .selector >.depth',
    };

    storage.set(anotherUrl, anotherId, anotherGraffiti);

    expect(storage.get(url, id)).toEqual(graffiti);
    expect(storage.get(anotherUrl, id)).toBeUndefined();
    expect(storage.get(anotherUrl, anotherId)).toEqual(anotherGraffiti);

    expect(storage.getUrl(url)).toEqual([graffiti]);
    expect(storage.getUrl(anotherUrl)).toEqual([anotherGraffiti]);

    expect(storage.getAll()).toEqual([graffiti, anotherGraffiti]);
  });

  it('returns correct values when being empty', () => {
    const storage = new Storage();
    expect(storage.getUrl('https://test.com')).toEqual([]);
    expect(storage.getAll()).toEqual([]);
  });
});

describe('TaskManager', () => {
  it('runs all tasks before final callback', async () => {
    const manager = new TaskManager();

    const taskOne = jest.fn();
    const taskTwo = jest.fn();
    const taskThree = jest.fn();
    const callback = jest.fn();
    const taskId = 1;

    manager.clear(taskId);
    manager.add(taskId, taskOne);
    manager.add(taskId, taskTwo);
    manager.add(taskId, taskThree);

    expect(taskOne).toBeCalledTimes(1);
    expect(taskTwo).toBeCalledTimes(1);
    expect(taskThree).toBeCalledTimes(1);
    expect(callback).toBeCalledTimes(0);

    await manager.finish(taskId, callback);

    expect(callback).toBeCalledTimes(1);
  });

  it('does not run callback when tasks get cancelled', async () => {
    const manager = new TaskManager();

    const task = jest.fn();
    const callback = jest.fn();
    const taskId = 23;

    manager.clear(taskId);
    manager.add(taskId, task);
    manager.clear(taskId);
    await manager.finish(taskId, callback);

    expect(task).toBeCalledTimes(1);
    expect(callback).toBeCalledTimes(0);
  });
});
