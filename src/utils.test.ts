import { objectDiff } from "./utils";

describe(objectDiff.name, () => {
  it("demo", () => expect(objectDiff(
    {"name": "next", "value": 2},
    {"name": "before", "value": 1},
  )).toStrictEqual({
    "name": "next", "value": 1
  }))
})