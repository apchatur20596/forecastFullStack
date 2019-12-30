import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {

  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  constructor(private http: HttpClient) {}
  onAddPost(postTitle: HTMLTextAreaElement, postContent: HTMLInputElement) {
    const post: Post = {title: postTitle.value, content: postContent.value};
    this.postCreated.emit(post);
    this.http.get('http://localhost:3000/api/posts');
  }
}
