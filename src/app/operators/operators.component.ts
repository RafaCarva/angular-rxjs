import { Component, OnInit, ViewChild } from '@angular/core';
import { interval, Observable, Subscription, observable, from, fromEvent, Subject, timer } from 'rxjs';
import { map, delay, filter, tap, take, first, debounceTime, takeWhile, takeUntil } from 'rxjs/operators';
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  @ViewChild(MatRipple, {static: true}) ripple: MatRipple;
  searchInput: string = '';

  constructor() { }

  ngOnInit() {
  }

  mapClick() {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        map(i => i * 2),
        map(i => i * 10),
        delay(1000)
      )
      .subscribe(i => console.log(i));

    fromEvent(document, 'click')
        .pipe(
          map((e: MouseEvent) => ({x: e.screenX, y: e.screenY}))
        )
        .subscribe((pos) => console.log(pos));
  }

  filterClick() {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        filter(i => i % 2 === 1)
      )
      .subscribe(i => console.log(i));
    interval(1000)
        .pipe(
          filter(i => i % 2 === 0),
          map(i => 'value: ' + i),
          delay(1000))
      .subscribe(i => console.log(i));
  }

  // O tap não vai alterar o resultado (como o map pode fazer).
  // O tap serve mais para 'logar' o valor.
  tapClick() {
    interval(1000)
        .pipe(
          tap(i => console.log('')),
          tap(i => console.log('Before filtering: ', i)),
          filter(i => i % 2 === 0),
          tap(i => console.log('After filtering: ', i)),
          map(i => 'value: ' + i),
          tap(i => console.log('After map: ', i)),
          delay(1000))
      .subscribe(i => console.log(i));
  }

  // O take, fisrt e last vão dar um unscrible automaticamente.
  takeClick() {
    const myOservable = new Observable((myOservable) => {
      let i;
      for (i = 0; i < 20; i++){
        setTimeout(() => myOservable.next(Math.floor(Math.random() * 100)), i * 100);
        // setTimeout(() => myOservable.complete(), i * 100);
      }
    });

    const s: Subscription = myOservable
      .pipe(
        tap(i => console.log(i)),
         take(10)
        // first()
        // last()
      )
      .subscribe(
        v => console.log('Output: ', v),
        (error) => console.error(error),
        () => console.log('Complete!')
      );

    const interv = setInterval( () => {
        console.log('Checking...');
        if (s.closed) {
          console.warn('Subscription CLOSED!');
          clearInterval(interv);
        }
      }, 200);
  }

  launchRipple() {
    const rippleRef = this.ripple.launch({
      persistent: true, centered: true});
    rippleRef.fadeOut();
  }

  // O tempo do debounce seria uma "pausa" na chamada de evento
  // ele chama o envento que estiver fora do tempo setado.
  // Seria útil como um sgestor em um input.
  debounceTimeClick() {
    fromEvent(document, 'click')
      .pipe(
        tap((e) => console.log('Click')), // O tap printa todos os clicks na tela
        debounceTime(500)                 // Mas o debounce só "deixa passar" quem estiver fora do intervalo de 500ms entre um clique e outro.
      )
      .subscribe(
        (e: MouseEvent) => {
          console.log('Click with debounceTime: ', e);
          this.launchRipple();
        }
      );
  }

  // o '$' no fim do nome da var vai indicar que se trata de um subject ou observable.
  searchEntry$: Subject<string> = new Subject<string>();

  searchBy_UsingDebounde(event) {
    // searchInput é a var bindada com o input da view.
    this.searchEntry$.next(this.searchInput);
  }

  debounceTimeSearch() {
    this.searchEntry$
      .pipe(debounceTime(500)) //só chama a função que trata o subscribe depois de 'x' tempo do último input.
      .subscribe((s) => console.log(s));
  }

  takeWhileClick() {
    interval(500)
    .pipe( takeWhile((value, index) => (value < 5)) ) // 5é o index do evento. O retorno é um boolean
    .subscribe(
      (i) => console.log('take while: ', i),
      (error) => console.error(error),
      () => console.log('Completed')
    );
  }

  takeUntilClick() {

    let dueTimes = timer(5000);

    interval(500)
    .pipe( takeUntil(dueTimes) )
    .subscribe(
      (i) => console.log('take while: ', i),
      (error) => console.error(error),
      () => console.log('Completed')
    );
  }
}
