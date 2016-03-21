function Corleone(selector, data){
	this.events = false || data.events;
	this.state = false || data.state;
	this.methods = false || data.methods;
	this.readyEvent = false || data.ready;
	this.elements = document.querySelectorAll(selector);
	this.cache = {};
}
Corleone.prototype = {
	ready : function(){
		if(this.readyEvent){
			var elements = (this.elements.length == 1 ? this.elements[0] : this.elements);
			this.readyEvent.bind(Object.assign(this.state, this.methods))(elements);
		}
	},
	addEvents : function(){
		// Apply event handlers
		if(this.events){
			for (var i = 0; i < this.elements.length; i++) {
				for(eventName in this.events){
					this.cache[eventName] = function(e){
						this.proto.events[eventName].bind(Object.assign(this.proto.state, this.proto.methods))(e, this.element);
					};
					this.elements[i].addEventListener(eventName, this.cache[eventName].bind({proto : this, element : this.elements[i]}), false);
				}
			};
		}
	},
	addMethods : function(){
		// Bind custom methods
		if(this.methods){
			var foundDon = {
				events : [],
				injects : []
			};
			var getDonDOM = function(element, selector, dump){
				var query = element.querySelectorAll(selector);
				query = Array.prototype.slice.call(query);
				foundDon[dump] = foundDon[dump].concat(query);
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
				var attribute = foundDon.events[x].getAttribute('data-don-inject').replace(/ /g,'');
				var injects = attribute.split(',');
				for (var i = injects.length - 1; i >= 0; i--) {
					var donInject = injects[i].split(':');
					switch(donInject[0]){
						case 'text' :
							foundDon.injects[x].textContent = this.state[donInject[1]];
						break;

						default :
							foundDon.injects[x].setAttribute(donInject[0], donInject[1]);
					}
				};
			};
		}
	}
}

var Don = function(selector, data){
	var performance = new Performance('Don Exec for '+selector, 3);

	var corleone = new Corleone(selector, data);
	corleone.addEvents();
	corleone.addMethods();
	corleone.ready();

	performance.measure();
	return corleone;
}
// --- NOTES ---
// Find alternative for Object.assign, browser support too crappy