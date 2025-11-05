# spawn-but-with-promises

Works identically to [child_process.spawn()](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) but is also a promise.
Implementation including types is less than 50 lines.

# Usage

```
import { spawn } from 'spawn-but-with-promises';

const process = spawn('echo', ['hello', 'world']);
process.stdout.on('data', (d) => {
    console.log(d.toString());
});
await process;
console.log('process finished.');

```

The promise resolves to the processes exit code. If you want to throw an exception when the exit code isn't 0, pass `rejectOnNonZero: true`:

```
const process = spawn('ls', ['/this/will/fail'], {
    rejectOnNonZero: true
});
```
