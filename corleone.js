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
			this.readyEvent.bind(this.state)(elements);
		}
	},
	build : function(){
		// Apply event handlers
		for (var i = 0; i < this.elements.length; i++) {
			if(this.events){
				for(eventName in this.events){
					this.cache[eventName] = function(e){
						this.proto.events[eventName].bind(Object.assign(this.proto.state, this.proto.methods))(e, this.element);
					};
					this.elements[i].addEventListener(eventName, this.cache[eventName].bind({proto : this, element : this.elements[i]}), false);
				}
			}
		};
		// Bind custom methods
		if(this.methods){
			var foundDonElements = [];
			for (var i = 0; i < this.elements.length; i++) {
				var query = this.elements[i].querySelectorAll('[data-don]');
				query = Array.prototype.slice.call(query);
				foundDonElements = foundDonElements.concat(query);
			};
			foundDonElements.forEach(function(element, index){
				var donAction = element.getAttribute('data-don').split(':');
				element.addEventListener(donAction[0], this.methods[donAction[1]], false);
			}.bind(this));
		}
	}
}
var Don = function(selector, data){
	var performance = new Performance('Don Exec for '+selector, 3);

	var corleone = new Corleone(selector, data);
	corleone.build();
	corleone.ready();

	performance.measure();
	return corleone;
}
// --- NOTES ---
// Find alternative for Object.assign, browser support too crappy