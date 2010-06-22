module("require");

test("simple", function() {
	expect(4);
	stop();

	require({
	    baseUrl: "./data/"    
	  },
	  ["require", "simple", "dimple", "func"],
	  function(require, simple, dimple, func) {
	    equals( simple.color, 'blue', 'Color is blue' );
	    equals( dimple.color, 'dimple-blue', 'Color is dimple-blue' );
	    equals( func(), 'You called a function', 'Check function call' );
          }
	);

        jQuery(function() {
	    equals( require("dimple").color, 'dimple-blue', 'Color is dimple-blue after ready' );            
            start();
        });
});

test("jquery as a module", function() {
	expect(1);
	stop();

	require({
	    baseUrl: "./data/"    
	  },
	  ["jquery"], function(jq) {
	    jq( function() {
                equals( jq('#qunit-header').length, 1, 'One header element found' );
                start();
            } );
          }
	);
});

test("circular", function() {
	expect(5);
	stop();

	require({
	    baseUrl: "./data/"    
	  },
	  ["require", "two", "funcTwo", "funcThree"],
	  function(require, two, funcTwo, funcThree) {
	    var args = two.doSomething(),
	        twoInst = new funcTwo("TWO");
	    equals( args.size, 'small', 'Size is small' );
	    equals( args.color, 'redtwo', 'Color is redtwo' );
	    equals( twoInst.name, 'TWO', 'Name is TWO' );
	    equals( twoInst.oneName(), 'ONE-NESTED', 'Name is ONE-NESTED' );
	    equals( funcThree('THREE'), 'THREE-THREE_SUFFIX', 'Function is THREE-THREE_SUFFIX' );
	    start();
          }
	);
});


test("dependency overlap", function() {
	expect(4);
	stop();

	require({
	    baseUrl: "./data/"    
	  },
	  ["require", "uno"],
	  function(require, uno) {
	    //First confirm there is only one script tag for each
	    //module:
	    var scripts = document.getElementsByTagName("script"),
	        i, counts = {}, modName, props, something, max = 0,
	        something = uno.doSomething();
	    for (var i = scripts.length - 1; i > -1; i--) {
	      modName = scripts[i].getAttribute("data-requiremodule");
	      if (modName) {
	        if (!(modName in counts)) {
	          counts[modName] = 0;
	        }
	        counts[modName] += 1;
	      }
	    }

	    //Now that we counted all the modules make sure count
	    //is always one.
	    for (prop in counts) {
	      if (counts[prop] > max) {
	        max = counts[prop];
	      }
	    }

	    equals( max, 1, 'Check only one script per module' );
	    equals( uno.name, "uno", 'Uno\'s name is uno' );
	    equals( something.dosName, 'dos', 'dosName is dos' );
	    equals( something.tresName, 'tres', 'tresName is tres' );
	    start();
          }
	);
});

test("pause/resume for built modules", function() {
	expect(8);
	stop();

	require({
	    baseUrl: "./data/"    
	  },
	  ["require", "layer1"],
	  function(require) {
	    require(["alpha", "beta", "gamma", "epsilon"],
	      function (alpha, beta, gamma, epsilon) {
	        equals( alpha.name, 'alpha', 'Name is alpha' );
	        equals( alpha.betaName, 'beta', 'Name is beta' );
	        equals( beta.name, 'beta', 'Name is beta' );
	        equals( beta.gammaName, 'gamma', 'Name is gamma' );
	        equals( gamma.name, 'gamma', 'Name is gamma' );
	        equals( gamma.epsilonName, 'epsilon', 'Name is epsilon' );
	        equals( epsilon.name, 'epsilon', 'Name is epsilon' );

	        var regExp = /alpha|beta|gamma/, i, failed = false,
	            scripts = document.getElementsByTagName("script");
	        for (i = scripts.length - 1; i > -1; i--) {
		    failed = regExp.test(scripts[i].src);
	        }
	        equals( failed, false, 'No script tags for built modules in layer1' );

	        start();
	      }
	    );
          }
	);
});



