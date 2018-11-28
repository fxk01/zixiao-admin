/**
 * detail业务逻辑
 */

'use strict';
require.config({
  baseUrl: '',
  urlArgs: 'bust=' + new Date().getTime(),
  waitSeconds: 0,
  paths: {
    jquery: "../../static/assets/js/jquery.min",
    amui: '../../static/assets/js/amazeui.min',
    utils: '../../index.min'
  },
  shim: {
    utils: ['jquery']
  }
});

define([
  'jquery',
  'amui',
  'utils',
  'module'
], function($, amui, obj, module) {
  var dataInter = {"name":"Jake","age":31};
  var interText = doT.template($("#interpolationtmpl").text());
  $("#interpolation").html(interText(dataInter));
  module.exports = {
    dataInter:dataInter
  };
});