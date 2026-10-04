export class ExpiringKeySet {
    private readonly expiryTimestampByKey = new Map<string, number>();
    private readonly timeToLiveMilliseconds: number;
    private readonly maximumKeyCount: number;

    constructor(timeToLiveMilliseconds: number, maximumKeyCount: number) {
        this.timeToLiveMilliseconds = timeToLiveMilliseconds;
        this.maximumKeyCount = maximumKeyCount;
    }

    has(key: string): boolean {
        const expiryTimestamp = this.expiryTimestampByKey.get(key);
        if (expiryTimestamp === undefined) return false;
        if (expiryTimestamp > Date.now()) return true;
        this.expiryTimestampByKey.delete(key);
        return false;
    }

    add(key: string): void {
        this.expiryTimestampByKey.delete(key);
        this.expiryTimestampByKey.set(key, Date.now() + this.timeToLiveMilliseconds);
        this.evictOldestKeysBeyondCapacity();
    }

    private evictOldestKeysBeyondCapacity(): void {
        for (const oldestKey of this.expiryTimestampByKey.keys()) {
            if (this.expiryTimestampByKey.size <= this.maximumKeyCount) return;
            this.expiryTimestampByKey.delete(oldestKey);
        }
    }
}
