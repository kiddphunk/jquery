require.def("two",
  ["one"],
  function(one) {
    return {
      size: "small",
      color: "redtwo",
      doSomething: function() {
        return require("one").doSomething();
      }
    };
  }
);
