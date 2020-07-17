export class DocumentDetails {

    constructor(
        public documentID: string,
        public documentHash: string,
        public documentName: string,
        public originalDocumentHash: string,
        public sigBase64Image: string,
        public signHex: string,
        public signerKey: string,
        public signerName: string,
        public status: string,
        public userID: string,
    ) { }

} 