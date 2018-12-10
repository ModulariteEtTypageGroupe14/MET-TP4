interface ModuleFile<F, E> {
    vide(): F;
    ajout(e: E, f: F): F;
    retrait(f: F): [E, F];
    estVide(f: F): boolean;
}

interface Liste<E> {
    filtrage<R>(casVide: () => R, casCons: (t: E, r: Liste<E>) => R): R;
}

class ListeVide<E> implements Liste<E> {
    filtrage<R>(casVide: () => R, casCons: (t: E, r: Liste<E>) => R) {
        return casVide();
    }
}

class ListeCons<E> implements Liste<E> {
    constructor(private tete: E, private reste: Liste<E>) {
    }
    filtrage<R>(casVide: () => R, casCons: (t: E, r: Liste<E>) => R) {
        return casCons(this.tete, this.reste);
    }
}

class ModuleFileParListe<E> implements ModuleFile<Liste<E>, E> {

    estVide(f: Liste<E>): boolean {
        return f.filtrage(()=>true, (t:E, r:Liste<E>)=>false);
    }

    retrait(f: Liste<E>): [E, Liste<E>] {
        if (this.estVide(f)){
            return couple(null, new ListeVide<E>());
        }
        else {
            return f.filtrage<[E, Liste<E>]>(() => couple(null, vide()),(t,r) => couple(t, r));
        }
    }

    vide(): Liste<E> {
        return new ListeVide<E>();
    }

    ajout(e: E, f: Liste<E>): Liste<E> {
        return f.filtrage<Liste<E>>(() => cons(e, new ListeVide()),(t,r) => {
            if (r instanceof ListeVide) {
                return cons(e, r);
            } else {
                return cons(t, this.ajout(e, r));
            }
        })
    }

}

class ModuleFileParDeuxListes<E> implements ModuleFile<[Liste<E>, Liste<E>], E> {

    ajout(e: E, f: [Liste<E>, Liste<E>]): [Liste<E>, Liste<E>] {
        return [f[0].filtrage(()=>new ListeCons(e, new ListeVide()), (t:E, r:Liste<E>)=> new ListeCons(e, new ListeCons(t, r))), f[1]];
    }

    estVide(f: [Liste<E>, Liste<E>]): boolean {
        return f[0].filtrage(()=>true, (t:E, r:Liste<E>)=>false) && f[1].filtrage(()=>true, (t:E, r:Liste<E>)=>false);
    }

    retrait(f: [Liste<E>, Liste<E>]): [E, [Liste<E>, Liste<E>]] {
        if(f[1] instanceof ListeVide){
            return this.retrait(couple(f[1], miroir(f[0])));
        } else {
            return couple(f[1].filtrage<E>(() => null,(t,r) => t), couple(f[0], f[1].filtrage<Liste<E>>(() => new ListeVide<E>(),(t,r) => r)));
        }
    }

    vide(): [Liste<E>, Liste<E>] {
        return couple(new ListeVide<E>(), new ListeVide<E>());
    }

}
class ModuleFileAbstrait<E> implements ModuleFile<any, E> {

    constructor(private liste: ModuleFile<any, E>) {
    }
    elimination<R>(k: (t: ModuleFile<any, E>) => R): R {
        return k(this.liste);
    }

    ajout(e: E, f: any): any {
        return undefined;
    }

    estVide(f: any): boolean {
            return f.filtrage(()=>true, (t:E, r:Liste<E>)=>false);
    }

    retrait(f: any): [E, any] {
        return [undefined, undefined];
    }

    vide(): any {
        return new ListeVide();
    }

}
function vide<E>(): Liste<E> {
    return new ListeVide();
}

function cons<E>(tete: E, reste: Liste<E>): Liste<E> {
    return new ListeCons(tete, reste);
}

function couple<A, B>(x: A, y: B): [A, B] {
    return [x, y];
}

function miroir<E>(liste : Liste<E>) : Liste<E> {

    if (liste[0] === null || liste[1] === null) {
        return;
    }

    let revList : Liste<E> = vide() ;

    while(!(liste instanceof ListeVide)) {
        revList = liste.filtrage(() => revList, (t: E, r: Liste<E>) => cons(t, revList));
        liste = liste.filtrage(() => vide(), (t: E, r: Liste<E>) => r);
    }
    return revList ;
}

// Fabrique
function abstraction<F, E>(m: ModuleFile<F, E>): ModuleFileAbstrait<E> {
    return new ModuleFileAbstrait(m);
}


function representation<M, E>(m: ModuleFile<M, E>, f: M): string {
    return abstraction(m).elimination(() => {
        let listPrint = [];
        while(!m.estVide(f)){
            listPrint.push(String(m.retrait(f)[0]));
        }
        return listPrint.join(";");
    });
}

let listeReverse : Liste<string> = new ListeCons("P", new ListeCons("S", new ListeCons("G", new ListeVide()))) ;
console.log("*************** LISTE AVANT REVERSE ***************") ;
console.log(listeReverse);
console.log("*************** LISTE APRES REVERSE ***************") ;
console.log(miroir(listeReverse));

console.log("*************** LISTE AVANT AJOUT ***************") ;
let listeNonReverse : Liste<String> = new ListeCons("P", new ListeCons("S", new ListeCons("G", new ListeVide()))) ;
console.log(listeNonReverse);
let moduleFileParListe = new ModuleFileParListe<String>();
console.log("*************** LISTE APRES AJOUT ***************") ;
console.log(moduleFileParListe.ajout("O", listeNonReverse));

console.log("*************** LISTE APRES RETRAIT ***************") ;
console.log(moduleFileParListe.retrait(listeReverse));

let l1 : Liste<string> = new ListeCons("a", new ListeCons("b", new ListeCons("c", new ListeVide()))) ;
let l2 : Liste<string> = new ListeCons("d", new ListeCons("e", new ListeCons("f", new ListeVide()))) ;
let mfp2l = new ModuleFileParDeuxListes<string>() ;
console.log("*************** DOUBLE LISTE APRES AJOUT ***************") ;
console.log(mfp2l.ajout("0", [l1,l2])) ;
console.log("*************** DOUBLE LISTE APRES RETRAIT ***************") ;
console.log(mfp2l.retrait([l1,l2])) ;


console.log("*************** MODULE ABSTRACTION ***************") ;

let module = abstraction(new ModuleFileParListe<number>());
let liste = module.elimination((m) => {
    m.vide();
});
liste = module.elimination((m) => {
    m.ajout(3, liste);
});
liste = module.elimination((m) => {
    m.ajout(4, liste);
});
liste = module.elimination((m) => {
    m.ajout(5, liste);
});

console.log(representation(module.elimination((k) => k), liste));
let o = module.elimination((m) => {
   // m.retrait(liste);
});

console.log(o[0]);

console.log(representation(module.elimination((k) => k), o[1]));
