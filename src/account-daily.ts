import { AccountDaily, GeneralLedgerEntryPart } from "./interfaces/i-faces";

type AccountDailyReducer = (
    accountId: string,
    ledger: GeneralLedgerEntryPart[]
) => AccountDaily[];

const createAccountDaily = (date: string): AccountDaily => ({
    creditDayTotal: 0,
    date,
    debitDayTotal: 0
});

const setMapThough = (accumulator: Map<string, AccountDaily>, row: AccountDaily) => {
    accumulator.set(row.date, row);
    return row;
};

const getDate = (dateTime: string) => dateTime.substring(0, 10);

const getOrCreateDaily = (accumulator: Map<string, AccountDaily>, dateFull: string): AccountDaily => {
    const date = getDate(dateFull);
    const stored = accumulator.get(date);
    return typeof stored !== "undefined"
        ? stored
        : setMapThough(accumulator, createAccountDaily(date));
};

const createReducer = (accountId: string) => {
    const debitFilter = (item: GeneralLedgerEntryPart) =>
        accountId === item.debitAccountId;
    const creditFilter = (item: GeneralLedgerEntryPart) =>
        accountId === item.creditAccountId;
    return (
        accumulator: Map<string, AccountDaily>,
        item: GeneralLedgerEntryPart
    ) => {
        const isCredit = creditFilter(item);
        const isDebit = debitFilter(item);
        if (isCredit || isDebit) {
            const row = getOrCreateDaily(accumulator, item.posted);
            row.creditDayTotal += isCredit ? item.amount : 0;
            row.debitDayTotal += isDebit ? item.amount : 0;
        }
        return accumulator;
    };
};

export const accountDaily: AccountDailyReducer = (accountId, ledger) => [
    ...ledger.reduce(createReducer(accountId), new Map()).values()
];
