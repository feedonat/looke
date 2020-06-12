import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.page.html",
  styleUrls: ["./tabs.page.scss"],
})
export class TabsPage implements OnInit {
  constructor(public platform: Platform, private router: Router) {}

  titleLayout = "hide";
  position = "center";
  fabVisible = true;
  icon = "checkmark";

  customTitleLayoutOptions: any = {
    header: "Title Layout",
    subHeader: "Select a title layout",
  };

  customFabPositionOptions: any = {
    header: "Fab Position",
    subHeader: "Select a floating action button position.",
  };

  ngOnInit() {}

  addPost() {
    this.router.navigateByUrl("1/post/add");
  }
}
