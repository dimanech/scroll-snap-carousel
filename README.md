# Snap scroll carousel

It has been long ago that I was start thinking that classical carousel is absolutely redundant thing.
It could be fully replaced by native scroll functionality - that would contribute to grater UX than this, old stuff button navigating only carousels.
You probably know that scroll is very complex function that very hard to implement without access to native OS API. 
That's why native scroll is more comfortable for the user (on modern desktop and all mobile) than any button-driven-functionality.

## Snap scroll

It has been 3 years of so when this API available for browsers. 
It is browser adopted extension over native scroll API with what you could control scroll functionality from CSS.

* MDN https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type
* W3C v1 https://www.w3.org/TR/2015/WD-css-snappoints-1-20150326/
* W3C v2 https://www.w3.org/TR/css-scroll-snap-1/
* Caniuse https://caniuse.com/#feat=css-snappoints

### Infinite scrolling

I do not know why it marquee pattern even needed, especially for carousels, 
that mostly represent huge content, that not permanent visible for the user.

For that type of content it is more important to browse UX than "auto scrolling".

## Browser support

As progressive enhancement supports in every browsers from Netscape navigator 1.0 to latest Firefox.

It is progressive enhancement component. 
If no JS available it would be just native scroll. 
If scroll snap CSS API available it would be snapped to declared values.
If JS and snap scroll available than user will have Buttons and pagination functionality improvements over regular scroll.

With polyfill tested:

* FF (68.0), Chrome (75.0.3770.142) Linux
* FF (68.0), Chrome (75.0.3770.142) MacOS

Safari 12.1.1 not work smooth scroll (could be polyfilled)
Edge not work smooth scroll
11 not work smooth scroll

Snap scroll support https://caniuse.com/#feat=css-snappoints

## License

MIT D.Nechepurenko 2019
