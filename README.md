# Corleone
Master the DOM, with the Don's help.

A different lightweight DOM manipulation/event library, somewhat simulair to Vue.

**Take note:** This library is still under development and won't work on IE (would've been a miracle if it did).

## Why Corleone?
Corleone forces a workflow that'll keep your code clean and your variables and functions where they're supposed to be (read: Less global/big scoped variables needed) while also keeping filesize to the very minimum and execution time near zero.

Corleone is not (yet) a replacement for jQuery, many useful methods for DOM manipulation are still missing, I suppose you could use them together if you know your JavaScript/jQuery well, if you're a novice you might run into some logic problems.

## Todo
- Variable(state) injection into dom elements
- Data binding
- Document API
- Many more things...

## Usage and examples
Create an element in the DOM
```html
<div id="test">
	<h1 data-don="click:test">1 (Click me)</h1> // Add events using data-don=eventName:methodName
</div>
```

Call the Don, he'll take care of business, just tell him which element to use, define state, define methods and events
```javascript
Don('#test', {
	state : {
		increment : 1
	},
	methods : {
		test : function(e){
			console.log('Test method called');
		}
	},
	events : {
		mouseup : function(e, element){ // Retrieve the event data and element (#test in this case)
			this.increment += 1; // Manipulate state using "this"
			this.test(); // Call any of the methods the same way
			element.querySelector('h1').textContent = this.increment;
		}
	}
});
```

### Using classes
```javascript
Don('.test', {
	ready : function(elements){ // The ready event is called on load
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.background = "#3498db";
			elements[i].style.color = "#ffffff";
		};
	},
	state : {
		increment : 1
	},
	events : {
		mouseup : function(e, element){ // element will be the clicked element, not all elements with .test
			this.increment += 1;
			console.log({old : this.increment-1, new : this.increment}, element);
		}
	}
});
```

### Other actions
Change state outside the Don
```javascript
var test = Don('#test', {
    state : {
        testVar : 'uwot'
    }
});

test.state.testVar = 'm9'; // Updates the state, doesn't push these changes to the DOM (yet)
```




