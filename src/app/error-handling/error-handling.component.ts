import { Component, OnInit } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, tap, catchError, retry, retryWhen, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.css']
})
export class ErrorHandlingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  startTest() {
    let obj: Observable<any> = new Observable((observer) => {
      for (let i = 0; i < 10; i++) {
        if (i === 7) {
          observer.error(`An error occurred when i = ${i}`);
        } else {
          observer.next(i);
        }
      }
    });
    obj
      .pipe(
        map( i => i * 10),
        tap( i => console.log(`Before error handling: ${i}`)),
        catchError(error => {
          console.error('inside catch error: ', error);
          // return of(0);  // "No lugar do erro, retorne 0"
          return throwError('throwError: Error');
        }),
        // retry(2), // Vai tentar 2x mas o error só vai ser retornado da 2º vez.
        retryWhen(i => timer(5000))
      )
      /*
      .subscribe(
        (i) => console.log(`Normal output: ${i}`),
        (err) => console.error(err),
        () => console.log(`Completed!`)
      )*/;

    let obj2: Observable<any> = new Observable((observer) => {
      timer(2000).subscribe((n) => observer.next('retorno obj2'));
      timer(2500).subscribe((n) => observer.complete());
    });
    obj2
      .pipe(
        timeout(2001) // se não acontecer nada em 2001 ms, printa o erro.
      )
      .subscribe(
      (i) => console.log(`N: ${i}`),
      (err) => console.error(err),
      () => console.log(`Obj2 completed!`)
    )
  }

}
