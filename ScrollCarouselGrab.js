import ScrollCarousel from './ScrollCarousel.js';

export default class ScrollCarouselGrab extends ScrollCarousel {
	constructor(domNode) {
		super(domNode);

		this.EDGE_RESISTANCE = 100;
		this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

		this.stylesClass.grubbing = '_grabbing';
		this.position = { top: 0, left: 0, x: 0, y: 0 };
	}

	init() {
		super.init();
	}

	addEventListeners() {
		super.addEventListeners();
		this.addGrabEventListeners();
	}

	addGrabEventListeners() {
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);

		this.carouselTrack.addEventListener('mousedown', this.onMouseDown);
		this.carouselTrack.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseDown(event) {
		this.position = {
			left: this.carouselTrack.scrollLeft,
			top: this.carouselTrack.scrollTop,
			x: event.clientX,
			y: event.clientY,
		};

		this.carouselTrack.addEventListener('mousemove', this.onMouseMove);
		this.carouselTrack.addEventListener('mouseleave', this.onMouseUp);
	}

	onMouseMove(event) {
		this.carouselTrack.classList.add(this.stylesClass.grubbing);
		this.isMouseMoved = true;

		const deltaX = event.clientX - this.position.x;
		const deltaY = event.clientY - this.position.y;

		this.delta = this.isDirectionHorizontal ? deltaX : deltaY;

		this.carouselTrack.scrollTo({
			top: this.position.top - deltaY,
			left: this.position.left - deltaX
		});
	}

	onMouseUp() {
		this.carouselTrack.removeEventListener('mousemove', this.onMouseMove);
		this.carouselTrack.removeEventListener('mouseleave', this.onMouseUp);

		// FF and Chrome process differently snapping
		if (this.isFirefox) {
			clearTimeout(this.transitionFallbackTimer);
			this.waitForTransitionEnd(() => this.carouselTrack.classList.remove(this.stylesClass.grubbing));
		} else {
			this.carouselTrack.classList.remove(this.stylesClass.grubbing);
		}

		switch (true) {
			case (this.delta < -this.EDGE_RESISTANCE):
				this.scrollToNextPage();
				break;
			case (this.delta > this.EDGE_RESISTANCE):
				this.scrollToPrevPage();
				break;
			case (this.isMouseMoved):
				// is used drag beyond resistance threshold and this is not click
				this.scrollToPage(this.getCurrentPageIndex());
				break;
		}

		this.delta = 0;
		this.isMouseMoved = false;
	}

	waitForTransitionEnd(callback) {
		const onEnd = () => {
			clearTimeout(this.transitionFallbackTimer);
			callback();
		}
		this.transitionFallbackTimer = setTimeout(onEnd, 800);
	}

	removeEventListeners() {
		super.removeEventListeners();
		this.removeGrabEventListeners();
	}

	removeGrabEventListeners() {
		this.carouselTrack.removeEventListener('mousedown', this.onMouseDown);
		this.carouselTrack.removeEventListener('mouseup', this.onMouseUp);
	}

	destroy() {
		super.destroy();
		clearTimeout(this.transitionFallbackTimer);
	}
}
