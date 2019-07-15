class ScrollList {
	constructor(item) {
		this.carousel = item;
		this.addListeners();
	}

	//getItems() {
	//	this.container.childElementCount
	//}

	getClosestSide(start, end, point) {
		const curs = point - start;
		const stop = end - start;
		return stop / curs > 2.5 ? start : end; // more then median
	}

	// scrollDirection

	// if last item should scroll to last

	getLeftItemOffset() {
		const scroll = this.carousel.scrollLeft;
		let closestStart;
		let closestEnd;
		let i = 0;
		while (this.carousel.children[i].offsetLeft <= scroll) {
			closestStart = this.carousel.children[i].offsetLeft;
			closestEnd = closestStart + this.carousel.children[i].clientWidth;
			i++;
		}
		console.log(closestStart);
		this.carousel.scrollTo({top: 0, left: this.getClosestSide(closestStart, closestEnd, scroll), behavior: 'smooth'})
	}

	watchScroll() {
		window.clearTimeout(this.isScrolling);
		this.isScrolling = setTimeout(this.getLeftItemOffset.bind(this), 120);
	}

	addListeners() {
		this.watchScroll = this.watchScroll.bind(this);

		this.carousel.addEventListener('scroll', this.watchScroll);
	}

	destroy() {
		this.carousel.removeEventListener('scroll', this.watchScroll);
	}
}

//document.querySelectorAll('.scroll').forEach(item => new ScrollList(item));
