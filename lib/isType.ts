export function isType<T extends G, const G = {}>(value: G, is: boolean): value is T {
    return is
}
