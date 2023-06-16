/**
 * @license
 * This code is licensed under the terms of the MIT license
 *
 * Copyright (c) 2022 Marco Antonio Anastacio Cintra <anastaciocintra@gmail.com>
 * and contributors:
 * "@bayerlse" - Sebastian Bayerl
 * "@jrson83" -
 * "@bsor-dev"
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Compare two data objects / arrays in typescript.
 *
 * @author Marco Antonio Anastacio Cintra
 * @link https://gist.github.com/anastaciocintra/6a9bf013d8bd940f857d5c9ad08990e1
 * @param {any} obj1 the first object.
 * @param {any} obj2 the second object.
 * @param {boolean} checkDataOrder determine if order  data is relevant on comparison
 *
 * @returns {boolean} return true if obj1 and obj2 have the same data
 *
 * @example
 *
 * expected results:
 * { a: 1, b: 2 } === { a: 1, b: 2 }
 * { a: 1, b: 2 } === { b: 2, a: 1 }
 * { a: 1, b: 3 } !== { b: 2, a: 1 }
 * [1, 2] === [1, 2]
 * [2, 1] === [1, 2]
 * [1, 3] !== [1, 2]
 *
 * but with checkDataOrder = true, the results are different for arrays:
 * [1, 2] === [1, 2] // same result as without checkDataOrder
 * [2, 1] !== [1, 2] // different order
 * [1, 3] !== [1, 2] // same result as without checkDataOrder
 *
 */
export const isEqual = (obj1: any, obj2: any, checkDataOrder: boolean = false): boolean => {
    const checkDataOrderParanoic = false
    if (obj1 === null || obj2 === null) {
        return obj1 === obj2
    }
    let _obj1 = obj1
    let _obj2 = obj2
    if (!checkDataOrder) {
        if (obj1 instanceof Array) {
            _obj1 = [...obj1].sort()
        }
        if (obj2 instanceof Array) {
            _obj2 = [...obj2].sort()
        }
    }
    if (typeof _obj1 !== "object" || typeof _obj2 !== "object") {
        return _obj1 === _obj2
    }

    const obj1Props = Object.getOwnPropertyNames(_obj1)
    const obj2Props = Object.getOwnPropertyNames(_obj2)
    if (obj1Props.length !== obj2Props.length) {
        return false
    }

    if (checkDataOrderParanoic && checkDataOrder) {
        // whill result in {a:1, b:2} !== {b:2, a:1}
        // its not normal, but if you want this behavior, set checkDataOrderParanoic = true
        const propOrder = obj1Props.toString() === obj2Props.toString()
        if (!propOrder) {
            return false
        }
    }

    for (const prop of obj1Props) {
        const val1 = _obj1[prop]
        const val2 = _obj2[prop]

        if (typeof val1 === "object" && typeof val2 === "object") {
            if (isEqual(val1, val2, checkDataOrder)) {
                continue
            } else {
                return false
            }
        }
        if (val1 !== val2) {
            return false
        }
    }
    return true
}
