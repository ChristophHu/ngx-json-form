import { Observable } from "rxjs"

export function convertArray(arr: any[], col: string, dep?: string, sort: boolean = true): any {
    if (arr) {
        let cleared: { label: string, value: string, dep: string }[] = []
        arr.forEach(el => {
            cleared.push({ label: el[col], value: el.id, dep: dep ? el[dep] : '' })
        })
        if (sort) {
            cleared = cleared.sort((obj1, obj2) => {
                if (obj1.label > obj2.label) return 1
                if (obj1.label < obj2.label) return -1
                return 0
            })
        }
        // console.log('convertArray', col, cleared)
        return cleared
    }
}

export function convertDependingArray(arr$: Observable<any>, col: string, dep: string, sort: boolean = true): Observable<any> {
    return new Observable((observer) => {
        arr$.subscribe({
            next: (arr) => {
                if (arr) {
                    // console.log(convertArray(arr, col, dep, sort))
                    observer.next(convertArray(arr, col, dep, sort))
                }
            },
            error(err) {
                observer.error(err)
            },
        })
    })
}

// export function mergeArraysByProperties(arr1: any[], arr2: any[], prop1: string, prop2: string): any {
//     return arr1.map((item1) => ({
//         ...arr2.find((item2) => item1[prop1] === item2[prop2] && item2),
//         ...item1,
//     }))
// }

// function dependedArray(arr: any[], col: string, dep: string, sort: boolean = true): any {
//     if (arr) {
//         let cleared: { label: string, value: string, dep: string }[] = []
//         arr.forEach(el => {
//             cleared.push({ label: el[col], value: el.id, dep: el[dep] })
//         })
//         if (sort) {
//             cleared = cleared.sort((obj1, obj2) => {
//                 if (obj1.label > obj2.label) return 1
//                 if (obj1.label < obj2.label) return -1
//                 return 0
//             })
//         }
//         return cleared
//     }
// }

export function flatten(obj: any = {}): any {
    return Object.keys(obj || {}).reduce((acc: any, cur) => {
        if (typeof obj[cur] === 'object') {
            let a: any = flatten(obj[cur])
            acc = { ...acc, ...a}
        } else { 
            acc[cur] = obj[cur] 
        }
        return acc
    }, {})
}

export function getLocalISO(val: string = ''): string {
    let date: Date | string
    switch(val) {
    case 'lastyear':
        date = new Date(lastyear() - timezoneoffset())
        break

    case 'year':
        date = new Date(year() - timezoneoffset())
        break

    case 'lastmonth':
        date = new Date(lastmonth() - timezoneoffset())
        break

    case 'month':
        date = new Date(month() - timezoneoffset())
        break

    case 'lastweek':
        date = new Date(lastweek() - timezoneoffset())
        break

    case 'week':
        date = new Date(week() - timezoneoffset())
        break

    case 'yesterday':
        date = new Date(yesterday() - timezoneoffset())
        break

    case 'today':
        date = new Date(today() - timezoneoffset())
        break

    case 'tomorrow':
        date = new Date(tomorrow() - timezoneoffset())
        break

    case 'now':
        date = new Date(now() - timezoneoffset())
        break

    default:
        date = new Date()
    }
    const result: string = date.toISOString().slice(0, -5).replace('T', ' ')

    return result
}

export function timezoneoffset(): any {
    return new Date().getTimezoneOffset() * 60000
}
function lastyear(): any {
    return new Date(new Date().getFullYear()-1, 0, 1)
}
function year(): any {
    return new Date(new Date().getFullYear(), 0, 1)
}
function lastmonth(): any {
    return new Date(new Date().getFullYear(), new Date().getMonth()-1, 1)
}
function month(): any {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
}
function lastweek(): any {
    // Sunday - Saturday : 0 - 6
    let d = new Date()
    const diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1) - 7
    d.setDate(diff)
    d.setHours(0,0,0,0)
    return d
}
function week(): any {
    // Sunday - Saturday : 0 - 6
    let d = new Date()
    const diff = d.getDate() - d.getDay() + (d.getDay() == 0 ? -6:1)
    d.setDate(diff)
    d.setHours(0,0,0,0)
    return d
}
function yesterday(): number {
    return new Date().setHours(-24,0,0,0)
}
function today(): number {
    return new Date().setHours(0,0,0,0)
}
function now(): number {
    return new Date().getTime()
}
function tomorrow(): number {
    return new Date().setHours(24,0,0,0)
}