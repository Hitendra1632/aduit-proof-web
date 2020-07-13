export class User {

    constructor(
        public name: string,
        public id: string,
        public email: string,
        public picture:string,
        public attrs: UserAttributes,
    ) { }

 }

 export class UserAttributes{
   public registered: boolean
 }