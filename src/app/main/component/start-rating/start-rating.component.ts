import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-start-rating',
  templateUrl: './start-rating.component.html',
  styleUrls: ['./start-rating.component.scss']
})
export class StartRatingComponent implements OnInit {

  @Input()
  selectedRating: number | undefined;

  @Output() click = new EventEmitter<number>();

  stars = [
    {
      id: 1,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 2,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 3,
      icon: 'star',
      class: 'star-gray star-hover star'
    }

  ];

  constructor() { }

  ngOnInit(): void {
    this.displayStars(this.selectedRating || 0);
  }

  displayStars(value: number): void {
    this.stars.filter((star) => {
      if (star.id <= value) {
        star.class = 'star-gold star star-hover';
      } else {
        star.class = 'star-gray star star-hover';
      }
      return star;
    });
  }


  selectStar(value: any): void {
    if (this.selectedRating === value) {
      value = value - 1;
    }
    this.displayStars(value);

    this.selectedRating = value;
    this.click.emit(this.selectedRating);
  }
}
