import ScrollCarousel from './ScrollCarousel.js';

export default class ScrollCarouselAutoplay extends ScrollCarousel {
	constructor(domNode) {
		super(domNode);

		this.autoPlayEnabled = this.carousel.hasAttribute('data-autoplay') || false;
		this.autoPlayDelay = this.carousel.getAttribute('data-autoplay') || 5000;
	}

	init() {
		super.init();
		this.addAutoPlayEventListeners();
		this.startAutoPlay();
	}

	addAutoPlayEventListeners() {
		this.startAutoPlay = this.startAutoPlay.bind(this);
		this.stopAutoPlay = this.stopAutoPlay.bind(this);
		this.disableAutoPlay = this.disableAutoPlay.bind(this);

		this.carousel.addEventListener('keydown', this.disableAutoPlay);
		this.carousel.addEventListener('mousedown', this.disableAutoPlay);
		this.carousel.addEventListener('touchstart', this.disableAutoPlay);

		this.carousel.addEventListener('mouseenter', this.stopAutoPlay);
		this.carousel.addEventListener('mouseleave', this.startAutoPlay);
	}

	cycle() {
		this.stopAutoPlay();

		if (this.isScrollEnd) {
			this.scrollToPoint(0, 0);
			// adjust timeout delay to have constant pause
		} else {
			this.next();
		}

		this.startAutoPlay();
	}

	startAutoPlay() {
		if (!this.autoPlayEnabled) {
			return;
		}
		this.autoPlay = window.setTimeout(this.cycle.bind(this), this.autoPlayDelay);
	}

	stopAutoPlay() {
		window.clearTimeout(this.autoPlay);
	}

	disableAutoPlay() {
		this.stopAutoPlay();
		this.autoPlayEnabled = false;

		this.carousel.removeEventListener('keydown', this.disableAutoPlay);
		this.carousel.removeEventListener('mousedown', this.disableAutoPlay);
		this.carousel.removeEventListener('touchstart', this.disableAutoPlay);

		this.carousel.removeEventListener('mouseenter', this.stopAutoPlay);
		this.carousel.removeEventListener('mouseleave', this.startAutoPlay);
	}

	destroy() {
		super.destroy();
		this.disableAutoPlay();
	}
}
