# Corleone
Master the DOM, with the Don's help.

A different lightweight DOM manipulation/event library, somewhat simulair to Vue although far less advanced.

**This library is still under development, it's not remotely close to finished, don't use it in production.**

Corleone forces a workflow that'll keep your code clean and your functions and variables where they're supposed to be.


## Todo
- Find a different solution for don-bind (an efficient solution also)
- Figure out in-DOM looping
- Make a Todo list
- Add array support for state
- A lot more


## API

```

### DOM
Lets assume this is our Don instance
```javascript
var testId = Don('#test', {
	state : {
		increment : 1,
		doubleIncrement : 2
	},
	methods : {
		increment : function(e, element){
			this.increment += 1;
			this.doubleIncrement = this.increment*2;
		}
	}
});
```
##### "don-bind" state binding
Make state variable available to the defined attribute or text/html
```html
<div id="test">
	<div>
		<h2 don-bind="text:increment, data-increment:increment">{increment}</h2>
		<small don-bind="text:doubleIncrement">x2 = {doubleIncrement}</small>
	</div>
</div>
```
So first define where you want to bind the state variable (for example, as text or as the attribute data-increment) and then define which state variable you want to bind

##### "don-on" event/method binding
Define which event has to happen before a method has to get executed
```html
<div id="test">
	<div don-on="mouseup:increment">
		<h2 don-bind="text:increment">{increment}</h2>
		<small don-bind="text:doubleIncrement">x2 = {doubleIncrement}</small>
	</div>
</div>
```
You can bind multiple events by comma seperating them (e.g. don-on="mouseup:increment, mouseover:hover")


---

## Examples
Lets assume we have this element in the document
```html
<div id="test">
	<h1 don-on="click:test" don-bind="text:increment">{increment} (Click me)</h1> // Add events using data-don-event=eventName:methodName
</div>
```

Call the Don(), he'll take care of business, just tell him which element to use, define state, define methods and events
```javascript
Don('#test', {
	state : {
		increment : 1
	},
	methods : {
		test : function(e, element){
			console.log('Test method called');
		}
	},
	events : { // Bind events directly to the Don container like this
		mouseup : function(e, element){ // Retrieve the event data and element (#test in this case)
			this.increment += 1; // Manipulate state using "this"
			element.querySelector('h1').textContent = this.increment;
		}
	}
});
```

### Using classes
```javascript
Don('.test', {
	state : {
		increment : 1
	},
	events : {
		ready : function(elements){ // The ready event is called on load
			for (var i = 0; i < elements.length; i++) {
				elements[i].style.background = "#3498db";
				elements[i].style.color = "#ffffff";
			};
		},
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

test.testVar = 'm9'; // Updates the state, and updates the DOM
```




