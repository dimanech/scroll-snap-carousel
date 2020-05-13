# Snap scroll carousel

"Classical" carousels huge libraries could be easily replaced by native scroll functionality. This would contribute to grater UX, better performance and progressive enhancement approach.

You probably know that scroll is very complex functionality that very hard to implement without access to native OS API. 
That's why native scroll is more comfortable for the user (on modern desktop and mobile) than any point-and-click functionality.

## CSS snap points

Carousel in most cases could be substituted with horizontal scroll view, but in classical "carousels", you are expected some snapping of scrolling.

And it has been 3 years or so when this API available for browsers. 

* [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type)
* [W3C v1](https://www.w3.org/TR/2015/WD-css-snappoints-1-20150326/)
* [W3C v2](https://www.w3.org/TR/css-scroll-snap-1/)
* [Caniuse](https://caniuse.com/#feat=css-snappoints)

## Features

* Progressive enhancement, basic functionality available without JS
* Responsive
* LTR and RTL directions support
* AAA ARIA accessibility (focus of elements and visibility for AT)
* Could be controlled from keyboard (tab, arrows), mouse, touch etc. without any JS logic (Chrome has bug with arrows navigation)
* Scroll up to all elements, not just 1 at the time

### Infinite scrolling

Could be implemented but would be performance fall. Since it based on scroll we have boundaries of the list.

## Browser compatibility

As progressive enhancement supports in every browsers from Netscape navigator 1.0 to latest Firefox.

Progressive enhancement and graceful degradation: 

1) if no JS available it would be just native scroll;
2) if scroll snap CSS API available it would be snapped to declared values;
3) if JS and snap scroll available than user will have Buttons and pagination functionality improvements over native scroll.

With polyfill tested:

* FF (68.0), Chrome (75.0.3770.142) Linux
* FF (68.0), Chrome (75.0.3770.142) MacOS

Note! Each OS and OS preferences resulted on different, but always familiar scroll behavior.

Safari 12.1.1 not work smooth scroll (could be polyfiled)
Edge not work smooth scroll
11 not work smooth scroll

## License

MIT D.Nechepurenko 2020
