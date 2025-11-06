import { spawn as ogSpawn, type ChildProcessWithoutNullStreams, type SpawnOptions } from 'child_process';

function spawn(command: string, args?: string[] | ReadonlyArray<string>, options?: SpawnPromiseOptions): ChildProcessWithoutNullStreamsAndPromise {
    const process = ogSpawn(command, args, options) as ChildProcessWithoutNullStreamsAndPromise;
    const promise = new Promise<number>((resolve, reject) => {
        process.on('close', code => {
            if (options?.rejectOnNonZero && code !== 0) {
                reject(new Error(`command exited with code ${code}`));
            }
            else {
                resolve(typeof code === 'number' ? code : 0)
            }
        });
        process.on('error', reject);
    });

    Object.assign(process, {
        promise,
        then: promise.then.bind(promise),
        catch: promise.catch.bind(promise),
        finally: promise.finally.bind(promise),
    });

    return process;
}

interface ChildProcessWithoutNullStreamsAndPromise extends ChildProcessWithoutNullStreams {
    promise: Promise<number>;
    then<TResult1 = number, TResult2 = never>(
        onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2>;

    catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
    ): Promise<number | TResult>;

    finally(onfinally?: (() => void) | null): Promise<number>;
}

interface SpawnPromiseOptions extends SpawnOptions {
    rejectOnNonZero?: boolean;
}

export default spawn;
export { spawn };
export type { ChildProcessWithoutNullStreamsAndPromise, SpawnPromiseOptions };
