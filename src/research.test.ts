import {
  performance,
  PerformanceObserver
} from 'perf_hooks'

const observed: unknown[] = []

const obs = new PerformanceObserver((list) => {
  observed.push(list.getEntries()[0].duration);
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });


/** @see https://nodejs.org/api/perf_hooks.html#performancetimerifyfn-options  */
it("basic wrap", () => {
  const wrapped = performance.timerify(someFunction);
  // A performance timeline entry will be created
  wrapped();
  expect(observed).toHaveLength(1)  
  expect(observed[0]).toBeLessThan(0.1)
})

function someFunction() {
  return 'hello world'
}
