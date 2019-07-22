class ScrollCarousel {
	constructor(domNode) {
		this.carousel = domNode;
		this.carouselTrack = this.carousel.querySelector('[data-carousel-track]');
		this.prevButton = this.carousel.querySelector('[data-prev-button]');
		this.nextButton = this.carousel.querySelector('[data-next-button]');
		this.currentPage = 0;

		this.itemsContainerWidth = this.carouselTrack.offsetWidth;
		this.scrollEndSensitivity = 40;
	}

	init() {
		this.addEventListeners();
		this.updateCarouselState();
		this.carousel.classList.add('_inited');
		this.createPagination();
		this.setActivePagination();
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
		this.scrollStart = this.carouselTrack.scrollLeft <= 0;
		this.scrollEnd = totalScrollWidth + this.scrollEndSensitivity >= this.carouselTrack.scrollWidth;

		this.updateCarouselState();
		this.setActivePagination();
	}

	updateCarouselState() {
		if (this.carouselTrack.scrollWidth <= this.carouselTrack.clientWidth) {
			this.prevButton.setAttribute('disabled', 'true');
			this.nextButton.setAttribute('disabled', 'true');
			this.carousel.classList.remove('_prev-visible');
			this.carousel.classList.remove('_next-visible');
			return;
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
		this.scrollTo(this.carouselTrack.scrollLeft += this.carouselTrack.clientWidth)
	}

	prev() {
		this.scrollTo(this.carouselTrack.scrollLeft -= this.carouselTrack.clientWidth)
	}

	scrollTo(left) {
		// Safari old + Edge not smooth scroll
		if (typeof this.carouselTrack.scrollTo === 'function') {
			this.carouselTrack.scrollTo({
				top: 0,
				left: left,
				behavior: 'smooth'
			});
		} else {
			this.carouselTrack.scrollLeft = left;
		}
	}

	createPagination() {
		const fullScrollCount = Math.round(this.carouselTrack.scrollWidth / this.carousel.clientWidth);
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
		this.pagination.onclick = this.handlePageClick.bind(this);
	}

	setActivePagination() {
		const currentPage = Math.round(this.carouselTrack.scrollLeft / this.carousel.clientWidth);
		this.pagination.childNodes[this.currentPage].classList.remove('_current');
		this.pagination.childNodes[currentPage].classList.add('_current');
		this.currentPage = currentPage;
	}

	handlePageClick(event) {
		event.preventDefault();
		const eventTarget = event.target;
		let pageIndex = eventTarget.getAttribute('data-page');
		if (!pageIndex) {
			return;
		}
		this.scrollTo(Math.round(this.carousel.clientWidth * pageIndex));
	}

	destroy() {
		this.carouselTrack.removeEventListener('scroll', this.onScroll);
		this.prevButton.removeEventListener('click', this.prev);
		this.nextButton.removeEventListener('click', this.next);
		this.pagination.delete();
	}
}

document.querySelectorAll('[data-carousel]').forEach(carousel => new ScrollCarousel(carousel).init());
