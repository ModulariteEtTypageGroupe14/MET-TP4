// Variance ? Contravariance
interface Liste1<T> {
    tete(): T;
    reste(): Liste1<T>;
}
// Variance ? Covariance
interface Liste2<T> {
    tete(): T;
    reste(): Liste2<T>;
    cons(t: T): Liste2<T>; // fabrique
}
// Variance ? Bivariance
interface Liste3<T> {
    setTete(t: T): void
    reste(): Liste3<T>;
}
// Variance ? Covariance
interface Liste4<T> {
    tete(): T;
    setTete(t: T): void
    reste(): Liste4<T>;
    cons(t: T): Liste4<T>;
}

class A { }
class B extends A {
    f(): void { }
}

function covariance1(l: Liste1<B>): Liste1<A> {
    return l;
}

function covariance2(l: Liste2<B>): Liste2<A> {
    return l;
}

function covariance3(l: Liste3<B>): Liste3<A> {
    return l;
}
function contravariance3(l: Liste3<A>): Liste3<B> {
    return l;
}

function covariance4(l: Liste4<B>): Liste4<A> {
    return l;
}
