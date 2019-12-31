// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

// Date Prototypes
Date.prototype.minus = function (count) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'days';
  var time = this.getTime();
  var day = 86400000;
  var week = 7 * day;
  var month = 30 * day;
  var year = 365 * day;

  if (['days', 'day'].includes(type)) {
    return new Date(time - count * day);
  }

  if (['weeks', 'week'].includes(type)) {
      return new Date(time - count * week);
  }

  if (['months', 'month'].includes(type)) {
    return new Date(time - count * month);
  }

  if (['years', 'year'].includes(type)) {
    return new Date(time - count * year);
  }
};

Date.prototype.add = function (count) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'days';
  var time = this.getTime();
  var day = 86400000;
  var week = 7 * day;
  var month = 30 * day;
  var year = 365 * day;

  if (['days', 'day'].includes(type)) {
    return new Date(time + count * day);
  }

  if (['weeks', 'week'].includes(type)) {
      return new Date(time + count * week);
  }

  if (['months', 'month'].includes(type)) {
    return new Date(time + count * month);
  }

  if (['years', 'year'].includes(type)) {
    return new Date(time + count * year);
  }
};


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
// Support component names relative to this directory:
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);
