import {
  performance,
  PerformanceEntry,
  PerformanceObserver
} from 'perf_hooks'
import { matchers } from 'jest-json-schema';

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

afterAll(() =>  obs.disconnect())
/** @see https://nodejs.org/api/perf_hooks.html#performancetimerifyfn-options  */
it("basic wrap", () => {
  const wrapped = performance.timerify(someFunction);
  // A performance timeline entry will be created
  wrapped();
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
    "detail": undefined
  })
  expect(duration).toBeLessThan(0.1)
})

function someFunction() {
  return 'hello world'
}
