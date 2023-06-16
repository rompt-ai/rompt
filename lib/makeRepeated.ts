type WithIndex<T> = T & { index: number }

// Function overloads
export function makeRepeated<T>(arr: T[], repeats: number, includeIndex: true): WithIndex<T>[]
export function makeRepeated<T>(arr: T[], repeats: number, includeIndex: false): T[]
export function makeRepeated<T>(arr: T[], repeats: number, includeIndex: boolean): (T | WithIndex<T>)[]

// Function implementation
export function makeRepeated<T>(arr: T[], repeats: number, includeIndex: boolean): (T | WithIndex<T>)[] {
    if (includeIndex) {
        return Array.from({ length: repeats }, (_, k) => arr.map((ele) => ({ ...ele, index: k }))).flat()
    } else {
        return Array.from({ length: repeats }, () => arr).flat()
    }
}
