var myPage = (function() {

    var that = {};

    that.init = function () {

		$( "#target" ).click(function() {
		  	alert( "Handler for .click() called." );
		});
		
		$( "#other" ).click(function() {
		 	 $( "#target" ).click();
		});

    }

    return that;

})();


