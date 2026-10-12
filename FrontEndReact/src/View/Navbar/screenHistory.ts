// Gives the browser's Back and Forward buttons something to move between.
//
// The app has one URL ('/'), and AppState switches screens through component
// state (activeTab) rather than routes, so on its own the browser never learns
// that the user moved from one screen to another. Back then skipped every
// screen and left the app, often onto a blank page.
//
// ScreenHistory adds one history entry per screen change and keeps a snapshot
// of the screen's state for each entry. When the user presses Back or Forward,
// it hands the snapshot for the entry they landed on to onRestore. Back from
// the first screen still leaves the app, as it does on any other site.
//
// Snapshots live in memory and are keyed by a per-instance session id that is
// stored in history.state, so entries left over from an earlier login or from
// before a page reload are ignored instead of restoring the wrong screen.

const HISTORY_STATE_KEY = 'skillBuilderScreen';

interface ScreenEntryTag {
    session: string;
    index: number;
}

let sessionCounter = 0;

class ScreenHistory<Snapshot> {
    private readonly session = `${Date.now()}-${++sessionCounter}`;
    private snapshots: Snapshot[] = [];
    private currentIndex = 0;

    constructor(
        private readonly screenKeyOf: (snapshot: Snapshot) => string,
        private readonly onRestore: (snapshot: Snapshot) => void,
    ) {}

    // Tags the current history entry as the first screen. This replaces the
    // entry rather than pushing a new one, so it adds nothing to Back.
    start(initial: Snapshot): void {
        this.snapshots = [initial];
        this.currentIndex = 0;
        this.writeEntry('replace', 0);
        window.addEventListener('popstate', this.handlePopState);
    }

    stop(): void {
        window.removeEventListener('popstate', this.handlePopState);
    }

    // Call after every state change. A change of screen adds a history entry;
    // anything else updates the current entry's snapshot, so going Back later
    // restores the screen as the user left it.
    record(snapshot: Snapshot): void {
        const current = this.snapshots[this.currentIndex];

        if (current === undefined || this.screenKeyOf(current) === this.screenKeyOf(snapshot)) {
            this.snapshots[this.currentIndex] = snapshot;
            return;
        }

        // A new screen after going Back discards the screens ahead of it,
        // matching how the browser drops its own Forward entries on a push.
        this.snapshots.length = this.currentIndex + 1;
        this.snapshots.push(snapshot);
        this.currentIndex = this.snapshots.length - 1;
        this.writeEntry('push', this.currentIndex);
    }

    private handlePopState = (event: PopStateEvent): void => {
        const tag: unknown = event.state?.[HISTORY_STATE_KEY];

        if (!isScreenEntryTag(tag) || tag.session !== this.session) {
            return;
        }

        const snapshot = this.snapshots[tag.index];

        if (snapshot === undefined) {
            return;
        }

        // Set before onRestore so the record() call from the resulting
        // re-render sees the restored screen as current and adds no entry.
        this.currentIndex = tag.index;
        this.onRestore(snapshot);
    };

    // Spreads the existing history.state so React Router's own fields
    // ({ usr, key, idx }) survive on every entry this class writes.
    private writeEntry(mode: 'push' | 'replace', index: number): void {
        const tag: ScreenEntryTag = { session: this.session, index };
        const state = { ...window.history.state, [HISTORY_STATE_KEY]: tag };

        if (mode === 'push') {
            window.history.pushState(state, '');
        } else {
            window.history.replaceState(state, '');
        }
    }
}

function isScreenEntryTag(value: unknown): value is ScreenEntryTag {
    return typeof value === 'object' && value !== null
        && typeof (value as ScreenEntryTag).session === 'string'
        && typeof (value as ScreenEntryTag).index === 'number';
}

export default ScreenHistory;
