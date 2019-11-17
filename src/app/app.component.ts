import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'github-profile-viewer';
  name: any;
  src: any;
  data: any;
  location: any;
  searchBox: FormGroup;
  dataLoading: any;
  noDatafound: any;
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }
  ngOnInit() {
    this.searchBox = new FormGroup({
      searchText: new FormControl('', Validators.required)
    });
  }
  onSubmit(searchBox: FormGroup) {
    const userText = this.searchBox.value.searchText;
    const storeData = localStorage.getItem(userText);
    this.dataLoading = true;
    if (storeData) {
      this.data = JSON.parse(storeData);
      this.fillDetails();
    } else {
      this.addUserdetails(userText).subscribe(response => {
        this.data = response;
        localStorage.setItem(userText, JSON.stringify(this.data));
        this.fillDetails();
        console.log(this.data);
      },
        err => {
          this.noDatafound = true;
          this.data = '';
          this.dataLoading = false;
          this.openSnackBar('Oops!', 'close');
        });

    }
  }
  fillDetails() {
    this.dataLoading = false;
    this.noDatafound = false;
    this.name = this.data.name;
    this.src = this.data.avatar_url;
    this.location = this.data.location;
  }
  addUserdetails(userName) {
    return this.http.get('https://api.github.com/users/' + userName );
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
