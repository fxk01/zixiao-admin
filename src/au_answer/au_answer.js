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

  var au_answerPage = {
    init: function () {
      $("textarea").txtaAutoHeight();
      var self = this;
      var au_anscontent = CKEDITOR.replace("au_anscontent");
      $.AMUI.progress.start();
      $('.tpl-header-navbar').load("../header/header.html", function () {
        singleMode.out();
      });
      $.AMUI.progress.done();
      self.conTacTinFo();
      // $('#js-selected').unbind("change").on('change',function(){
      //   self.conTacTinFo();
      // });

      // 点击搜索框
      $('#body').on('click', '#header_searBtn', function () {
          self.conTacTinFo();
      });

      // 操作
      $('#body').on('click', '#edit', function () {
        self.editGoods($(this),au_anscontent);
      });

      // 审核通过
      $('#body').on('click', '#editSub', function () {
        var audstatus=7;   //7:审核通过；  3：审核未通过（即：退回）；
        self.auditQaFn($(this),audstatus,'');
      });

      // 驳回
      $('#body').on('click', '#editCancel', function () {
        var that=$(this);
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
        var audstatus=3;   //7:审核通过；  3：审核未通过（即：退回）；
        var comment=$('#comment').val();
        self.auditQaFn($('#editCancel'),audstatus,comment);
      });

      // 取消退回
      $('#noCal').click(function () {
        $('#popupCancel').modal('close');
      })
    },


//    操作按钮  '#editFormUp'
    editGoods: function(self,au_anscontent) {
      $("#editFormUp").find('input[name="id"]').val(self.attr('data-aid'));
      $("#editFormUp").find('textarea[name="ask_content"]').val(self.attr('data-ask_content'));

      au_anscontent.setData(self.attr('data-content'));

      $("#editFormUp").find('#editSub').attr('data-aid',self.attr('data-aid'));
      $("#editFormUp").find('#editCancel').attr('data-aid',self.attr('data-aid'));

      var au_status=self.attr('data-status');
      var au_deleted=self.attr('data-deleted');

        if(au_deleted=='1'){
            $("#editFormUp").find('#editSub').attr('disabled','disabled');
            $("#editFormUp").find('#editCancel').attr('disabled','disabled');
            // alert('已删除');
        }else if(au_status=='7'){
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
      singleMode.ajaxFun(singleMode.url + 'audit/qa', { aid:self.attr('data-aid'),status: audstatus,comment:comment}, 'get', function(json) {
        if(json['ok'] === true && json['code']===1000) {
          $('#my-popup').modal('close');   //关闭操作弹框；
          $('#popupCancel').modal('close');
          au_answerPage.conTacTinFo();
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

        var keyword=$('#keywordInp').val()?$('#keywordInp').val():'';
        var start_time=$('#timeInpStart').val()?$('#timeInpStart').val():'';
        var end_time=$('#timeInpEnd').val()?$('#timeInpEnd').val():'';
        var operator=$('#runner').val()?$('#runner').val():'';

      var status=$('#js-selected').children('option:selected').val();
      // '' : 全部, 2 : 待审核, 3 : 未通过， 7：已通过
      if(status=="1"){
        status='';
      }
      var pages = '';
      var jsonList1='';
      var jsonList = '';
      var pagesize=6;
      var reg5=/(\*\*\*anonymity\*\*\*[^*]*\*\*\*anonymity\*\*\*)/g;
      var pingFang=/(')/g;

        // todo/answer/data/all
        singleMode.ajaxFun(singleMode.url + 'search/qa/audit', {page: 1, pagesize: pagesize,status:status,type:2,keyword:keyword,start:start_time,end:end_time,operator:operator}, 'get', function(json) {
        if(json['ok'] === true && json.data) {
          $('#pageCurr').children().remove();
          if(json['totals'] > pagesize) {
            $('#pageCurr').append(' <div class="am-fr" id="page0">\n' +
              '<ul class="am-pagination tpl-pagination"></ul>\n' +
              '</div>')
          };
          var _data = json;
          var numS = pagesize;
          var pages = Math.ceil(json['totals'] / numS);
          var thisDate = function(curr) {
            if(curr > 1) {
              that.postOrder2(status, curr, numS,operator,keyword,start_time,end_time);
            } else {
              jsonList1 = json.data;
              jsonList1.forEach(function (item) {
                item['a_status']=singleMode.getStatus_au(item['status']);
                if(item['content'].indexOf("'")){
                    item['content']=item['content'].replace(pingFang,'"');
                }

                item['a_content']=item['content'].replace(reg5,'     补充：');
                item['au_deleted']=singleMode.getDelete_au(item['deleted']);

                if(item['status']=='3' && item['comment']){
                  // nopass
                  $("#nopass").show();
                }
              })
              jsonList=jsonList1;
              var interText = doT.template($('#calendarTpl').text());
              $('#calendarTbBody').html(interText(jsonList));
            }
          };

          var $page = $("#page0").page({
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
                  item['a_status']=singleMode.getStatus_au(item['status']);
                  if(item['content'].indexOf("'")){
                      item['content']=item['content'].replace(pingFang,'"');
                  }

                  item['a_content']=item['content'].replace(reg5,'     补充：');
                  item['au_deleted']=singleMode.getDelete_au(item['deleted']);
                  if(item['status']=='3' && item['comment']){
                    // nopass
                    $("#nopass").show();
                  }
                })
                jsonList=jsonList1;
                var interText = doT.template($('#calendarTpl').text());
                $('#calendarTbBody').html(interText(jsonList));
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
          }
        } else {
          $('#calendarTbBody').html(json.msg);
          return false;
        }
      });
    },
    postOrder2: function(status, curr, numS,operator,keyword,start_time,end_time) {
      singleMode.ajaxFun(singleMode.url + 'search/qa/audit', { status: status, page: curr, pagesize: numS,type:2,keyword:keyword,start:start_time,end:end_time,operator:operator}, 'get', function(json) {
        if(json['ok'] === true && json.data) {
          var jsonList1 = json.data;
          var reg5=/(\*\*\*anonymity\*\*\*[^*]*\*\*\*anonymity\*\*\*)/g;
          var pingFang=/(')/g;
          jsonList1.forEach(function (item) {
            item['a_status']=singleMode.getStatus_au(item['status']);
              if(item['content'].indexOf("'")){
                  item['content']=item['content'].replace(pingFang,'"');
              }

              item['a_content']=item['content'].replace(reg5,'     补充：');
            item['au_deleted']=singleMode.getDelete_au(item['deleted']);
            if(item['status']=='3' && item['comment']){
              // nopass
              $("#nopass").show();
            }
          })
          var jsonList=jsonList1;
          var interText = doT.template($('#calendarTpl').text());
          $('#calendarTbBody').html(interText(jsonList));
        } else {
          $('#calendarTbBody').html(json.msg);
          return false;
        }
      });

    },
  };
  module.exports = {
    au_answerPage: au_answerPage
  };
});