import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../common/service/user.service';
import { DocumentService } from '../../common/service/document.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-document-validation',
  templateUrl: './document-validation.component.html',
  styleUrls: ['./document-validation.component.scss']
})
export class DocumentValidationComponent implements OnInit {

  public step = 1;
  public documentID = null;
  public isLoadingDocument = false;
  public signImage: any;
  public signerName = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.documentID = params['document-id'];
      if (!this.documentID) {
        // New Record  attempt .. so user will land on first screen
        this.isLoadingDocument = false;
        this.step = 1;
      } else {
        this.fetchPartialDocument();
      }
    });
  }

  // Function to fetch the partially completed document and land the user to plugin screen
  public fetchPartialDocument() {
    this.isLoadingDocument = true;
    this.documentService.getPartialDocument(
      {
        documentID: this.documentID,
        userID: this.userService.currentUserValue.email
      }).subscribe(doc => {
        this.isLoadingDocument = false;
        this.signImage = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + doc.sigBase64Image);
        this.signerName = doc.signerName;
        this.step = 2; // Directly load the plugin
      }, error => {
        this.isLoadingDocument = false;
        this.step = 1;
      })
  }

  // Navigate to DAshoard
  public navigateToDashboard() {
    this.router.navigate(['/dashboard/']);
  }

}
