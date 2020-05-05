import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomePageService } from 'src/app/services/home-page.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private outhService: AuthService,
    private homePageService: HomePageService
  ) {
    console.log("postID"+this.id);
  }
  heartType: string = "heart-empty";
  id = null;
  post: any;
  commenter : any;
  parentPath: any;
  addPostForm: FormGroup;
  @ViewChild('myInput', {static: true}) myInput: ElementRef;
  async ngOnInit() {

    this.addPostForm = this.fb.group({
      comment: ['', Validators.required],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    console.log("postID ngoninit "+this.id);
    await this.getPostDetail();

    //commenter 
    this.commenter = this.outhService.getCurrentUser().subscribe(user => {
      this.commenter = user;
    });
  }
  resize() {
      this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight+ 'px';
  }


  async getPostDetail() {
    this.post = await this.homePageService
      .getOnePost(this.id)
      .subscribe((res) => {
        console.log("my post: ", res);
        this.post = res;
      });
  }

  addComment(){
    console.log("submited form ");
    this.homePageService.addComment(this.id, this.addPostForm.value, this.commenter);
    this.addPostForm.reset();

  }
  toggleHeart() {
    console.log("calling toggleHeart");
    if (this.heartType == "heart-empty") {
      console.log("Heart ON");

      // this.shoppingService.addWishlist(
      //   this.itemId,
      //   this.itemArray.name,
      //   this.itemArray.rating,
      //   this.itemArray.image
      // );
      // this.postReference.update({
      // 	likes: firestore.FieldValue.arrayUnion(this.user.getUID())
      // })
    } else {
      console.log("Heart OFF");
      // this.shoppingService.removeWishlist(this.itemId);
      // this.postReference.update({
      // 	likes: firestore.FieldValue.arrayRemove(this.user.getUID())
      // })
    }
  }
}
