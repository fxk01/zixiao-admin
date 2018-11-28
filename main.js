/**
 * 加载 require.config执行baseUrl为'js'，
 * baseUrl指的模块文件的根目录，可以是绝对路径或相对路径
 * 路由加载页面
 */

'use strict';
var routeJump = function() {
  var browser = navigator.appName,
      b_version = navigator.appVersion,
      version = b_version.split(';'),
      routeHref = window.location.href.split('/'),
      routeHtml;
  for(var j = 0; j < routeHref.length; j++) {
    if(routeHref[j].indexOf('.html') > 0) {
      routeHtml = routeHref[j].match(/\w+.html+/g)[0];
    }
  }
  if(typeof version[1] !== 'undefined') {
    var trim_Version = version[1].replace(/[ ]/g,'');
  }
  this.init = function() {
    var self = this;
    self._controlPage();
  };
  this._trueAndFalseIe = function(type) {
    var msIe = type.replace(/[.][\w]/g, '');
    if(browser === 'Microsoft Internet Explorer') {
      var data = {
        MSIE6: 'MSIE6.0',
        MSIE7: 'MSIE7.0',
        MSIE8: 'MSIE8.0',
        MSIE9: 'MSIE9.0'
      };
      return data[msIe] ? data[msIe] : false;
    }
  };
  this._controlPage = function() {
    trim_Version && this._trueAndFalseIe(trim_Version) ? window.location.href = '../../src/404/404.html' : console.log('浏览器版本正常！');
    var cacheTimePage = new Date().getTime();
    this.objHtml = {
      index: 'index.html',
      detail: 'detail.html',
      header:'header.html',
      login:'login.html',
      banner:'banner.html',
      topic:'topic.html',
      knowtree:'knowtree.html',
      addqsn:'addqsn.html',
      au_askqsn:'au_askqsn.html',
      au_answer:'au_answer.html',
      // au_discuss:'au_discuss.html',
      re_qsn:'re_qsn.html',
      re_answer:'re_answer.html',
      switch:'switch.html',
      points:'points.html'
    };
    var load_js;
    for(load_js in this.objHtml) {
      if(routeHtml === this.objHtml[load_js]) {
        var _loadJs = load_js;
        console.log('../' + load_js + '/' + load_js + '.js?bust=' + cacheTimePage + '');
        require(['../' + load_js + '/' + load_js + '.js?bust=' + cacheTimePage + ''], function (obj) {
          // obj.topicPage.init();
          obj[''+_loadJs+'Page'].init();
          // obj[''+_loadJs+'Page'](obj);
          // $.AMUI.progress.start();
        });
      }
    }
  };
  this.init();
};
new routeJump();