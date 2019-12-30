import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import {FormsComponent} from './forms/forms.component';
import { ProgressBarComponent } from './progressBar/progressBar.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule,MatOptionModule, MatSelectModule, MatIconModule, MatAutocompleteModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostListComponent,
    FormsComponent,
    ProgressBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatIconModule, MatAutocompleteModule,
    FormsModule, ReactiveFormsModule, MatFormFieldModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
