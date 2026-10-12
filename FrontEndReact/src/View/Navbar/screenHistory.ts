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
// Snapshots live in memory, keyed by an entry id that is stored in
// history.state along with a per-instance session id. Entries left over from
// an earlier login or from before a page reload belong to another session.
// Landing on one shows nothing new, and the entry is claimed for the screen
// still showing, so a screen opened from there has a Back destination.

const HISTORY_STATE_KEY = 'skillBuilderScreen';

interface ScreenEntryTag {
    session: string;
    id: number;
}

let sessionCounter = 0;

class ScreenHistory<Snapshot> {
    private readonly session = `${Date.now()}-${++sessionCounter}`;
    // Keyed by entry id rather than position: a claimed entry sits wherever
    // the earlier session left it, so ids say nothing about order.
    private snapshots = new Map<number, Snapshot>();
    private nextId = 0;
    private currentId = 0;

    constructor(
        private readonly screenKeyOf: (snapshot: Snapshot) => string,
        private readonly onRestore: (snapshot: Snapshot) => void,
    ) {}

    // Tags the current history entry as the first screen. This replaces the
    // entry rather than pushing a new one, so it adds nothing to Back.
    start(initial: Snapshot): void {
        this.snapshots.clear();
        this.addEntry('replace', initial);
        window.addEventListener('popstate', this.handlePopState);
    }

    stop(): void {
        window.removeEventListener('popstate', this.handlePopState);
    }

    // Call after every state change. A change of screen adds a history entry;
    // anything else updates the current entry's snapshot, so going Back later
    // restores the screen as the user left it.
    record(snapshot: Snapshot): void {
        const current = this.snapshots.get(this.currentId);

        if (current === undefined || this.screenKeyOf(current) === this.screenKeyOf(snapshot)) {
            this.snapshots.set(this.currentId, snapshot);
            return;
        }

        this.addEntry('push', snapshot);
    }

    private handlePopState = (event: PopStateEvent): void => {
        const tag: unknown = event.state?.[HISTORY_STATE_KEY];
        const ownTag = isScreenEntryTag(tag) && tag.session === this.session ? tag : null;
        const snapshot = ownTag === null ? undefined : this.snapshots.get(ownTag.id);

        if (ownTag === null || snapshot === undefined) {
            this.claimEntry();
            return;
        }

        // Set before onRestore so the record() call from the resulting
        // re-render sees the restored screen as current and adds no entry.
        this.currentId = ownTag.id;
        this.onRestore(snapshot);
    };

    // The browser is on an entry from another session, and the screen hasn't
    // changed. Tag the entry with that screen, so that Back from a screen
    // opened next returns here instead of landing on an entry it can't use.
    private claimEntry(): void {
        const showing = this.snapshots.get(this.currentId);

        if (showing !== undefined) {
            this.addEntry('replace', showing);
        }
    }

    // Spreads the existing history.state so React Router's own fields
    // ({ usr, key, idx }) survive on every entry this class writes.
    private addEntry(mode: 'push' | 'replace', snapshot: Snapshot): void {
        const id = this.nextId++;
        this.snapshots.set(id, snapshot);
        this.currentId = id;

        const tag: ScreenEntryTag = { session: this.session, id };
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
        && typeof (value as ScreenEntryTag).id === 'number';
}

export default ScreenHistory;
