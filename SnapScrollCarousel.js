export default class SnapScrollCarousel {
	constructor(domNode) {
		this.carousel = domNode;
		this.carouselTrack = this.carousel.querySelector('[data-carousel-track]');
		this.prevButton = this.carousel.querySelector('[data-prev-button]');
		this.nextButton = this.carousel.querySelector('[data-next-button]');

		this.carouselDirection = this.carousel.getAttribute('data-carousel') || 'horizontal';
		this.currentPage = 0;

		this.itemsContainerWidth = this.carouselTrack.offsetWidth;
		this.itemsContainerHeight = this.carouselTrack.offsetHeight;
		this.scrollEndSensitivity = 40; // Workaround IE rounding for clientWidth and scrollWidth
	}

	init() {
		this.addEventListeners();
		this.onScroll();
		this.updateCarouselState();
		this.carousel.classList.add('_inited');
		this.setupPagination();
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
		if (this.carouselDirection === 'horizontal') {
			const totalScrollWidth = this.carouselTrack.scrollLeft + this.itemsContainerWidth;
			this.scrollStart = this.carouselTrack.scrollLeft <= 0;
			this.scrollEnd = totalScrollWidth + this.scrollEndSensitivity >= this.carouselTrack.scrollWidth;
		} else {
			const totalScrollHeight = this.carouselTrack.scrollTop + this.itemsContainerHeight;
			this.scrollStart = this.carouselTrack.scrollTop <= 0;
			this.scrollEnd = totalScrollHeight + this.scrollEndSensitivity >= this.carouselTrack.scrollHeight;
		}

		this.scrollHandlers();
	}

	scrollHandlers() {
		this.updateCarouselState();
		if (this.pagination) {
			this.setActivePagination();
			this.scrollToActivePagination(); // no need to scroll on init
		}
	}

	updateCarouselState() {
		if (this.scrollStart && this.scrollEnd) { // No scroll case
			this.carousel.classList.add('_no-scroll');
		} else {
			this.carousel.classList.remove('_no-scroll');
		}

		if (this.scrollStart) {
			this.carousel.classList.remove('_prev-visible');
			this.prevButton.setAttribute('disabled', 'true');
		} else {
			this.carousel.classList.add('_prev-visible');
			this.prevButton.removeAttribute('disabled');
		}

		if (this.scrollEnd) {
			this.carousel.classList.remove('_next-visible');
			this.nextButton.setAttribute('disabled', 'true');
		} else {
			this.carousel.classList.add('_next-visible');
			this.nextButton.removeAttribute('disabled');
		}
	}

	next() {
		if (this.carouselDirection === 'horizontal') {
			this.scrollToPoint(0,this.carouselTrack.scrollLeft += this.carouselTrack.clientWidth);
		} else {
			this.scrollToPoint(this.carouselTrack.scrollTop += this.carouselTrack.clientHeight, 0);
		}
	}

	prev() {
		if (this.carouselDirection === 'horizontal') {
			this.scrollToPoint(0,this.carouselTrack.scrollLeft -= this.carouselTrack.clientWidth);
		} else {
			this.scrollToPoint(this.carouselTrack.scrollTop -= this.carouselTrack.clientHeight, 0);
		}
	}

	scrollToPoint(top, left) {
		// Safari old + Edge do not have smooth scrolling
		// please use polyfill or leave it as is
		if (typeof this.carouselTrack.scrollTo === 'function') {
			this.carouselTrack.scrollTo({
				top: top,
				left: left,
				behavior: 'smooth'
			});
		} else {
			if (this.carouselDirection === 'horizontal') {
				this.carouselTrack.scrollLeft = left;
			} else {
				this.carouselTrack.scrollTop = top;
			}
		}
	}

	setupPagination() {
		const paginationOption = this.carousel.getAttribute('data-pagination');
		if (paginationOption === null) {
			return;
		}
		if (paginationOption === '') {
			this.createPaginationElements();
		} else {
			this.pagination = document.getElementById(paginationOption);
		}
		this.pagination.onclick = this.handlePaginationClick.bind(this);
		this.setActivePagination();
	}

	createPaginationElements() {
		const fullScrollCount = Math.round(this.carouselTrack.scrollWidth / this.carousel.clientWidth);
		if (this.pagination) {
			this.pagination.innerHTML = '';
		}
		this.pagination = document.createElement('div');
		this.pagination.className = 'pagination';

		for (let i = 0; i < fullScrollCount; i++) {
			const page = document.createElement('button');
			page.className = 'page';
			page.setAttribute('data-page', i);
			page.tabIndex = -1;
			this.pagination.appendChild(page);
		}

		this.carousel.appendChild(this.pagination);
	}

	setActivePagination() {
		const currentPageIndex = Math.round(this.carouselTrack.scrollLeft / this.carousel.clientWidth);
		this.pagination.children[this.currentPage].classList.remove('_current');
		const currentPage = this.pagination.children[currentPageIndex];
		if (!currentPage) {
			this.setupPagination();
		}
		currentPage.classList.add('_current');
		this.currentPage = currentPageIndex;
	}

	scrollToActivePagination() {
		const currentPage = this.pagination.children[this.currentPage];
		if (typeof currentPage.scrollIntoViewIfNeeded === 'function') {
			currentPage.scrollIntoViewIfNeeded();
		} else {
			currentPage.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "nearest"
			});
		}
	}

	handlePaginationClick(event) {
		event.preventDefault();
		const eventTarget = event.target;
		let pageIndex = eventTarget.getAttribute('data-page');
		if (!pageIndex) {
			return;
		}
		if (this.carouselDirection === 'horizontal') {
			this.scrollToPoint(0, Math.round(this.carousel.clientWidth * pageIndex));
		} else {
			this.scrollToPoint(Math.round(this.carousel.clientHeight * pageIndex), 0);
		}
	}

	destroy() {
		this.carouselTrack.removeEventListener('scroll', this.onScroll);
		this.prevButton.removeEventListener('click', this.prev);
		this.nextButton.removeEventListener('click', this.next);
		this.pagination.delete();
	}
}
