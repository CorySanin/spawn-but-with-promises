import { describe, expect, it } from 'vitest';
import { spawn } from '../src/index.js';

describe('spawn-but-with-promises', () => {
    it('spawns a process and can be awaited', async () => {
        const events: string[] = []
        const process = spawn('echo', ['hello', 'world']);
        process.on('spawn', () => {
            events.push('spawn');
        });
        process.stdout.on('data', (d: Buffer) => {
            events.push(`print ${d.toString().split('\n')[0]}`);
        });
        process.on('exit', () => {
            events.push('exit');
        });
        expect(events).to.be.ordered.members([]);
        await expect(process).resolves.to.be.equal(0);
        events.push('awaited');

        expect(events).to.be.ordered.members(
            [
                'spawn',
                'print hello world',
                'exit',
                'awaited'
            ]
        );
    });

    it('doesn\'t resolve until execution completes', async () => {
        const startTime = new Date();
        await spawn('sleep', ['1s'], {
            rejectOnNonZero: true
        });
        const endTime = new Date();
        expect(endTime.getTime() - startTime.getTime()).to.be.greaterThan(1000);
    });

    it('doesn\'t throw an error on non-zero exit code', async () => {
        await expect(spawn('false')).resolves.to.be.equal(1);
    });

    it('throws an error on non-zero exit code when rejectOnNonZero is true', async () => {
        await expect(spawn('false', [], {
            rejectOnNonZero: true
        })).rejects.toThrow('command `false` exited with code 1');
    });

    it('allows handling promise with "then()"', () => new Promise<void>(done => {
        const events: string[] = [];
        const process = spawn('echo', ['hello', 'world']);
        process.on('spawn', () => {
            events.push('spawn');
        });
        process.stdout.on('data', (d: Buffer) => {
            events.push(`print ${d.toString().split('\n')[0]}`);
        });
        process.on('exit', () => {
            events.push('exit');
        });
        expect(events).to.be.ordered.members([]);
        process.then(code => {
            expect(code).to.be.equal(0);
            events.push('awaited');
            expect(events).to.be.ordered.members(
                [
                    'spawn',
                    'print hello world',
                    'exit',
                    'awaited'
                ]
            );
            done();
        });
    }));

    it('allows handling promise rejection with "catch()"', () => new Promise<void>(done => {
        spawn('false', ['arg'], {
            rejectOnNonZero: true
        }).then(() => {
            expect.unreachable();
        }).catch((err: Error) => {
            expect(err.message).to.be.equal('command `false arg` exited with code 1');
            done();
        });
    }));
});
