import data from "./data/ledger-01.json";
import { accountDaily } from "./account-daily";

const ACCOUNT_TO_PROBE = "101.0001 cash";
const ACCOUNT_DAYS_COUNT = 31;

const ACCOUNT_TO_CREDIT = "311.0001 income";
const ACCOUNT_TOTAL_CREDIT = 304964;

const ACCOUNT_TO_DEBIT = "103.0001 bank";
const ACCOUNT_TOTAL_DEBIT = 336205;

describe("general ledger reducer accountDaily", () => {
    it("creates array for each day", () => {
        const result = accountDaily(ACCOUNT_TO_PROBE, data);
        expect(result.length).toBe(ACCOUNT_DAYS_COUNT);
    });

    it("collects all credits for an account", () => {
        const result = accountDaily(ACCOUNT_TO_CREDIT, data);
        const total = result.reduce((a, b) => a + b.creditDayTotal, 0);
        expect(Math.floor(total)).toBe(ACCOUNT_TOTAL_CREDIT);
    });

    it("collects all debits for an account", () => {
        const result = accountDaily(ACCOUNT_TO_DEBIT, data);
        const total = result.reduce((a, b) => a + b.creditDayTotal, 0);
        expect(Math.floor(total)).toBe(ACCOUNT_TOTAL_DEBIT);
    });
});
