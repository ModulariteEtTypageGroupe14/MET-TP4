"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListeVide = /** @class */ (function () {
    function ListeVide() {
    }
    ListeVide.prototype.filtrage = function (casVide, casCons) {
        return casVide();
    };
    return ListeVide;
}());
var ListeCons = /** @class */ (function () {
    function ListeCons(tete, reste) {
        this.tete = tete;
        this.reste = reste;
    }
    ListeCons.prototype.filtrage = function (casVide, casCons) {
        return casCons(this.tete, this.reste);
    };
    return ListeCons;
}());
var ModuleFileParListe = /** @class */ (function () {
    function ModuleFileParListe() {
    }
    ModuleFileParListe.prototype.estVide = function (f) {
        return f.filtrage(function () { return true; }, function (t, r) { return false; });
    };
    ModuleFileParListe.prototype.retrait = function (f) {
        if (this.estVide(f)) {
            return couple(null, new ListeVide());
        }
        else {
            return f.filtrage(function () { return couple(null, vide()); }, function (t, r) { return couple(t, r); });
        }
    };
    ModuleFileParListe.prototype.vide = function () {
        return new ListeVide();
    };
    ModuleFileParListe.prototype.ajout = function (e, f) {
        var _this = this;
        return f.filtrage(function () { return cons(e, new ListeVide()); }, function (t, r) {
            return cons(t, _this.ajout(e, r));
        });
    };
    return ModuleFileParListe;
}());
var ModuleFileParDeuxListes = /** @class */ (function () {
    function ModuleFileParDeuxListes() {
    }
    ModuleFileParDeuxListes.prototype.ajout = function (e, f) {
        return [f[0].filtrage(function () { return new ListeCons(e, new ListeVide()); }, function (t, r) { return new ListeCons(e, new ListeCons(t, r)); }), f[1]];
    };
    ModuleFileParDeuxListes.prototype.estVide = function (f) {
        return f[0].filtrage(function () { return true; }, function (t, r) { return false; }) && f[1].filtrage(function () { return true; }, function (t, r) { return false; });
    };
    ModuleFileParDeuxListes.prototype.retrait = function (f) {
        if (f[1] instanceof ListeVide) {
            return this.retrait(couple(f[1], miroir(f[0])));
        }
        else {
            return couple(f[1].filtrage(function () { return null; }, function (t, r) { return t; }), couple(f[0], f[1].filtrage(function () { return new ListeVide(); }, function (t, r) { return r; })));
        }
    };
    ModuleFileParDeuxListes.prototype.vide = function () {
        return couple(new ListeVide(), new ListeVide());
    };
    return ModuleFileParDeuxListes;
}());
var ModuleFileAbstrait = /** @class */ (function () {
    function ModuleFileAbstrait() {
    }
    return ModuleFileAbstrait;
}());
function vide() {
    return new ListeVide();
}
function cons(tete, reste) {
    return new ListeCons(tete, reste);
}
function couple(x, y) {
    return [x, y];
}
function miroir(liste) {
    if (liste[0] === null || liste[1] === null) {
        return;
    }
    var revList = vide();
    while (!(liste instanceof ListeVide)) {
        revList = liste.filtrage(function () { return revList; }, function (t, r) { return cons(t, revList); });
        liste = liste.filtrage(function () { return vide(); }, function (t, r) { return r; });
    }
    return revList;
}
// Fabrique
function abstraction(m) {
    return m;
}
exports.abstraction = abstraction;
function representation(m, f) {
    var result = [];
    while (!m.estVide(f)) {
        var l_1 = m.retrait(f);
        result.push(String(l_1[0]));
        f = l_1[1];
    }
    return result.join(";");
}
var listeReverse = new ListeCons("P", new ListeCons("S", new ListeCons("G", new ListeVide())));
console.log("*************** LISTE AVANT REVERSE ***************");
console.log(listeReverse);
console.log("*************** LISTE APRES REVERSE ***************");
console.log(miroir(listeReverse));
console.log("*************** LISTE AVANT AJOUT ***************");
var listeNonReverse = new ListeCons("P", new ListeCons("S", new ListeCons("G", new ListeVide())));
console.log(listeNonReverse);
var moduleFileParListe = new ModuleFileParListe();
console.log("*************** LISTE APRES AJOUT ***************");
console.log(moduleFileParListe.ajout("O", listeNonReverse));
console.log("*************** LISTE APRES RETRAIT ***************");
console.log(moduleFileParListe.retrait(listeReverse));
var l1 = new ListeCons("a", new ListeCons("b", new ListeCons("c", new ListeVide())));
var l2 = new ListeCons("d", new ListeCons("e", new ListeCons("f", new ListeVide())));
var mfp2l = new ModuleFileParDeuxListes();
console.log("*************** DOUBLE LISTE APRES AJOUT ***************");
console.log(mfp2l.ajout("0", [l1, l2]));
console.log("*************** DOUBLE LISTE APRES RETRAIT ***************");
console.log(mfp2l.retrait([l1, l2]));
console.log("*************** MODULE ABSTRACTION REPRESENTER ***************");
var moduleAbstraction = abstraction(new ModuleFileParListe());
var l = moduleAbstraction.vide();
l = moduleAbstraction.ajout(3, l);
l = moduleAbstraction.ajout(4, l);
l = moduleAbstraction.ajout(5, l);
console.log(representation(moduleAbstraction, l));
console.log("*************** MODULE ABSTRACTION RETRAIT ***************");
var elementRetirer = moduleAbstraction.retrait(moduleAbstraction);
//# sourceMappingURL=Files.js.map