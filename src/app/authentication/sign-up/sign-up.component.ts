import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../must-match.validator';
import { Router } from '@angular/router';
import { requiredFileType } from '../upload-file.validator';
import { AuthService } from 'src/app/common/service/auth.service';

const localWallet = require('ethereumjs-wallet/dist/index');
const EthUtil = require('ethereumjs-util');
const localHDkey = require('ethereumjs-wallet/dist/hdkey');
var crypto = require('crypto-browserify');

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @ViewChild(
    'signatureImageEle'
  ) signatureImageEle: ElementRef | null = null;

  @ViewChild(
    'docUploadEle'
  ) docUploadEle: ElementRef | null = null;

  public registerForm: FormGroup;
  submitted = false;
  public step = 1;
  public sigImgFile: File;
  public uploadDocFile: File;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {

  }

  

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['Jo', Validators.required],
      lastName: ['Root', Validators.required],
      email: ['joroot@cricket.eu', [Validators.required, Validators.email]],
      password: ['12345678', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['12345678', Validators.required],
      fullAddress: ['Bristol,England', [Validators.required, Validators.maxLength(40)]],
      phone: ['+44100100', Validators.required],
      pubKeyHex: ['256eh-eu-eng-dream-11', Validators.required],
      acceptTerms: [true, Validators.requiredTrue],
      // sigImage: [null, [Validators.required,requiredFileType('png')]],
      // sigImage: [null, [requiredFileType('png')]],

    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  // convenience getter for easy access to form fields
  get getFormControls() {
    return this.registerForm.controls;
  }

  onRegistration() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.registerForm.invalid) {
    //   return;
    // }
    if (!this.registerForm.valid) {
      this.markAllAsDirty(this.registerForm);
      return;
    }

    this.authService.registerUser(this.registerForm.value, this.sigImgFile, this.uploadDocFile)
      .subscribe(response => {
        console.log(response);
      },
        error => {

        });


    // display form values on success
    // console.log('SUCCESS' + JSON.stringify(this.registerForm.value));
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  public markAllAsDirty(form: FormGroup) {
    for (const control of Object.keys(form.controls)) {
      form.controls[control].markAsDirty();
    }
  }

  /** https://jasonwatmore.com/post/2020/04/19/angular-9-reactive-forms-validation-example */

  public previousStep(stepNumber) {
    if (stepNumber > 1) {
      this.step--;
    } else {
      this.step = 1;
    }
  }

  public nextStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber < 5) {
      this.step++;
    } else {
      this.step = 1;
    }
  }

  submitSignUp() {
    this.step = 3;
  }

  planPayment() {
    this.step = 5;

  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard/']);
  }

  docUploadChange(event) {
    const fileList: FileList = event.target.files;
    this.uploadDocFile = fileList[0];
  }


  /** Signature Image File Upload */
  // Function to hold the currently selected file for uploading
  signatureImageChange(event) {
    const fileList: FileList = event.target.files;
    this.sigImgFile = fileList[0];
  }

  // Reset selected file
  resetFile() {
    this.sigImgFile = null;
    if (this.signatureImageEle) {
      this.signatureImageEle.nativeElement.value = '';
    }
  }

  // GeneratePublic Key using Ethereum
  generatePublicKey() {
    const privateKey = localWallet.hdkey.fromMasterSeed('random')._hdkey._privateKey;
    const walletStr = localWallet.default.fromPrivateKey(privateKey);
    const publicKeyString = walletStr.getPublicKeyString();
    const wPubliKey = walletStr.getPublicKey()
    this.registerForm.controls.pubKeyHex.setValue(publicKeyString);
    this.registerForm.controls.pubKeyHex.disable({onlySelf: true });
  }

}
