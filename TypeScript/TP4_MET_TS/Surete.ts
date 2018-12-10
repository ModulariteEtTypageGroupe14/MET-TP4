namespace variance {
    class A { }

    class B extends A {
        f(): void { }
    }

    function produireErreurParCovariance(): void {
        let b: B[] = [];
        let a: A[] = b;
        a[0] = new A();
        b[0].f();
    }

    function produireErreurParContravariance(): void {
        let a: A[] = [];
        let b: B[] = <Array<B>>a;
        a[0] = new A();
        b[0].f();
    }

    try {
        produireErreurParContravariance();
    } catch (e) {
        console.log(e);
    }
    console.log("********************************************************");
    try {
        produireErreurParCovariance();
    } catch (e) {
        console.log(e);
    }

}