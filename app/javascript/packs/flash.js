var componentRequireContext = require.context("components", false, /Flash.*$/);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);
