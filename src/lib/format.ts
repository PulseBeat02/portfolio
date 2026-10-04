const THOUSAND = 1_000;
const TEN_THOUSAND = 10_000;

const shortUtcDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

export function formatCompactCount(count: number): string {
    if (count < THOUSAND) return String(count);
    const fractionDigits = count >= TEN_THOUSAND ? 0 : 1;
    return `${(count / THOUSAND).toFixed(fractionDigits).replace(/\.0$/, "")}k`;
}

export function formatDateRange(period: string): string {
    return period.replace(' - ', ' – ');
}

function parseIsoDate(isoDate: string): Date {
    return new Date(`${isoDate}T00:00:00Z`);
}

export function formatPublishedDate(isoDate: string): string {
    return shortUtcDateFormatter.format(parseIsoDate(isoDate));
}

export function formatShortUtcDate(date: Date): string {
    return shortUtcDateFormatter.format(date);
}
