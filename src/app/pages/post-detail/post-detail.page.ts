import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HomePageService } from "src/app/services/home-page.service";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as e from "cors";
import { PostService } from "src/app/services/post.service";
import { Observable } from 'rxjs';

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.page.html",
  styleUrls: ["./post-detail.page.scss"],
})
export class PostDetailPage implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private outhService: AuthService,
    private homePageService: HomePageService,
    private postService: PostService
  ) {
    console.log("postID" + this.id);
  }
  comments: Observable<any[]>;
  heartType: string = "heart-empty";
  id = null;
  post: any;
  liked: any;
  commenter: any;
  parentPath: any;
  addPostComment: FormGroup;
  @ViewChild("myInput", { static: true }) myInput: ElementRef;
  async ngOnInit() {
    this.addPostComment = this.fb.group({
      comment: ["", Validators.required],
    });

    this.id = this.route.snapshot.paramMap.get("id");
    console.log("postID ngoninit " + this.id);
    await this.getPostDetail();
    await this.getPostComments(this.id);
  }
  resize() {
    this.myInput.nativeElement.style.height =
      this.myInput.nativeElement.scrollHeight + "px";
  }

  async getPostDetail() {
    this.post = await this.homePageService
      .getOnePost(this.id)
      .subscribe((res) => {
        const comments = res["comments"].reverse();
        console.log("my post with comments reverted: ", res);
        this.post = res;
      });
  }

  async getPostComments(id){
      this.comments = this.postService.getPostComments(id);
  }

  addComment() {
    console.log("submited form ");
    this.postService.addComment(this.id, this.addPostComment.value);
    this.addPostComment.reset();
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
