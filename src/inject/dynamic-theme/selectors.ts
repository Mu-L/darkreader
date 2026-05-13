const emptyPseudoClasses = [':before', ':after', ':empty'];

export const filterSelectors = {
    invert: new Set<string>(),
    dim: new Set<string>(),
    light: new Set<string>(),
};

export function addFilterSelector(selector: string, type: keyof typeof filterSelectors) {
    if (!selector) {
        return;
    }
    const selectors = filterSelectors[type];
    let changed = false;
    selector.split(',').forEach((part) => {
        const s = part.trim();
        if (!s) {
            return;
        }
        for (const existing of selectors) {
            if (isSelectorWithin(s, existing)) {
                return;
            }
        }
        for (const existing of [...selectors]) {
            if (isSelectorWithin(existing, s)) {
                selectors.delete(existing);
            }
        }
        selectors.add(s);
        changed = true;
    });
    return changed;
}

export function makeSelectorEmpty(selector: string) {
    selector = selector.trim();
    if (emptyPseudoClasses.some((pseudo) => selector.endsWith(pseudo))) {
        return selector;
    }
    return `${selector}:empty`;
}

export function isSelectorWithin(sub: string, parent: string): boolean {
    if (sub === parent) {
        return true;
    }
    if (!sub.startsWith(parent)) {
        return false;
    }
    const rest = sub.slice(parent.length);
    if (rest[0] === '.' || rest[0] === ':' || rest[0] === '#' || rest[0] === '[') {
        return true;
    }
    const trimmed = rest.trim();
    if (trimmed[0] === '+' || trimmed[0] === '~') {
        return false;
    }
    if (trimmed[0] === '>') {
        return true;
    }
    return rest.length !== trimmed.length;
}

export function cleanFilterSelectors() {
    filterSelectors.invert.clear();
    filterSelectors.dim.clear();
    filterSelectors.light.clear();
}
