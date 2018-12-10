var TableauExistentiel = /** @class */ (function () {
    function TableauExistentiel(tab) {
        this.tab = tab;
    }
    TableauExistentiel.prototype.elimination = function (k) {
        return k(this.tab);
    };
    return TableauExistentiel;
}());
function representer(tableauExistentiel) {
    return tableauExistentiel.elimination(function (arrayTest) {
        var result = [];
        for (var i = 0; i < arrayTest.length; i++) {
            result.push(String(arrayTest[i]));
        }
        return result.join(";");
    });
}
var arrayArep = [];
arrayArep.push("1");
arrayArep.push(2);
arrayArep.push("a");
console.log(representer(new TableauExistentiel(arrayArep)));
