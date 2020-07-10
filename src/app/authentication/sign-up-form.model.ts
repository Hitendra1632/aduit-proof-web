export class SignUpForm {

    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public confirmPassword: string,
        public address: string,
        public signature: File,
        public publicKey: string
    ) { }

 }
 