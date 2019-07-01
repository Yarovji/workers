import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                name: post.name,
                surname: post.surname,
                gender: post.gender,
                birthday: post.birthday,
                workexp: post.workexp,
                technologies: post.technologies,
                email: post.email,
                phone: post.phone,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      surname: string;
      gender: string;
      birthday: string;
      workexp: string;
      technologies: string;
      email: string;
      phone: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPost(
    name: string, surname: string, gender: string, birthday: string, workexp: string, technologies: string,
    email: string, phone: string) {
    const postData = new FormData();
    postData.append('name', name);
    postData.append('surname', surname);
    postData.append('gender', gender);
    postData.append('birthday', birthday);
    postData.append('workexp', workexp);
    postData.append('technologies', technologies);
    postData.append('email', email);
    postData.append('phone', phone);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, name: string, surname: string,
    gender: string, birthday: string, workexp: string, technologies: string,
    email: string, phone: string) {
    let postData: Post | FormData;
    if (typeof name === 'string') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('name', name);
      postData.append('surname', surname);
      postData.append('gender', gender);
      postData.append('birthday', birthday);
      postData.append('workexp', workexp);
      postData.append('technologies', technologies);
      postData.append('email', email);
      postData.append('phone', phone);
    } else {
      postData = {
        id: id,
        name: name,
        surname: surname,
        gender: gender,
        birthday: birthday,
        workexp: workexp,
        technologies: technologies,
        email: email,
        phone: phone,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
