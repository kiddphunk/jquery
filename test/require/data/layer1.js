//Example layer file.

"use strict";
/*global require: false */

require.pause();

require.def("alpha",
    ["beta", "gamma"],
    function (beta, gamma) {
        return {
            name: "alpha",
            betaName: beta.name
        };
    }
);

require.def("beta",
    ["gamma"],
    function (gamma) {
        return {
            name: "beta",
            gammaName: gamma.name
        };
    }
);

require.def("gamma",
    ["epsilon"],
    function (epsilon) {
        return {
            name: "gamma",
            epsilonName: epsilon.name
        };
    }
);

require.resume();
