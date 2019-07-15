class ScrollCarousel {
	constructor(domNode) {
		this.carousel = domNode;
		this.carouselTrack = this.carousel.querySelector('[data-carousel-track]');
		this.prevButton = this.carousel.querySelector('[data-prev-button]');
		this.nextButton = this.carousel.querySelector('[data-next-button]');

		this.itemsContainerWidth = this.carouselTrack.offsetWidth;
		this.scrollEndSensitivity = 40;
	}

	init() {
		this.addEventListeners();
		this.carousel.classList.add('_inited');
	}

	addEventListeners() {
		this.onScroll = this.onScroll.bind(this);
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);

		this.carouselTrack.addEventListener('scroll', this.onScroll);
		this.prevButton.addEventListener('click', this.prev);
		this.nextButton.addEventListener('click', this.next);
	}

	onScroll() {
		const totalScrollWidth = this.carouselTrack.scrollLeft + this.itemsContainerWidth;
		this.scrollStart = this.carouselTrack.scrollLeft < 0;
		this.scrollEnd = totalScrollWidth + this.scrollEndSensitivity > this.carouselTrack.scrollWidth;

		this.updateCarouselState();
	}

	updateCarouselState() {
		if (this.scrollStart) {
			this.carousel.classList.remove('_prev-visible');
		} else {
			this.carousel.classList.add('_prev-visible');
		}

		if (this.scrollEnd) {
			this.carousel.classList.remove('_next-visible');
		} else {
			this.carousel.classList.add('_next-visible');
		}
	}

	next() {
		// scrollIntoView
		if (typeof this.carouselTrack.scrollTo === 'function') {
			this.carouselTrack.scrollTo({
				top: 0,
				left: this.carouselTrack.scrollLeft += this.carouselTrack.clientWidth,
				behavior: 'smooth'
			});
		} else {
			this.carouselTrack.scrollLeft += this.carouselTrack.clientWidth;
		}
	}

	prev() {
		if (typeof this.carouselTrack.scrollTo === 'function') {
			this.carouselTrack.scrollTo({
				top: 0,
				left: this.carouselTrack.scrollLeft -= this.carouselTrack.clientWidth,
				behavior: 'smooth'
			});
		} else {
			this.carouselTrack.scrollLeft -= this.carouselTrack.clientWidth;
		}
	}
}

document.querySelectorAll('.carousel').forEach(carousel => new ScrollCarousel(carousel).init());
