/**
 * detail业务逻辑
 */

'use strict';
require.config({
  baseUrl: '',
  urlArgs: 'bust=' + new Date().getTime(),
  waitSeconds: 0,
  paths: {
    jquery:"../../static/assets/js/jquery.min",
    amui:"../../static/assets/js/amazeui.min",
    theme:"../../static/assets/js/theme",
    bootstrapfile:"../../static/assets/js/bootstrap-fileinput",
    doT:"../../static/assets/js/doT.min",
    amazeuipage:"../../static/assets/js/amazeui.page",
    cookiemin:"../../static/assets/js/cookie.min",
    appmin:"../../static/assets/js/app",
    common:"../../static/assets/js/common"
  },
  shim: {
    theme: ['jquery'],
    bootstrapfile: ['jquery'],
    amazeuipage: ['jquery'],
    appmin: ['jquery']
  }
});

define([
  'jquery',
  'amui',
  'theme',
  'bootstrapfile',
  'doT',
  'amazeuipage',
  'cookiemin',
  'appmin',
  'common',
  'module'
], function($, amui, theme, bootstrapfile, doT, amazeuipage, cookiemin, appmin, common, module) {

  var addqsnPage = {
    tids : Number(decodeURI(singleMode.parseURL('tid'))),
    init: function () {
      var self = this;
      $.AMUI.progress.start();
      var tids = self.tids;
      var toptitle = decodeURI(singleMode.parseURL('title'));
      if(toptitle){
        var toptitle1 = doT.template($('#toptitle1').text());
        $('#toptitle').html(toptitle1(toptitle));
        $('#gettitle').html(toptitle1(toptitle));
      }
      $('.tpl-header-navbar').load("../header/header.html", function () {
        singleMode.out();
      });
      $.AMUI.progress.done();
      self.conTacTinFo(tids,toptitle);
      $('#selectDd').on('click', function () { self.ddList($(this)); });
      $('#body').on('click', '.askTitle2', function () {
        $(this).parent().siblings().find('.askTitle').css("color","#fff");
        $(this).css("color","#ea6e0c");
        self.getAnsId($(this));
      });

      // 添加
      $('#body').on('click', '.addAns', function () {
        $(this).attr("id","newId");
        var aids=$(this).attr('data-id');
       
            self.addQsnAnFn(self,aids,tids,toptitle);
      });

      // 上移
      $('#body').on('click', '.upAns', function () {
        var aids=$(this).attr('data-aid');
        self.upQsnAnFn(self,aids,tids,toptitle);
      });

      // 下移
      $('#body').on('click', '.downAns', function () {
        var aids=$(this).attr('data-aid');
        self.downQsnAnFn(self,aids,tids,toptitle);
      });

      // 删除
      $('#body').on('click', '.delAns', function () {
        var aids=$(this).attr('data-aid');
        self.delQsnAnFn(self,aids,tids,toptitle);

      });

      $(document).keyup(function(event){
        if(event.keyCode ==13){
          $("#selectDd").trigger("click");
        }
      });
    },

    // 添加答案到此话题
    addQsnAnFn:function (self,aids,tids,toptitle) {
      singleMode.ajaxFun(singleMode.url + 'topic/add/answer', { aid:aids,tid: tids}, 'post', function(json) {
        if(json['ok'] === true && json['code']===1000) {
          self.conTacTinFo(tids,toptitle);
          $('#my-alert').modal('open');
          // alert('添加此问题和答案到该话题成功！')
        } else {
          // window.location.href = '../login/login.html';
        }
      });
    },

    // 上移
    upQsnAnFn:function (self,aids,tids,toptitle) {
      singleMode.ajaxFun(singleMode.url + 'topic/answer/move/up', { aid:aids,tid: tids}, 'post', function(json) {
        if(json['ok'] === true && json['code']===1000) {
          self.conTacTinFo(tids,toptitle);
          alert('上移成功！')
        } else {
          // window.location.href = '../login/login.html';
        }
      });
    },

    // 下移
    downQsnAnFn:function (self,aids,tids,toptitle) {
      singleMode.ajaxFun(singleMode.url + 'topic/answer/move/down', { aid:aids,tid: tids}, 'post', function(json) {
        if(json['ok'] === true && json['code']===1000) {
          self.conTacTinFo(tids,toptitle);
          alert('下移成功！');
        } else {
          // window.location.href = '../login/login.html';
        }
      });
    },

    // 删除这个话题下的问题答案
    delQsnAnFn:function (self,aids,tids,toptitle) {
      singleMode.ajaxFun(singleMode.url + 'topic/add/answer/cancel', { aid:aids,tid: tids}, 'get', function(json) {
        if(json['ok'] === true && json['code']===1000) {
          // alert('删除成功！')
          $('#my-alertdel').modal('open');
          self.conTacTinFo(tids,toptitle);

        } else {
          // window.location.href = '../login/login.html';
        }
      });
    },


    /*
     话题对应问题、答案列表
     */
    conTacTinFo: function (tids,toptitle) {
      var tid=tids;
      var page1=decodeURI(singleMode.parseURL('page'));
      var pages1 = '';
      var jsonList1 = '';
      singleMode.ajaxFun(singleMode.url + 'topic/echo/detail/answer', {page: page1, pagesize: 6, tid: Number(tid)}, 'get', function(json) {
        if(json['ok'] === true && json['data']) {
          jsonList1 = json.data;
          var interText1 = doT.template($('#calendarTpl').text());
          $('#calendarTbBody1').html(interText1(jsonList1));
          pages1 = Math.ceil(json.totals / 6);
          $('#page1').page({
            pages: pages1,
            curr: page1,
            first: '首页', //设置false则不显示，默认为false
            last: '尾页', //设置false则不显示，默认为false
            prev: '<', //若不显示，设置false即可，默认为上一页
            next: '>', //若不显示，设置false即可，默认为下一页
            groups: 3, //连续显示分页数
            jump: function(context, first) {
              if(!first) {
                window.location.href = '?page=' + context.option.curr+'&tid='+tids+'&title='+toptitle;
              }
            }
          });
        } else {
          $('#calendarTbBody1').html('msg:'+json.msg);
        }
      });
    },


// 关键字搜索2
    ddList: function(self) {
      var that=this;
      var val = $('#ddVale').val();
      if(val === '') {
        alert('订单号码不能为空！');
        return false;
      }
      singleMode.ajaxFun(singleMode.url + 'topic/search/question/dosrch/list', {input: val,page:1,pagesize:10}, 'get', function(json) {
        if(json['ok'] === true && json['data']) {
          $('#page2Curr').children().remove();
          if(json['qstnTotals'] > 10) {
            $('#page2Curr').append(' <div class="am-fr" id="page2">\n' +
              '<ul class="am-pagination tpl-pagination"></ul>\n' +
              '</div>')
          };

          var _data = json;
          var numS = 10;
          var pages = Math.ceil(json['qstnTotals'] / numS);
          var thisDate = function(curr) {
            if(curr > 1) {
              that.postOrder2(val, curr, numS);
            } else {
              var interText_sp = doT.template($('#calendarTp2').text());
              $('#calendarTbBody2').html(interText_sp(_data.data));
            }
          };

          self.$page = $("#page2").page({
            pages: pages,
            curr: 1,
            type: 'default',
            groups: 3,
            prev: '<',
            next: '>',
            first: '首页',
            last: '尾页',
            before: function(context, next) {
              if(_data.data.length <= 10) {
                var interText_sp = doT.template($('#calendarTp2').text());
                $('#calendarTbBody2').html(interText_sp(_data.data));
              }
              context.time = (new Date()).getTime();
              next();
            },
            render: function(context, $el, index) {
              if (index === 'last') {
                $el.find('a').html('最后一页');
                return $el;
              }
              return false;
            },
            after: function(context, next) {
              next();
            },
            jump: function(context,first) {
              if(!first) {
                thisDate(context.option.curr);
              }
            }
          });
          if(json['qstnTotals'] <= 10) {
            self.$page.remove();
          }
        } else {
          $('#calendarTbBody2').html('msg:'+json.msg);
          return false;
        }
      });
    },

    postOrder2: function(val, curr, numS) {
      singleMode.ajaxFun(singleMode.url + 'topic/search/question/dosrch/list', { input: val, page: curr, pagesize: numS }, 'get', function(json) {
        if(json['ok'] === true && json['data']) {
          var interText_sp = doT.template($('#calendarTp2').text());
          $('#calendarTbBody2').html(interText_sp(json.data));
        } else {
          // window.location.href = 'login.html';
          $('#calendarTbBody2').html('msg:'+json.msg);
        }
      });
    },

    getAnsId: function (self) {
      var that = this;
      var qid=self.attr('data-id');
      var page3=1;
      var pages3 = '';
      var pagesize3=7;
      singleMode.ajaxFun(singleMode.url + 'topic/search/question/answer/list', { qid: qid,page:page3, pagesize:pagesize3}, 'get', function(json) {
        if(json['ok'] === true && json['data']) {
            var jsonList3 = json.data;
            var interText3 = doT.template($('#calendarTp3').text());
            $('#calendarTbBody3').html(interText3(jsonList3));
            pages3 = Math.ceil(json.ansTotals / pagesize3);
            $('#page3').page({
              pages: pages3,
              curr: page3,
              first: '首页', //设置false则不显示，默认为false
              last: '尾页', //设置false则不显示，默认为false
              prev: '<', //若不显示，设置false即可，默认为上一页
              next: '>', //若不显示，设置false即可，默认为下一页
              groups: 3, //连续显示分页数
              jump: function(context, first) {
                // if(!first) {
                //   window.location.href = '?page=' + context.option.curr;
                // }
              }
            });
        } else {
          $('#calendarTbBody3').html('msg:'+json.msg);
          // window.location.href = '../login/login.html';
        }
      });
    }
  };
  module.exports = {
    addqsnPage: addqsnPage
  };
});