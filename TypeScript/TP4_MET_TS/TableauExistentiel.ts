class TableauExistentiel<M> {
    constructor(private tab: Array<M>) {
    }
    elimination<R>(k: <T extends M>(t: Array<T>) => R): R {
        return k(this.tab);
    }
}

function representer(tableauExistentiel : TableauExistentiel<any>) : string {
    return tableauExistentiel.elimination
    ((arrayTest) => {
        let result = [];
        for (let i = 0 ; i < arrayTest.length; i++) {
            result.push(String(arrayTest[i]));
        }
        return result.join(";");
    });
}

let arrayArep = [];
arrayArep.push("1");
arrayArep.push(2);
arrayArep.push("a");
console.log(representer(new TableauExistentiel<any>(arrayArep)))
