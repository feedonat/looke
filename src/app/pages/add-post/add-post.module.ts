import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { IonicModule } from '@ionic/angular';

import { AddPostPageRoutingModule } from './add-post-routing.module';

import { AddPostPage } from './add-post.page';

const toolbarOptions = [
  ['bold', 'italic', 'underline' ], ['link', 'image', 'video'],
  ['blockquote'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPostPageRoutingModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      placeholder: 'Start writing',
      modules: {
        toolbar: toolbarOptions
      }, theme: 'snow'
    })
  ],
  
  declarations: [AddPostPage]
})
export class AddPostPageModule {}
