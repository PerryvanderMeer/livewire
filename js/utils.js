
export function debounce(func, wait, immediate) {
    var timeout

    return function () {
        var context = this,
            args = arguments
        var later = function () {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

export function dataGet(object, key) {
    return key.split('.').reduce((carry, i) => {
        if (carry === undefined) return undefined

        return carry[i]
    }, object)
}

export function dataSet(object, key, value) {
    let segments = key.split('.')

    if (segments.length === 1) {
        return object[key] = value
    }

    let firstSegment = segments.shift()
    let restOfSegments = segments.join('.')

    if (object[firstSegment] === undefined) {
        object[firstSegment] = {}
    }

    dataSet(object[firstSegment], restOfSegments, value)
}

export function decorate(object, decorator) {
    return new Proxy(object, {
        get(target, property) {
            if (property in decorator) {
                return decorator[property]
            } else if (property in target) {
                return target[property]
            } else if ('__get' in decorator && ! ['then'].includes(property)) {
                return decorator.__get(property)
            }
        },

        set(target, property, value) {
            if (property in decorator) {
                decorator[property] = value
            } else if (property in target) {
                target[property] = value
            } else if ('__set' in decorator && ! ['then'].includes(property)) {
                decorator.__set(property, value)
            }
        },
    })
}

export function tap(thing, callback) {
    callback(thing)

    return thing
}

export class Bag {
    constructor() { this.arrays = {} }

    add(key, value) {
        if (! this.arrays[key]) this.arrays[key] = []
        this.arrays[key].push(value)
    }

    get(key) { return this.arrays[key] || [] }

    each(key, callback) { return this.get(key).forEach(callback) }
}
