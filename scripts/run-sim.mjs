import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const task = process.argv[2] ?? 'sim-demo';
if (!['sim-demo', 'sim-benchmark', 'record-replay'].includes(task)) throw new Error('Unknown sim task');
const out = path.resolve('.cache/sim-tools');
await build({configFile:false,logLevel:'error',build:{ssr:`scripts/${task}.ts`,outDir:out,emptyOutDir:false,minify:false}});
await import(pathToFileURL(path.join(out,`${task}.js`)).href);
