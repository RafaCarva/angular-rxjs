import { Observable, observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { map, toArray, delay } from 'rxjs/operators';

interface User {
  login: string;
  name: string;
}

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.css']
})
export class AsyncComponent implements OnInit {

  options$: Observable<string[]>;
  user$: Observable<User>;

  constructor() { }

  ngOnInit() {
    this.options$ = Observable.create(
      (observer) => {
        for (let i = 0; i < 10; i++) {
          observer.next(`This is my ${i} th option.`);
        }
        observer.complete();
      }
    )
    .pipe(
      map(s => s + '!'),
      toArray(),
      delay(1000)
    );

    // Para testar o options$ descomente aqui:
    // this.options$.subscribe(s => console.log(s));

    this.user$ = new Observable<User>((observer) => {
      let names = ['Sr Pedro', 'Sr joão', 'Sr Camilo', 'Sr Joano'];
      let logins = ['Pedro', 'joão', 'Camilo', 'Joano'];

      let i = 0;
      setInterval(() => {
        if (i === 4) {
          observer.complete();
        }
        else {
          observer.next({login: logins[i], name: names[i]});
        }
        i++;
      }, 3000);
    })
    // O async da view dá um subscribe automaticamente.
    // this.user$.subscribe(s => console.log(s));
  }
}
