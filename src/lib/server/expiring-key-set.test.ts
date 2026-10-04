import assert from "node:assert/strict";
import {afterEach, beforeEach, describe, it, mock} from "node:test";
import {ExpiringKeySet} from "./expiring-key-set.ts";

describe("ExpiringKeySet", () => {
    beforeEach(() => mock.timers.enable({apis: ["Date"], now: 0}));
    afterEach(() => mock.timers.reset());

    it("remembers a key until its time to live elapses", () => {
        const expiringKeySet = new ExpiringKeySet(1_000, 10);
        expiringKeySet.add("visitor");
        mock.timers.tick(999);
        assert.equal(expiringKeySet.has("visitor"), true);
        mock.timers.tick(1);
        assert.equal(expiringKeySet.has("visitor"), false);
    });

    it("refreshes the time to live when a key is added again", () => {
        const expiringKeySet = new ExpiringKeySet(1_000, 10);
        expiringKeySet.add("visitor");
        mock.timers.tick(800);
        expiringKeySet.add("visitor");
        mock.timers.tick(800);
        assert.equal(expiringKeySet.has("visitor"), true);
    });

    it("evicts the oldest keys once capacity is exceeded", () => {
        const expiringKeySet = new ExpiringKeySet(1_000, 2);
        expiringKeySet.add("first");
        expiringKeySet.add("second");
        expiringKeySet.add("third");
        assert.equal(expiringKeySet.has("first"), false);
        assert.equal(expiringKeySet.has("second"), true);
        assert.equal(expiringKeySet.has("third"), true);
    });
});
