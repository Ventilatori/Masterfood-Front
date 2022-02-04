import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class NotificationService {

  constructor(
    private snackbar: MatSnackBar
  ) { }

  notify(msg: string, type: string = '', duration: number = 3000) {
    const classes = ['notification']
    if(type && type != '') {
      classes.push(type)
    }
    this.snackbar.open(msg, '', {
      duration: duration,
      panelClass: classes
    })
  }
}
