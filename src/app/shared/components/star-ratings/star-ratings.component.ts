import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-star-ratings',
  templateUrl: './star-ratings.component.html',
  styleUrls: ['./star-ratings.component.scss'],
})
export class StarRatingsComponent implements OnInit {
  @Input() ratingStar;
  @Input() userRating;
  @Output() onRate = new EventEmitter();
  rating = [];
  constructor() { }
  ngOnInit() {
    this.ratingStar = !this.ratingStar ? 5 : this.ratingStar;
    this.prepareNotification();
  }
  prepareNotification() {
    for (let i = 1; i <= this.ratingStar; i++) {
      let data = {
        value: i,
        name: 'star-outline'
      }
      this.rating.push(data);
    }
    if (this.userRating) {
      this.rate(this.userRating);
    }
  }
  rate(rate) {
      this.rating.forEach(rating => {
        rating.value <= rate ? rating.name = 'star' : rating.name = 'star-outline'
      });
      this.onRate.emit(rate);
  }
}