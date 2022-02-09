import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {NotificationService} from 'src/app/common/notification.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialog implements OnInit {
  authForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  hide = true
  waitForConfirmation = false

  constructor(
    private dialogRef: MatDialogRef<AuthDialog>,
    private authService: AuthService,
    private notificationService: NotificationService,
    // @Inject(MAT_DIALOG_DATA) public data: AuthType,
  ) {
  }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close()
  }

  onSubmit() {
    const username = this.authForm.value.username
    const password = this.authForm.value.password
    this.authService.login(username, password).subscribe({
      next: _ => {
        this.dialogRef.close()
        this.notificationService.notify('Logged in successfully!', 'success')
      },
      error: err => this.notificationService.notify('Failed to authenticate: ' + err, 'danger')
    })
  }

  getNameErrorMessage(): string {
    const username = this.authForm.get('username')
    if(username) {
      if (username.hasError('required')) {
        return 'You must enter a value'
      }
    }
    return ''
  }

  getEmailErrorMessage(): string {
    const email = this.authForm.get('email')
    if(email) {
      if (email.hasError('required')) {
        return 'You must enter a value'
      }
      else if(email.hasError('email')) {
        return 'Not a valid email'
      }
    }
    return ''
  }

  getPasswordErrorMessage(): string {
    const password = this.authForm.get('password')
    if(password) {
      if (password.hasError('required')) {
        return 'You must enter a value'
      }
      else if (password.hasError('minlength')) {
        return 'Password shorter than 8 characters.'
      }
    }
    return ''
  }
}
