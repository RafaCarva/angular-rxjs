import { Component, OnInit } from '@angular/core';
import { Observable, Observer, from, of, interval, timer, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-basic-creation',
  templateUrl: './basic-creation.component.html',
  styleUrls: ['./basic-creation.component.css']
})
export class BasicCreationComponent implements OnInit {

  subscription: Subscription = new Subscription();

  constructor() { }

  ngOnInit() {
  }

  observableCreate() {
    const hello = Observable.create( (observer: Observer<string>) => {
        observer.next('Hello');
        observer.next('from');
        observer.next('observable');
        observer.complete();
      }
    );
    hello.subscribe(val => console.log(val));
  }

  fromClick() {
    from([1, 2, 3, 4, 5, {x: 10, y: 20}])
      .subscribe( (v) => console.log(v) );

    // Outra forma:
    const mySource = from([1, 2, 3, 4, 5, {x: 10, y: 20}]);
    // mySource.subscribe( (v) => console.error(v) );
    mySource.subscribe( (v) => console.warn(v) );
  }

  // O of vai imprimir tudo de uma vez (o from passa de 1 em 1)
  ofClick() {
    of([1, 2, 3, 4, 5, {x: 10, y: 20}])
      .subscribe( (v) => console.log(v) );
  }

  intervalClick() {
    const source = interval(1000);
    // source.subscribe((v) => console.log(v)); // 1º maneira de dar um subscribe.

    const localSubscription = source.subscribe((v) => console.log(v)); // 2º Maneira.
    this.subscription.add(localSubscription);
  }

  timerClick() {
    // const source = timer(1000); // Executa 1 vez depois de 1000 ms.
    const source = timer(3000, 1000); // Depois de 3s executa de 1s em 1s. .
    // source.subscribe( (v) => console.log(v) );// 1º maneira de dar um subscribe.

    const localSubscription = source.subscribe((v) => console.log(v)); // 2º Maneira.
    this.subscription.add(localSubscription);
  }

  fromEventClick() {
    // document seria o documento inteiro, ele espera apenas um elemento nativo.
    // Pode ser feito com o esquema de @viewChild (veja no outro projeto)
    const mySubscription = fromEvent(document, 'click').subscribe( e => console.log(e) );
    this.subscription.add(mySubscription);
  }

  unsubscribeClick() {
    console.log('Unscribe all sub.');
    this.subscription.unsubscribe(); // Vai desinscrever todos que foram add na var (vai 'matar' a var)
    this.subscription = new Subscription(); // Aqui se instancia outra caso querira dar um subscribe novamente.
  }


}
