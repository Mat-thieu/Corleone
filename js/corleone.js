// --- Polyfills ---
// Object.assign
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
// --- Helper functions--- (Will closure this later)
var DON = {
	instances : [],
	observe : function(){
		setInterval(function(){
			for (var i = DON.instances.length - 1; i >= 0; i--) {
				DON.instances[i].checkState();
			};
		}, 10);
	},
	compare : function (a, b) {
		var changes = [];
	    var aProps = Object.getOwnPropertyNames(a);

	    for (var i = 0; i < aProps.length; i++) {
	        var propName = aProps[i];
	        if (a[propName] !== b[propName]) changes.push(propName);
	    }

	    if(changes.length > 0) return {state : false, changes : changes};
	    else return {state : true};
	},
	template : function(str, vars, state){
		var templateVars = str.match(/{([^{}]+)}/g, "$1");
		for (var i = templateVars.length - 1; i >= 0; i--) {
			var index = vars.indexOf(templateVars[i].replace('{', '').replace('}', ''))
			if(index !== -1) str = str.replace(templateVars[i], state[vars[index]]);
		};
		return str;
	}
}



// --- Corleone ---
function Corleone(selector, data){
	this.events = false || data.events;
	this.state = false || data.state;
	this.oldState;
	this.methods = false || data.methods;
	this.elements = document.querySelectorAll(selector);
	this.bindings = {};
	this.cache = {};
}
Corleone.prototype = {
	ready : function(){
		this.oldState = Object.assign({}, this.state);
		if('ready' in this.events){
			var elements = (this.elements.length == 1 ? this.elements[0] : this.elements);
			this.events.ready.bind(Object.assign(this.state, this.methods))(elements);
		}
	},
	checkState : function(){
		var updateDom = function(changes){
			var domUpdate = new Performance('DOM update');
			var elementsToUpdate = [];
			for (var i = changes.length - 1; i >= 0; i--) {
				if(changes[i] in this.bindings){
					var binding = this.bindings[changes[i]];
					for (var x = binding.length - 1; x >= 0; x--) {
						elementsToUpdate.push(binding[x]);
					};
				}
			};
			for (var x = elementsToUpdate.length - 1; x >= 0; x--) {
				var attribute = elementsToUpdate[x].node.getAttribute('data-don-inject').replace(/ /g,'');
				var injects = attribute.split(',');
				var collections = {};

				for (var i = injects.length - 1; i >= 0; i--) {
					var donInject = injects[i].split(':');

					if(elementsToUpdate[x].subject == donInject[0]){
						if(!(donInject[0] in collections)) collections[donInject[0]] = [];
						collections[donInject[0]].push(donInject[1]);
					}
				}

				for(key in collections){
					switch(key){
						case 'text':
							var thisText = elementsToUpdate[x].node.getAttribute('data-don-original-text');
							elementsToUpdate[x].node.textContent = DON.template(thisText, collections[key], this.state);
							elementsToUpdate[x].node.setAttribute('data-don-original-text', thisText);
						break;

						default:
							var thisAttribute = elementsToUpdate[x].node.getAttribute('data-don-original-'+key);
							elementsToUpdate[x].node.setAttribute(key, DON.template(thisAttribute, collections[key], this.state));
							elementsToUpdate[x].node.setAttribute('data-don-original-'+key, thisAttribute);
					}
				}
			};
			domUpdate.measure();
		}.bind(this);

		var comparison = DON.compare(this.oldState, this.state);
		if(!comparison.state){
			updateDom(comparison.changes);
			this.oldState = Object.assign({}, this.state);
		}
	},
	addEvents : function(){
		// Apply event handlers
		if(this.events){
			for (var i = 0; i < this.elements.length; i++) {
				for(eventName in this.events){
					if(eventName !== 'ready'){
						this.cache[eventName] = function(e){
							this.proto.events[eventName].bind(this.proto.state)(e, this.element);
						};
						this.elements[i].addEventListener(eventName, this.cache[eventName].bind({proto : this, element : this.elements[i]}), false);
					}
				}
			};
		}
	},
	buildDonDOM : function(){
		// Bind custom methods
		if(this.methods){
			var foundDon = {
				events : [],
				injects : []
			};

			var getDonDOM = function(element, selector, output){
				var query = element.querySelectorAll(selector);
				query = Array.prototype.slice.call(query);
				foundDon[output] = foundDon[output].concat(query);
			}

			// Collect don elements
			for (var i = this.elements.length - 1; i >= 0; i--) {
				getDonDOM(this.elements[i], '*[data-don-event]', 'events');
				getDonDOM(this.elements[i], '*[data-don-inject]', 'injects');
			};
			// Handle event types
			for (var x = foundDon.events.length - 1; x >= 0; x--) {
				var attribute = foundDon.events[x].getAttribute('data-don-event').replace(/ /g,'');
				var events = attribute.split(',');

				for (var i = events.length - 1; i >= 0; i--) {
					var donEvent = events[i].split(':');
					foundDon.events[x].addEventListener(donEvent[0], this.methods[donEvent[1]], false);
				};
			};
			// Handle injection types
			for (var x = foundDon.injects.length - 1; x >= 0; x--) {
				var attribute = foundDon.injects[x].getAttribute('data-don-inject').replace(/ /g,'');
				var injects = attribute.split(',');
				var collections = {};

				for (var i = injects.length - 1; i >= 0; i--) {
					var donInject = injects[i].split(':');

					if(!(donInject[0] in collections)) collections[donInject[0]] = [];
					collections[donInject[0]].push(donInject[1]);

					if(!(donInject[1] in this.bindings)) this.bindings[donInject[1]] = [];
					this.bindings[donInject[1]].push({subject : donInject[0], node : foundDon.injects[x]});
				}

				for(key in collections){
					switch(key){
						case 'text':
							var thisText = foundDon.injects[x].textContent;
							foundDon.injects[x].textContent = DON.template(thisText, collections[key], this.state);
							foundDon.injects[x].setAttribute('data-don-original-text', thisText);
						break;

						default:
							var thisAttribute = foundDon.injects[x].getAttribute(key);
							foundDon.injects[x].setAttribute(key, DON.template(thisAttribute, collections[key], this.state));
							foundDon.injects[x].setAttribute('data-don-original-'+key, thisAttribute);
					}
				}
			};
		}
	}
}

var Don = function(selector, data){
	var performance = new Performance('Don Exec for '+selector, 3);

	var corleone = new Corleone(selector, data);
	corleone.addEvents();
	corleone.buildDonDOM();
	corleone.ready();

	DON.instances.push(corleone);

	performance.measure();
	return corleone.state;
}

// Enable the state change observer
DON.observe();

// --- NOTES ---
// Find alternative for Object.assign, browser support too crappy