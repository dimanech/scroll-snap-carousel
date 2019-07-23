# Snap scroll carousel

It is been a while since I start thinking that "classical" carousel is absolutely redundant thing. 
It could not provide good user experience with better than point-and-click inputs, they are very huge libraries, it try to handle complex user interactions logic by hisself, they are modify DOM and not play well with dynamic content etc. etc.

The point is they could be easily replaced by native scroll functionality - that would contribute to grater UX and better performance.

You probably know that scroll is very complex functionality that very hard to implement without access to native OS API. 
That's why native scroll is more comfortable for the user (on modern desktop and all mobile) than any point-and-click functionality.

But wait, basic scroll not act like carousel!

## CSS snap points the hero that we deserve

Yes, you are expected some snapping for carousels. It could be done... with CSS. 

It has been 3 years or so when this API available for browsers. 
It is browser adopted extension over native scroll API with what you could control scroll functionality from CSS.

* [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type)
* [W3C v1](https://www.w3.org/TR/2015/WD-css-snappoints-1-20150326/)
* [W3C v2](https://www.w3.org/TR/css-scroll-snap-1/)
* [Caniuse](https://caniuse.com/#feat=css-snappoints)

So as the result this progressive enhancement scroll and CSS based carousel.

## Features

* Progressive enhancement, it work even before JS is loaded
* Responsive
* LTR and RTL
* Plays well with dynamic content
* AAA ARIA accessibility
* Could be controlled from keyboard, mouse, touch etc.
* Scroll up to all elements, not just 1 at the time

But! It could not handle good infinite scroll...

### Infinite scrolling

I do not know why it marquee-like pattern even needed 
(if you have good navigation, but not browse by 1 item per click), especially for carousels, 
that mostly represents large content, that not permanent visible for the user, and should have feels of boundaries.

For that type of content more important good browsing UX than "auto scrolling".

## Browser support

As progressive enhancement supports in every browsers from Netscape navigator 1.0 to latest Firefox.

It is progressive enhancement component. So: 

* if no JS available it would be just native scroll;
* if scroll snap CSS API available it would be snapped to declared values;
* if JS and snap scroll available than user will have Buttons and pagination functionality improvements over native scroll.

With polyfill tested:

* FF (68.0), Chrome (75.0.3770.142) Linux
* FF (68.0), Chrome (75.0.3770.142) MacOS

Note! Each OS and OS preferences resulted on different, but always familiar scroll behavior.

Safari 12.1.1 not work smooth scroll (could be polyfiled)
Edge not work smooth scroll
11 not work smooth scroll

## License

MIT D.Nechepurenko 2019
