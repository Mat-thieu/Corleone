# Corleone
Master the DOM, with the Don's help.

A different lightweight DOM manipulation/event library, somewhat simulair to Vue although far less advanced.

**Take note:** This library is still under development, as of now I can see there being some security risk so don't use this version in production.

---

## Why Corleone?
Corleone forces a workflow that'll keep your code clean and your variables and functions where they're supposed to be (read: Less global/big scoped variables needed) while also keeping filesize to the very minimum and execution time near zero.

Corleone is not (yet) a replacement for jQuery, many useful methods for DOM manipulation are still missing, I suppose you could use them together if you know your JavaScript/jQuery well, if you're a novice you might run into some logic problems.

---

## Browser Support
All modern/mobile browsers + IE 10 and up (Added a polyfill for Object.assign())

---

## Todo
- Find a different solution for don-bind (an efficient solution also)
- Figure out in-DOM looping
- Make a Todo list
- Make it so you can pass an array into the bind function like this don-bind="text:[increment, info]" while still allowing don-bind="text:increment" for singles
- Absolute buttloads, but I'll get there

---

## API
Corleone has functionality in both JS and the DOM, though DOM functionality will only get initialized through creating a new Don element in your JavaScript code.

**Anything could change before the final release**

### JS
Initialize Don on the given selection
```javascript
Don([element], [options]);

// Examples
Don('.element',{options});
Don('#element',{options});
Don('div',{options});

```

##### State
State variables can be accessed throughout the Don-DOM (when bound) and in your methods/events using this.stateVariableName, updating state in any way will update all bindings.
```javascript
Don('#example', {
	state : {
		[variables]
	}
});
```
You can even update state outside of Don()
```javascript
var exampleDon = Don('#example', {
	state : {
		test : 'Default'
	}
});
exampleDon.test = 'Not default anymore!';
```

##### Methods
Used as callbacks for events, more information about event binding can be found below.
```javascript
Don('.example', {
	state : {
		linkLocation : ''
	}
	methods : {
		someoneClickedMe : function(event, element){
			event.preventDefault();
			console.log('Someone clicked', element);
			this.linkLocation = element.href; //Changes state to element's href value
		}
	}
});
```
In the DOM you would bind the someoneClickedMe method to the click or mouseup event.

##### Events
Events are bound directly to the Don element and are sometimes influenced by state changes or ready events.
```javascript
Don('#example', {
	events : {
		before : function(donElement){ // Fired before anything else happens
			console.info('Initializing Don() instance on', donElement);
		},
		ready : function(donElement){ // Fired when Don has fully executed
			console.info(donElement, 'ready')
		},
		mouseup : function(e, element){ // Or simply bind any regular event to the Don element (events supported by addEventListener)
			console.log(element, 'was clicked!');
		}
	}
});
```

### DOM
Lets assume this is our Don instance for this part of the docs
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
		<h2 don-bind="text:increment, text:info, data-increment:increment" data-increment="{increment}">{increment}</h2>
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
		<h2 don-bind="text:increment, text:info">{increment}</h2>
		<small don-bind="text:doubleIncrement">x2 = {doubleIncrement}</small>
	</div>
</div>
```
You can bind multiple events by comma seperating them (e.g. don-on="mouseup:increment, mouseover:hover")


---

## Examples
**Examples shown here are for the current version of Corleone, at the final release it might all be completely different**
Create an element in the DOM
```html
<div id="test">
	<h1 don-on="click:test" don-bind="text:increment">{increment} (Click me)</h1> // Add events using data-don-event=eventName:methodName
</div>
```

Call the Don, he'll take care of business, just tell him which element to use, define state, define methods and events
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




