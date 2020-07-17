export class User {

    constructor(
        public name: string,
        public id: string,
        public email: string,
        public picture: string,
        public attrs: UserAttributes,
    ) { }

}

export class UserAttributes {
    public registered: boolean
}

export class UserDetails {

    constructor(
        public accountBlockchainStatus: boolean,
        public kycStatus: boolean,
        public email: string,
        public paymentStatus: boolean,
        public balance: string,
        public firstName: string,
        public lastName: string,
        public fullAddress: string,
        public paymentPlan: string,
        public phone: string,
        public pubKeyHex: string,

    ) { }

} 