import {freemem, totalmem} from "os"
/** node 16 */
// import {measureMemory} from "vm"
import {
  getHeapCodeStatistics,
  // getHeapSpaceStatistics,
  getHeapStatistics
} from "v8"

export {
  memStats,
  v8Stats
  // memStats2
}

function memStats() {
  return {
    "freemem": freemem(),
    "totalmem": totalmem(),
    // "spaces": getHeapSpaceStatistics(),
    ...process.memoryUsage(),
  }
}
function v8Stats() {
  return {
    ...getHeapCodeStatistics(),
    ...getHeapStatistics()
  }
}
/** node 16 */
// function memStats2() {
//   return measureMemory()
// }