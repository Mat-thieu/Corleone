function Performance(name, decimals){
	this.name = name;
	this.decimals = decimals || 2;
	this.start = performance.now();
	this.end = 0;
}
Performance.prototype = {
	measure : function(){
		this.end = performance.now();
		console.info('"'+this.name+'" performance : '+(this.end-this.start).toFixed(this.decimals)+' ms');
	}
}