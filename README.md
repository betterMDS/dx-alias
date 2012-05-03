DX-Alias is a utility package for helping to make Dojo and AMD more friendly, with shorter names, more versatile methods, and combined modules.

Acknowledgements
----------------

Author: Mike Wilcox

Email: mike.wilcox@bettervideo.com

Website: http://bettervideo.com

DX-Alias is freely available under the same dual BSD/AFLv2 license as the Dojo Toolkit.

Installation
------------
Download the DX-Alias package, and install it in the same directory as your project.

NOTE
----
DX-Alias is currently under development, and this should be considered alpha, or pre-release at best. The code is used, and works, but could change. Tests and better documentation are still forth coming.

Description
-----------
DX-Alias is designed to make Dojo 1.7+ easier to use. The dom module, for example,
loads in a majority of the commonly used dom methods so several modules do not have
to be included in your AMD define. dojo/on is reworked so that it is more like the
traditional dojo.connect, including the context argument.

More information about each module (in alphabetical order) below.

dom
---

The dom module returns a simple function for creating nodes:

```javascript
define(['dx-alias/dom'], function(dom){
	dom('div', {css:'myClass', html:'text here'}, parentNode);
});
```
The property names are also shorter, so you can use "css" instead of "className", and "html" instead of "innerHTML".

The remaining methods are attached to the dom function, so they can be accessed like: 
```javascript
dom.style(node, prop, value);
dom.byId('myDiv');
dom.css(node, className, conditional);
// etc...
```

fx
--
This module is under development. There is one key method, flyout(), which handles something like a volume control slider "popup" (or flyout), by tracking if the mouse is over or clicking on the original button or the flyout.

has
---
Also under development, this will contain has() tests for some common CSS3 and HTML5 needs.

lang
----
A small combination of dojo/lang, with a few additional methods. 

log
---
Based on the original [consoleFix](http://clubajax.org/javascript-console-fix-v2-now-with-ios/). It has additional functionality that allows you to add logs to each module than can be turned off with a simple bit:

```javascript
define(['dx-alias/log'], function(logger){
	var log = logger('MOD', 1);
	log('do stuff'); // outputs: [MOD] do stuff
});
```
But changing the second argument to something falsey, the log for that module can be turned off: 
```javascript
define(['dx-alias/log'], function(logger){
	var log = logger('MOD', 0);
	log('do stuff'); // no output
});
```

main
----
Loads in all modules.

mouse
-----
Functionality not in Dojo. This module can be used to track mouse movements and events, and will return a modified even with information, like the x/y from the corner of a node, or the distance the mouse has moved. Think of it as a GUI-less dojo/dnd, that could be used for canvas or other uses. See the code for full details.

on
--
In Dojo 1.7, dojo.connect was broken into pieces. dojo/on only attaches to dom nodes or objects that are "Evented". To attach to plain old objects, you are supposed to use dojo/aspect. dx-alias/on recombines dojo/aspect and dojo/on, and adds an argument for context (this). It also uses the pause-able ability to the return handle by default.

dx-alias/on adds a simple event for "scroll" to make it easy to attach to dom scroll events. It has a "once" method for attaching to something and allowing for only one event to fire.

It also adds "multi", used like:
```javascript
var handle = on.multi(node, {
	'mousedown':'onMouseDown',
	'mouseup':this.onMouseUp
}, this);
handle.pause();
handle.resume();
handle.remove();
```

shim
----
dx-alias/shim is not a module, and returns nothing. It is a shim for browsers to add missing key functionality. Notably:
Function.bind
Array.forEach
Array.some
Array.indexOf
Array.isArray
TODO: remaining Array methods

string
------
This module adds dojo.string.trim, but otherwise, the remaining functionality is unique.
urlToObj
strToObj
normalize
urlEscape
urlEncode
trim

topic
-----
dx-alias/topic is a different implementation of dojo/topic, but taps into dojo/topic, so either can be used. It begins by adding the context argument (this), and changes publish and subscribe to the more finger friendly pub and sub. It also adds support for a multi subscribe:
```javascript
topic.sub.multi({
	'/on/data':'onData',
	'/on/hide':this.oHide
}, this);
```