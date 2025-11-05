# spawn-but-with-promises

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/CorySanin/spawn-but-with-promises/test.yml)](https://github.com/CorySanin/spawn-but-with-promises/actions/workflows/test.yml) 
[![GitHub License](https://img.shields.io/github/license/CorySanin/spawn-but-with-promises)](https://github.com/CorySanin/spawn-but-with-promises?tab=MIT-1-ov-file#readme) 
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/spawn-but-with-promises)](https://www.npmjs.com/package/spawn-but-with-promises) 
[![NPM Type Definitions](https://img.shields.io/npm/types/spawn-but-with-promises)](https://www.npmjs.com/package/spawn-but-with-promises) 
[![Dependency count](https://img.shields.io/badge/dependencies-0-yellow)](https://www.npmjs.com/package/spawn-but-with-promises?activeTab=dependencies) 


Works identically to [child_process.spawn()](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) but is also a promise.
Implementation including types is less than 50 lines.

# Install

```
npm install -s spawn-but-with-promises
```

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
