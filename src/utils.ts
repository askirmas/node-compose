export {
  objectDiff
}

function objectDiff<T extends Record<string, any>>(next: T, base: T) {
  const diff = {} as T

  for (const key in base) {
    const value = next[key]
    //@ts-expect-error
    diff[key] = typeof value !== "number" ? value
    // : transform ? transform(next[key] - value)
    : value - base[key]
  }

  return diff
}