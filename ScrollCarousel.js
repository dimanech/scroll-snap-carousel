export default class ScrollCarousel {
	constructor(domNode) {
		this.carousel = domNode;
		this.carouselTrack = this.carousel.querySelector('[data-elem-carousel-track]');
		this.prevButton = this.carousel.querySelector('[data-elem-prev-button]'); // TODO: make optional?
		this.nextButton = this.carousel.querySelector('[data-elem-next-button]');

		this.isDirectionHorizontal = this.carousel.getAttribute('data-direction') !== 'vertical';
		this.currentPageIndex = 0;

		this.SCROLL_END_SENSITIVITY = 40; // Workaround IE rounding for clientWidth and scrollWidth

		this.stylesClass = {
			initialized: '_initialized',
			noScroll: '_no-scroll',
			prevVisible: '_prev-visible',
			nextVisible: '_next-visible',
			pagination: 'pagination',
			page: 'page',
			current: '_current'
		}
	}

	init() {
		this.addEventListeners();
		this.onScroll();
		this.syncPrevNextButtons();
		this.initPagination();
		this.setActivePagination(this.getCurrentPageIndex());
		this.carousel.classList.add(this.stylesClass.initialized);
	}

	addEventListeners() {
		this.onScroll = this.onScroll.bind(this);
		this.scrollBackward = this.scrollBackward.bind(this);
		this.scrollForward = this.scrollForward.bind(this);

		this.carouselTrack.addEventListener('scroll', this.onScroll, { passive: true });
		this.carouselTrack.addEventListener('touchstart', this.onScroll, { passive: true });
		this.prevButton.addEventListener('click', this.scrollBackward);
		this.nextButton.addEventListener('click', this.scrollForward);
	}

	removeEventListeners() {
		this.carouselTrack.removeEventListener('scroll', this.onScroll);
		this.carouselTrack.removeEventListener('touchstart', this.onScroll);
		this.prevButton.removeEventListener('click', this.scrollBackward);
		this.nextButton.removeEventListener('click', this.scrollForward);
	}

	// Prev next buttons and UI
	onScroll() {
		this.getScrollState();

		if (!this.isCallInNextFrameRequested) {
			window.requestAnimationFrame(this.scrollHandlers.bind(this));
			this.isCallInNextFrameRequested = true;
		}
	}

	getScrollState() {
		// Possible optimization: Resize Observer that watch carousel width and cache this.carousel.offsetWidth
		if (this.isDirectionHorizontal) {
			const totalScrollWidth = this.carouselTrack.scrollLeft + this.carousel.offsetWidth;
			this.isScrollStart = this.carouselTrack.scrollLeft <= 0;
			this.isScrollEnd = totalScrollWidth + this.SCROLL_END_SENSITIVITY >= this.carouselTrack.scrollWidth;
		} else {
			const totalScrollHeight = this.carouselTrack.scrollTop + this.carousel.offsetHeight;
			this.isScrollStart = this.carouselTrack.scrollTop <= 0;
			this.isScrollEnd = totalScrollHeight + this.SCROLL_END_SENSITIVITY >= this.carouselTrack.scrollHeight;
		}
	}

	scrollHandlers() {
		this.syncPrevNextButtons();
		this.updateCurrentPageIndex();
		this.isCallInNextFrameRequested = false;
	}

	updateCurrentPageIndex() {
		const requestedPageIndex = Math.round(this.carouselTrack.scrollLeft / this.carousel.clientWidth);
		if (this.currentPageIndex === requestedPageIndex) {
			return;
		}

		this.onPageChanged(requestedPageIndex);

		this.currentPageIndex = requestedPageIndex;
		this.carousel.dispatchEvent(new CustomEvent('scrollCarousel:pageChanged', { bubbles: false, detail: this.currentPageIndex}));
	}

	syncPrevNextButtons() {
		if (this.isScrollStart && this.isScrollEnd) { // No scroll case
			this.carousel.classList.add(this.stylesClass.noScroll);
			this.hasScroll = false;
		} else {
			this.carousel.classList.remove(this.stylesClass.noScroll);
			this.hasScroll = true;
		}

		if (this.isScrollStart) {
			this.carousel.classList.remove(this.stylesClass.prevVisible);
			this.prevButton.setAttribute('disabled', '');
		} else {
			this.carousel.classList.add(this.stylesClass.prevVisible);
			this.prevButton.removeAttribute('disabled');
		}

		if (this.isScrollEnd) {
			this.carousel.classList.remove(this.stylesClass.nextVisible);
			this.nextButton.setAttribute('disabled', '');
		} else {
			this.carousel.classList.add(this.stylesClass.nextVisible);
			this.nextButton.removeAttribute('disabled');
		}
	}

	onPageChanged(requestedPageIndex) {
		this.setActivePagination(requestedPageIndex);
	}

	// Prev next functionality

	// relative scroll - page by page
	scrollBackward() {
		this.scrollByPage(false);
	}

	scrollForward() {
		this.scrollByPage(true);
	}

	scrollByPage(isNext) {
		const x = this.isDirectionHorizontal ? this.carouselTrack.clientWidth : 0;
		const y = this.isDirectionHorizontal ? 0 : this.carouselTrack.clientHeight;

		if (isNext) {
			this.carouselTrack.scrollBy(x, y);
		} else {
			this.carouselTrack.scrollBy(-x, -y);
		}
	}

	// abs scroll - page to page
	getCurrentPageIndex() {
		const currentPosition = this.isDirectionHorizontal
			? this.carouselTrack.scrollLeft : this.carouselTrack.scrollTop;
		const pageWidth = this.isDirectionHorizontal
			? this.carouselTrack.clientWidth : this.carouselTrack.clientHeight;
		return Math.round(currentPosition / pageWidth);
	}

	scrollToNextPage() {
		this.scrollToPage(this.getCurrentPageIndex() + 1);
	}

	scrollToPrevPage() {
		this.scrollToPage(this.getCurrentPageIndex() - 1);
	}

	scrollToPage(pageIndex) {
		if (pageIndex < 0) {
			return;
		}

		if (this.isDirectionHorizontal) {
			this.scrollToPoint(0, Math.round(this.carousel.clientWidth * pageIndex));
		} else {
			this.scrollToPoint(Math.round(this.carousel.clientHeight * pageIndex), 0);
		}
	}

	scrollToPoint(top, left) {
		const element = this.carouselTrack;
		// Safari and Edge do not have smooth scrolling please use polyfill or just leave it as is
		// If you still using jQuery you could call $.animate()
		if (typeof element.scrollTo === 'function' && 'scrollBehavior' in document.documentElement.style) {
			element.scrollTo({
				top: top,
				left: left,
				behavior: 'smooth'
			});
		} else {
			if (this.isDirectionHorizontal) {
				element.scrollLeft = left;
			} else {
				element.scrollTop = top;
			}
		}
	}

	// Pagination

	initPagination() {
		if (!this.carousel.hasAttribute('data-pagination')) {
			return;
		}
		this.createPagination();
		this.updateCurrentPageIndex();
	}

	createPagination() {
		const hasPagination = !!this.pagination;
		// We need to use round, not ceil, since it called on scroll, in case of last it would generate false positive
		const numberOfPages = Math.round(this.carouselTrack.scrollWidth / this.carouselTrack.clientWidth);

		if (!hasPagination) {
			this.pagination = document.createElement('div');
			this.pagination.className = this.stylesClass.pagination;
		} else {
			this.carousel.removeChild(this.pagination);
		}

		for (let i = 0; i < numberOfPages; i++) {
			const page = document.createElement('div');
			page.className = this.stylesClass.page;
			page.setAttribute('data-page', i);
			this.pagination.appendChild(page);
		}

		if (!hasPagination) {
			this.carousel.appendChild(this.pagination);
		}
	}

	setActivePagination(requestedPageIndex) {
		if (!this.pagination) {
			return;
		}

		const pages = this.pagination.children;
		pages[this.currentPageIndex].classList.remove(this.stylesClass.current);
		pages[requestedPageIndex].classList.add(this.stylesClass.current);
	}

	destroyPagination() {
		if (!this.pagination) {
			return
		}
		this.carousel.removeChild(this.pagination);
		delete this.pagination;
	}

	// Destroy

	destroy() {
		this.removeEventListeners();
		this.destroyPagination();
	}
}
