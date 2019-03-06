class ScrollList {
	constructor(item) {
		this.container = item;
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
		const scroll = this.container.scrollLeft;
		let closestStart;
		let closestEnd;
		let i = 0;
		while (this.container.children[i].offsetLeft <= scroll) {
			closestStart = this.container.children[i].offsetLeft;
			closestEnd = closestStart + this.container.children[i].clientWidth;
			i++;
		}
		console.log(closestStart);
		this.container.scrollTo({top: 0, left: this.getClosestSide(closestStart, closestEnd, scroll), behavior: 'smooth'})
	}

	watchScroll() {
		window.clearTimeout(this.isScrolling);
		this.isScrolling = setTimeout(this.getLeftItemOffset.bind(this), 100);
	}

	addListeners() {
		this.container.addEventListener('scroll', this.watchScroll.bind(this));
	}

	removeListeners() {
		this.container.removeEventListener('scroll', this.watchScroll);
	}

	destroy() {
		this.removeListeners();
	}
}

document.querySelectorAll('.scroll').forEach(item => new ScrollList(item));
