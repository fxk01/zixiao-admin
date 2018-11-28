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

  $.fn.extend({
    txtaAutoHeight: function () {
      return this.each(function () {
        var $this = $(this);
        if (!$this.attr('initAttrH')) {
          $this.attr('initAttrH', $this.outerHeight());
        }
        setAutoHeight(this).on('input', function () {
          setAutoHeight(this);
        });
      });
      function setAutoHeight(elem) {
        var $obj = $(elem);
        return $obj.css({ height: $obj.attr('initAttrH'), 'overflow-y': 'hidden' }).height(elem.scrollHeight+20);
      }
    }
  });

  var re_qsnPage = {
    init: function () {
      $("textarea").txtaAutoHeight();
      var self = this;
      $.AMUI.progress.start();
      $('.tpl-header-navbar').load("../header/header.html", function () {
        singleMode.out();
      });
      $.AMUI.progress.done();
      self.conTacTinFo();
      $('#js-selected').unbind("change").on('change',function(){

        self.conTacTinFo();
      });


      // 操作
      $('#body').on('click', '#edit', function () {
        self.editGoods($(this));
      });

      // 审核通过
      $('#body').on('click', '#editSub', function () {
        var audstatus=2;   //2:审核通过；  3：审核未通过（即：退回）；
        self.auditQaFn($(this),audstatus,'');
      });

      // 驳回
      $('#body').on('click', '#editCancel', function () {
        // var that=$(this);
        $('#my-popup').modal('close');
        // 填写驳回理由弹框
        // $('#popupCancel').css('z-index',1200);
        $('#popupCancel').modal({
          dimmer: false
        });
      });

      // 驳回折叠面板
      window.onload=function(){
        $('#web-nav').on('open.collapse.amui', function() {//open方法被调用时立即触发
          $("#web #web-icon").attr("class","am-icon-angle-down am-fr am-margin-right");
        }).on('close.collapse.amui', function() {//close方法调用时立即触发
          $("#web #web-icon").attr("class","am-icon-angle-right am-fr am-margin-right");
        });

        $('#bg-nav').on('open.collapse.amui', function() {
          $("#bg #bg-icon").attr("class","am-icon-angle-down am-fr am-margin-right");
        }).on('close.collapse.amui', function() {
          $("#bg #bg-icon").attr("class","am-icon-angle-right am-fr am-margin-right");
        });

        $('#database-nav').on('open.collapse.amui', function() {
          $("#database #database-icon").attr("class","am-icon-angle-down am-fr am-margin-right");
        }).on('close.collapse.amui', function() {
          $("#database #database-icon").attr("class","am-icon-angle-right am-fr am-margin-right");
        });
      },

        // textclick
        $('.textclick').click(function () {
          var clickTxt=$(this).attr('data-title');
          $('#comment').val(clickTxt);
        });

      // 确定驳回
      $('#sureCal').click(function () {
        var audstatus=3;   //2:审核通过；  3：审核未通过（即：退回）；
        var comment=$('#comment').val();
        self.auditQaFn($('#editCancel'),audstatus,comment);
      });

      // 取消退回
      $('#noCal').click(function () {
        $('#popupCancel').modal('close');
      })
    },


//    操作按钮  '#editFormUp'
    editGoods: function(self) {
      $("#editFormUp").find('input[name="id"]').val(self.attr('data-qid'));
      $("#editFormUp").find('textarea[name="content"]').val(self.attr('data-content'));
      $("#editFormUp").find('#editSub').attr('data-qid',self.attr('data-qid'));
      $("#editFormUp").find('#editSub').attr('data-cpnid',self.attr('data-cpnid'));

      $("#editFormUp").find('#editCancel').attr('data-qid',self.attr('data-qid'));
      $("#editFormUp").find('#editCancel').attr('data-cpnid',self.attr('data-cpnid'));

      var re_flowStatus=self.attr('data-flowStatus');
      var re_isclose=self.attr('data-isClose');

        if(re_isclose=='1'){
            $("#editFormUp").find('#editSub').attr('disabled','disabled');
            $("#editFormUp").find('#editCancel').attr('disabled','disabled');
            // alert('已删除');
        }else if(re_flowStatus=='2'){
            $("#editFormUp").find('#editSub').attr('disabled','disabled');
            $("#editFormUp").find('#editCancel').attr('disabled',false);
        }else{
            // alert('未删除');
            $("#editFormUp").find('#editSub').attr('disabled',false);
            $("#editFormUp").find('#editCancel').attr('disabled',false);
        }

      $('#my-popup').modal({
        dimmer: false
      });
      $("textarea").txtaAutoHeight();
    },

    // 审核通过 or 驳回
    auditQaFn:function (self,audstatus,comment) {
      singleMode.ajaxFun(singleMode.url + 'audit/cpnflow', { qid:self.attr('data-qid'),cpnid:self.attr('data-cpnid'), fstatus:audstatus,comment:comment}, 'get', function(json) {
        if(json['ok'] === true && json['code']===1000) {
          $('#my-popup').modal('close');   //关闭操作弹框；
          $('#popupCancel').modal('close');
          re_qsnPage.conTacTinFo();
          alert('成功！');
        } else {
          alert('失败！');
          // window.location.href = '../login/login.html';
        }
      });
    },

    /*
     审核列表（问题）
     */
    conTacTinFo: function () {
      var that = this;
      //1：待处理 2：已处理,举报通过 3：已处理,举报未通过  '':全部
      var fstatus=$('#js-selected').children('option:selected').val();
      if(fstatus=="4"){
        fstatus='';
      }

      var pages = '';
      var jsonList1='';
      var jsonList = '';
      var pagesize=8;
      // singleMode.parseURL('page')
      singleMode.ajaxFun(singleMode.url + 'todo/question/cpnflow/data/all', {page: 1, pagesize: pagesize,fstatus:fstatus}, 'get', function(json) {
        if(json['ok'] === true && json.data) {
          $('#page3Curr').children().remove();
          if(json['totals'] > pagesize) {
            $('#page3Curr').append(' <div class="am-fr" id="page3">\n' +
              '<ul class="am-pagination tpl-pagination"></ul>\n' +
              '</div>')
          };
          var _data = json;
          var numS = pagesize;
          var pages = Math.ceil(json['totals'] / numS);
          var thisDate = function(curr) {
            if(curr > 1) {
              that.postOrder2(fstatus, curr, numS);
            } else {
              jsonList1 = json.data;
              jsonList1.forEach(function (item) {
                item['re_status']=singleMode.getStatus_re(item['flowStatus']);
                item['re_isclose']=singleMode.getClosed_re(item['isClose']);
                  if(typeof (item['complainFlag']==='number')){
                      item['re_complain']=singleMode.getComplain_re(item['complainFlag']);
                  }else{
                      item['re_complain']=item['complainFlag'];
                  }
              })
              jsonList=jsonList1;
              var interText = doT.template($('#reCalendarTpl').text());
              $('#reCalendarTbBody').html(interText(jsonList));
            }
          };

          var $page = $("#page3").page({
            pages: pages,
            curr: 1,
            type: 'default',
            groups: 4,
            prev: '<',
            next: '>',
            first: '首页',
            last: '尾页',
            before: function(context, next) {
              if(_data.data.length <= pagesize) {
                jsonList1 = json.data;
                jsonList1.forEach(function (item) {
                  item['re_status']=singleMode.getStatus_re(item['flowStatus']);
                  item['re_isclose']=singleMode.getClosed_re(item['isClose']);
                    if(typeof (item['complainFlag']==='number')){
                        item['re_complain']=singleMode.getComplain_re(item['complainFlag']);
                    }else{
                        item['re_complain']=item['complainFlag'];
                    }

                })
                jsonList=jsonList1;
                var interText = doT.template($('#reCalendarTpl').text());
                $('#reCalendarTbBody').html(interText(jsonList));
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
          if(json['totals'] <= pagesize) {
            $page.remove();
          };


        } else {
          $('#reCalendarTbBody').html(json.msg);
          return false;
        }
      });
    },

    postOrder2: function(fstatus, curr, numS) {
      singleMode.ajaxFun(singleMode.url + 'todo/question/cpnflow/data/all', { page: curr, pagesize: numS ,fstatus:fstatus}, 'get', function(json) {
        if(json['ok'] === true && json.data) {
          var jsonList1 = json.data;
          jsonList1.forEach(function (item) {
            item['re_status']=singleMode.getStatus_re(item['flowStatus']);
            item['re_isclose']=singleMode.getClosed_re(item['isClose']);
              if(typeof (item['complainFlag']==='number')){
                  item['re_complain']=singleMode.getComplain_re(item['complainFlag']);
              }else{
                  item['re_complain']=item['complainFlag'];
              }
          });
          var jsonList=jsonList1;
          var interText = doT.template($('#reCalendarTpl').text());
          $('#reCalendarTbBody').html(interText(jsonList));
        } else {
          $('#reCalendarTbBody').html(json.msg);
          return false;
        }
      });
    },
  };
  module.exports = {
    re_qsnPage: re_qsnPage
  };
});