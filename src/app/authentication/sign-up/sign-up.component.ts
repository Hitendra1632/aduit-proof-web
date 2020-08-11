import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../must-match.validator';
import { Router } from '@angular/router';
import { requiredFileType } from '../upload-file.validator';
import { AuthService } from 'src/app/common/service/auth.service';
const Web3 = require('web3');
const wThree = new Web3();

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
  public uploadDocFile: File[] = [];
  public showPrivateKeyModal = false;
  public privateKey = null;

  showSignPreviewModal = false;
  showKYCPreviewModal = false;

  signImageUrl: string | ArrayBuffer;
  kycImageUrl: string | ArrayBuffer;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {

  }



  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      fullAddress: ['', [Validators.required, Validators.maxLength(40)]],
      phone: ['', Validators.required],
      pubKeyHex: ['', Validators.required],
      acceptTerms: [true, Validators.requiredTrue],
      // sigImage: [null, [Validators.required, requiredFileType('pdf')]],
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
        if (response.status === 'success') {
          this.step = 5;
        }
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

  planPayment() {
    this.step = 5;

  }

  navigateToLogin() {
    this.router.navigate(['/authentication/login']);
  }

  docUploadChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.uploadDocFile.push(event.target.files[i]);
      }
    }
  }


  /** Signature Image File Upload */
  // Function to hold the currently selected file for uploading
  signatureImageChange(event) {
    const fileList: FileList = event.target.files;
    this.sigImgFile = fileList[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.sigImgFile);

    reader.onload = event => {
      this.signImageUrl = reader.result;
    };
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
    // const privateKey = localWallet.hdkey.fromMasterSeed('random')._hdkey._privateKey;
    // this.privateKey = privateKey.toString('hex')
    // const walletStr = localWallet.default.fromPrivateKey(privateKey);
    // const publicKeyString = walletStr.getPublicKeyString();
    // const wPubliKey = walletStr.getPublicKey();

    // Generate Account Object
    const ethAccountObj = wThree.eth.accounts.create();
    const ethPrivateKey = wThree.eth.accounts.privateKeyToAccount(ethAccountObj.privateKey);

    this.privateKey = ethPrivateKey.privateKey;
    this.registerForm.controls.pubKeyHex.patchValue(ethPrivateKey.address);
    this.registerForm.controls.pubKeyHex.disable({ onlySelf: true });
    this.showPrivateKeyModal = true;
  }

  /* To copy Text from Textbox */
  copyPrivateKey(e, inputElement) {
    e.preventDefault();
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    alert('Copied');
  }

  hideModal() {
    this.showPrivateKeyModal = false;
  }

  public navigateToHomeScreen() {
    this.router.navigate(['welcome']);
  }

  showSignPreview() {
    this.showSignPreviewModal = true;
  }

  hideSignModal() {
    this.showSignPreviewModal = false;
  }

  showKYCPreview(indx) {
    this.showKYCPreviewModal = true;
    const reader = new FileReader();
    const currentFile = this.uploadDocFile[indx];
    reader.readAsDataURL(currentFile);

    reader.onload = event => {
      this.kycImageUrl = reader.result;
    };
  }

  hideKYCModal() {
    this.showKYCPreviewModal = false;
  }

}
