import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
  picsum: string[] = Array.from(
    new Array(12),
    (x, i) => `https://picsum.photos/1080/720/?${i}`
  );
  constructor() { }

  ngOnInit() {
  }

}
