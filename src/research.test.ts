import {
  performance,
  PerformanceEntry,
  PerformanceObserver
} from 'perf_hooks'
import { matchers } from 'jest-json-schema';
import { memStats, v8Stats } from './memory';
import { objectDiff } from './utils';
import { getHeapSpaceStatistics } from 'v8';

expect.extend(matchers);
const observed: PerformanceEntry[] = []

const obs = new PerformanceObserver(list => {
  const entries = list.getEntries()
  observed.push(...entries);
});
obs.observe({
  "entryTypes": [
    "function"
  ],
  // buffered: true
});

afterAll(() => {
  obs.disconnect()
  console.log(observed)
})

/** @see https://nodejs.org/api/perf_hooks.html#performancetimerifyfn-options  */
it("basic wrap", async () => {
  const mem1before = memStats()
  , v8before = v8Stats()
  , wrapped = performance.timerify(someFunction);
  // A performance timeline entry will be created
  wrapped();

  const mem1after = memStats()
  , v8after = v8Stats()

  expect(observed).toHaveLength(1)  
  const {
    duration,
    entryType,
    name,
    // startTime,
    detail
  } = observed[0]
  expect({
    entryType,
    name,
    detail
  }).toStrictEqual({
    "entryType": "function",
    "name": someFunction.name,
    // node v16 "detail": []
    "detail": undefined
  })
  expect(duration).toBeLessThan(0.1)


  const {heapUsed, freemem, rss, external, ...memZeros} = objectDiff(mem1after, mem1before)
  expect(memZeros).toStrictEqual({
    "arrayBuffers": 0,
    "heapTotal": 0,
    "totalmem": 0,    
  })
  console.log({heapUsed, freemem, rss, external})

  const {
    bytecode_and_metadata_size,
    total_available_size,
    total_physical_size,
    used_heap_size,
    ...v8zeros
  } = objectDiff(v8after, v8before)

  console.log({
    bytecode_and_metadata_size,
    total_available_size,
    total_physical_size,
    used_heap_size,    
  })

  expect(v8zeros).toStrictEqual({
    "code_and_metadata_size": 0,
    "does_zap_garbage": 0,
    "external_script_source_size": 0,
    "heap_size_limit": 0,
    "malloced_memory": 0,
    "number_of_detached_contexts": 0,
    "number_of_native_contexts": 0,
    "peak_malloced_memory": 0,
    "total_heap_size": 0,
    "total_heap_size_executable": 0,
  })

  console.log(getHeapSpaceStatistics())
})

function someFunction() {
  return 'hello world'
}
