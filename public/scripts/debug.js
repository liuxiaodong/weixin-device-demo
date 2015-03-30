function dump_obj(myObject) {  
	var s = '';  
	for (var property in myObject) {  
		s += '<span>' + property +": " + myObject[property] + '</span>';  
	}  
	return s;
}

var i = 0;
console.log = (function(old_funct, div_log) { 
	return function(func, text) {
		old_funct(text);
		var p = '';
		if (i%2 == 0)
			p = '<p>';
		else
			p = '<p class=\'gray\'>';

		if (typeof text === "object") 
			div_log.innerHTML += p + func + ': ' + JSON.stringify(text) + '</p>';
			// div_log.innerHTML += p + dump_obj(text) + '</p>';
		else
			div_log.innerHTML += p + text + '</p>';
		
		div_log.scrollTop = div_log.scrollHeight;
		i += 1;
	};
} (console.log.bind(console), document.getElementById("debug")));
console.error = console.debug = console.info =  console.log
