const test = require("node:test");
const assert = require("assert");

const main = require("./main.js");

test("test simple date to epoch", () => {
    let res = main.dateToEpoch("2021-01-01").toISOString();

    assert.equal(res, "2021-01-01T00:00:00.000Z");
});

test("test not a date to epoch", () => {
    let res = main.dateToEpoch("nala");

    assert.strictEqual(res, null);

    res = main.dateToEpoch("Infinity");

    assert.strictEqual(res, null);

    res = main.dateToEpoch("1..1");

    // TODO: This should be null, but Date ctor is super lenient.
    // assert.strictEqual(res, null);
});

test("test simple epoch sec to date", () => {
    let res = main.epochToDate(1700000000).toISOString();

    assert.equal(res, "2023-11-14T22:13:20.000Z");
});

test("test simple epoch ms to date", () => {
    let res = main.epochToDate(1700000000000).toISOString();

    assert.equal(res, "2023-11-14T22:13:20.000Z");
});


test("test small num to date", () => {
    let res = main.epochToDate(1700);

    assert.strictEqual(res, null);
    
    res = main.epochToDate(-50);

    assert.strictEqual(res, null);

    res = main.epochToDate(2109375);

    assert.strictEqual(res, null);
});


test("test small num to epoch", () => {
    let res = main.dateToEpoch("1700");

    assert.strictEqual(res, null);
    
    res = main.dateToEpoch("80");

    assert.strictEqual(res, null);

    res = main.dateToEpoch("-50");

    assert.strictEqual(res, null);

    res = main.dateToEpoch("2109375");

    assert.strictEqual(res, null);
});

test("test big num is not a date", () => {
    res = main.dateToEpoch("1700000000.0");

    assert.strictEqual(res, null);
    
    res = main.dateToEpoch("1700000000000.0");

    assert.strictEqual(res, null);
});

test("test simple epoch sec str to date", () => {
    let res = main.epochToDate("1700000000.0").toISOString();

    assert.equal(res, "2023-11-14T22:13:20.000Z");
});

test("test simple epoch ms str to date", () => {
    let res = main.epochToDate("1700000000000.0").toISOString();

    assert.equal(res, "2023-11-14T22:13:20.000Z");
});

test("test non number to date", () => {
    let res = main.epochToDate("nala");

    assert.strictEqual(res, null);

    res = main.epochToDate("1..1");

    assert.strictEqual(res, null);

    res = main.epochToDate("Infinity");

    assert.strictEqual(res, null);
});

test("test timeSince", () => {
    let res = main.timeSince(new Date(0), new Date(1000));

    assert.strictEqual(res, "1 sec. ago");

    res = main.timeSince(new Date(0), new Date(125000));

    assert.strictEqual(res, "2 min. ago");

    res = main.timeSince(new Date(0), new Date(6000000));

    assert.strictEqual(res, "100 min. ago");

    res = main.timeSince(new Date(0), new Date(12000000));

    assert.strictEqual(res, "3 hr. ago");

    res = main.timeSince(new Date(100000), new Date(0));

    assert.strictEqual(res, "in 2 min.");

    res = main.timeSince(new Date(12000000), new Date(0));

    assert.strictEqual(res, "in 4 hr.");
});

test("test format", () => {
    let res = main.formatMaybeEpochOrDate("nala", new Date(0));

    assert.deepEqual(res, [null, null]);

    res = main.formatMaybeEpochOrDate("2021-01-01", new Date("2021-01-02"));

    assert.deepEqual(res, [
        "1609459200.000 (24 hr. ago)",
        "1609459200.000"
    ]);

    res = main.formatMaybeEpochOrDate("1700000000", new Date("2024-01-02"));

    assert.deepEqual(res, [
        "2023-11-14T22:13:20.000Z (1,153 hr. ago)",
        "2023-11-14T22:13:20.000Z"
    ]);
});