import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  needsToSignUp = false;
  signUpOrLoginText = 'Not a member? Click here to sign up!';
  btnText = 'Login';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loader: LoadingController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get firstName() {
    return this.loginForm.get('firstName');
  }
  get lastName() {
    return this.loginForm.get('lastName');
  }

  onSubmit() {
    if (this.needsToSignUp) {
      this.signUp();
    } else {
      this.signIn();
    }
  }

  async signUp() {
    const loading = await this.loader.create();
    await loading.present();
    this.auth.signUp(this.loginForm.value)
      .then(user => {
        console.log(user);
        loading.dismiss();
        this.router.navigateByUrl('/chat', { replaceUrl: true });
      },
        async err => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Sign up failed',
            message: err.message,
            buttons: ['Ok']
          });
          await alert.present();
        });
  }

  async signIn() {
    const loading = await this.loader.create();
    await loading.present();

    this.auth.signIn(this.loginForm.value)
      .then(user => {
        console.log(user);
        loading.dismiss();
        this.router.navigateByUrl('/chat', { replaceUrl: true });
      },
        async err => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            message: err.message,
            buttons: ['Ok']
          });
          await alert.present();
        });
  }

  loginOrSignUp() {
    this.needsToSignUp = !this.needsToSignUp;
    if (this.needsToSignUp) {
      this.signUpOrLoginText = 'Already a member? Click here to login!';
      this.btnText = 'Sign Up';
      this.loginForm.addControl('firstName', this.fb.control('', [Validators.required]));
      this.loginForm.addControl('lastName', this.fb.control('', [Validators.required]));
    } else {
      this.signUpOrLoginText = 'Not a member? Click here to sign up!';
      this.btnText = 'Login';
    }
  }
}
