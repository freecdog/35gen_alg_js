$('#function_execute').click(function() {
		resetDiagram();
		
		var func = createDrawnFunction();
		
		if (! func) {
			return false;
		}

		createDiagram(func);
		
		/*...*/
		
}

function createDrawnFunction() {
	var function_definition = $('#function_definition').val();

	var func = function(x) {
		var y = 0;
		
		eval('y = ' + function_definition + ';');
		
		return y;
	};
	
	// validate the function
	try {
		eval(func(1)); 
	}
	catch (e) {
		// this function is not valid JavaScript code, so alert the user and exit the function
		alert(e);
		
		return null;
	}
	
	return func;
}

function createDiagram(func) {
	// create the function's x/y coordinates
	var data = [];
	
	for (var i = 0; i < canvas_width; i++) {
		var e = { 
			x: i, 
			y: func(i)		// y = f(x);
		};
		
		if (e.y > bound_y_max) {
			bound_y_max = e.y;
		}
		else if (e.y < bound_y_min) {
			bound_y_min = e.y;
		}
		
		data.push(e);
	}

	/*...*/
}

/*

<select id="function_samples">
	<option>Math.sin(x / 100)</option>
	<option>-x * x + 10 * x - 10</option>
	<option>(x - 350)*(x - 350) * Math.cos(x / 100) * -1 * Math.sin(x / 100)</option>
	<option>Math.sin(Math.pow(x, Math.E) / (1500 * 1500))</option>
	<option>Math.abs(x - 350)</option>
	<option>Math.abs(x - 350) * Math.sin(x / 100)</option>
	<option>
		function(){
			var bandPass = 0.3
			var y = Math.sin(x / 30);
			return (y > bandPass) ? bandPass : (y &lt; -bandPass) ? -bandPass : y;
		}()
	</option>
</select>

*/