import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.scss"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      surname: new FormControl(null, { validators: [Validators.required] }),
      gender: new FormControl(null, { validators: [Validators.required] }),
      birthday: new FormControl(null, { validators: [Validators.required] }),
      workexp: new FormControl(null, { validators: [Validators.required] }),
      technologies: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, { validators: [Validators.required] }),
      phone: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            name: postData.name,
            surname: postData.surname,
            gender: postData.gender,
            birthday: postData.birthday,
            workexp: postData.workexp,
            technologies: postData.technologies,
            email: postData.email,
            phone: postData.phone,
            creator: postData.creator
          };
          this.form.setValue({
            name: this.post.name,
            surname: this.post.surname,
            gender: this.post.gender,
            birthday: this.post.birthday,
            workexp: this.post.workexp,
            technologies: this.post.technologies,
            email: this.post.email,
            phone: this.post.phone
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.name,
        this.form.value.surname,
        this.form.value.gender,
        this.form.value.birthday,
        this.form.value.workexp,
        this.form.value.technologies,
        this.form.value.email,
        this.form.value.phone
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.name,
        this.form.value.surname,
        this.form.value.gender,
        this.form.value.birthday,
        this.form.value.workexp,
        this.form.value.technologies,
        this.form.value.email,
        this.form.value.phone
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
