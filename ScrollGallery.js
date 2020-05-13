import ScrollCarousel from './ScrollCarouselGrab.js';

export default class ScrollGallery {
	constructor(domNode) {
		this.gallery = domNode;
		this.slider = this.gallery.querySelector('[data-elem-slider]');
		this.thumbs = this.gallery.querySelector('[data-elem-thumbs]');
		this.thumbsList = this.gallery.querySelectorAll('[data-elem-thumb]');

		this.stylesClass = {
			current: '_current'
		}
	}

	init() {
		if (!this.slider || !this.thumbs) {
			throw new Error('Not initialized. Carousel or Slider is missed!')
		}

		this.sliderCarousel = new ScrollCarousel(this.slider);
		this.thumbsCarousel = new ScrollCarousel(this.thumbs);
		this.sliderCarousel.init();
		this.thumbsCarousel.init();

		this.initEventListeners();
		this.initThumbs();
	}

	initEventListeners() {
		this.onSliderChange = this.onSliderChange.bind(this);
		this.onThumbClick = this.onThumbClick.bind(this);

		this.slider.addEventListener('scrollCarousel:pageChanged', this.onSliderChange);
		this.thumbsList.forEach(item => item.addEventListener('click', this.onThumbClick));
	}

	onSliderChange(event) {
		event.stopPropagation();

		const currentPageIndex = event.detail;
		const currentPageNode = this.thumbsList[currentPageIndex];

		this.setActiveThumb(currentPageNode);
		this.scrollActivePaginationIntoView(currentPageIndex, currentPageNode);
	}

	onThumbClick(event) {
		const currentPageIndex = event.target.getAttribute('data-page');
		if (!currentPageIndex) {
			return;
		}
		this.sliderCarousel.scrollToPage(currentPageIndex);
	}

	initThumbs() {
		this.setActiveThumb(this.thumbsList[0]);
	}

	setActiveThumb(current) {
		if (this.activeThumb) {
			this.activeThumb.classList.remove(this.stylesClass.current);
		}
		current.classList.add(this.stylesClass.current);
		this.activeThumb = current;
	}

	scrollActivePaginationIntoView(currentPageIndex, currentPageNode) {
		if (!this.thumbsCarousel.hasScroll) {
			return;
		}

		if (currentPageNode.offsetTop > this.thumbsCarousel.carouselTrack.clientHeight) {
			this.thumbsCarousel.scrollToPage(currentPageIndex);
		} else if (currentPageNode.offsetTop < this.thumbsCarousel.carouselTrack.scrollTop) {
			this.thumbsCarousel.scrollToPage(0);
		}
	}

	destroyEventListeners() {
		this.slider.removeEventListener('scrollCarousel:pageChanged', this.onSliderChange);
		this.thumbsList.forEach(item => item.removeEventListener('click', this.onThumbClick));
	}

	destroy() {
		this.sliderCarousel.destroy();
		this.thumbsCarousel.destroy();
		this.destroyEventListeners();
	}
}
