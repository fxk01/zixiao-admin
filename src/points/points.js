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
  'use strict';
  (function($){
    $.fn.disabled = function(status){
      var _ts = $(this);
      if(status===true) {
        _ts.addClass('disabled');
        _ts.attr('disabled',true)
      }
      if(status===false) {
        _ts.removeClass('disabled');
        _ts.attr('disabled',false)
      }

      return _ts.hasClass('disabled') || typeof _ts.attr('disabled')!=='undefined'
    };
    $.fn.valid = function(vas, callback){
      var form = $(this);
      var ctrls = form.find('[data-valid-control]');
      var isDiy = false;

      $.each(vas, function(key, val){
        if(vas[key].hasOwnProperty('success')) {
          return !(isDiy = true)
        }
      });

      $.each(ctrls, function(index, ele){
        var key = $(ele).attr('data-valid-control');
        $(ele).on('change', function(){
          if(!test(ele, key)) $(ele).focus()
        })
      });

      form.on('submit', function(ev){
        if(form.find('[type="submit"]').disabled()) {
          ev.preventDefault()
        }
        var vResult = true;
        var isFocus = true;
        $.each(ctrls, function(index, ele){
          var key = $(ele).attr('data-valid-control');
          if(!test(ele, key)) {
            if(isFocus) {
              $(ele).focus();
              isFocus = false
            }
            vResult = false;
            if(!isDiy) return false
          }
        });
        if(callback&&callback.constructor===Function) {
          ev.preventDefault();
          if(vResult) callback(ev, form)
        } else {
          if(!vResult) ev.preventDefault()
        }
      });

      function test(ele, key) {
        var va = vas[key];
        var errDom = isDiy ? null : form.find('[data-valid-error="'+key+'"]');
        if($(ele).prop('type')==='radio' || $(ele).prop('type')==='checkbox') {
          return $.inRange(form.find('[data-valid-control="'+key+'"]:checked').length, va.norm) ?
            fnSuccess($(ele), va, errDom) : fnError($(ele), va, errDom, va.error)
        } else if(va.norm.context) {
          return $(ele).val()==va.norm.val()&&$(ele).val().length>0 ?
            fnSuccess($(ele), va, errDom) : fnError($(ele), va, errDom, va.error)
        }else {
          return va.norm.test($(ele).val()) ?
            fnSuccess($(ele), va, errDom) : fnError($(ele), va, errDom, va.error)
        }
      }

      function fnError(ts, va, errDom, error) {
        if(isDiy) {
          va.error(ts)
        } else {
          errDom.addClass('active').html(error)
        }
        return false
      }

      function fnSuccess(ts, va, errDom) {
        if(isDiy) {
          va.success(ts)
        } else {
          setTimeout(function(){
            errDom.removeClass('active').html('')
          }, 200)
        }
        return true
      }
    };
    $.inRange = function(num, range){
      if(typeof range=='string') range = range.replace(/ /g, '');
      //m
      if(!/^\(|\)|\[|\]$/.test(range)) {
        return num==parseFloat(range)
        //(m,)
      } else if(/^\(\d*\.?\d*,[\)\]]$/.test(range)) {
        return num>parseFloat(range.replace(/\(|,|\)/g,''))
        //(,n)
      } else if(/^[\[\(],\d*\.?\d*\)$/.test(range)) {
        return num<parseFloat(range.replace(/\(|,|\)/g,''))
        //(m,n)
      } else if(/^\(\d*\.?\d*,\d*\.?\d*\)$/.test(range)) {
        var arr = range.replace(/\(|\)/g,'').split(',');
        return num>parseFloat(arr[0]) && num<parseFloat(arr[1])
        //[m,)
      } else if(/^\[\d*\.?\d*,[\)\]]$/.test(range)) {
        return num>=parseFloat(range.replace(/\[|,|\)/g,''))
        //(,n]
      } else if(/^[\[\(],\d*\.?\d*\]$/.test(range)) {
        return num<=parseFloat(range.replace(/\(|,|\]/g,''))
        //[m,n]
      } else if(/^\[\d*\.?\d*,\d*\.?\d*\]$/.test(range)) {
        var arr = range.replace(/\[|\]/g,'').split(',');
        return num>=parseFloat(arr[0]) && num<=parseFloat(arr[1])
        //(m,n]
      } else if(/^\(\d*\.?\d*,\d*\.?\d*\]$/.test(range)) {
        var arr = range.replace(/\(|\]/g,'').split(',');
        return num>parseFloat(arr[0]) && num<=parseFloat(arr[1])
        //[m,n)
      } else if(/^\[\d*\.?\d*,\d*\.?\d*\)$/.test(range)) {
        var arr = range.replace(/\[|\)/g,'').split(',');
        return num>=parseFloat(arr[0]) && num<parseFloat(arr[1])
      } else {
        return false
      }
    }
  })($);

  var pointsPage = {
    init: function () {
      var self = this;
      // var editorUpdate = CKEDITOR.replace("introduce2");
      // var editor_create = CKEDITOR.replace("introducenew");
      $.AMUI.progress.start();
      $('.tpl-header-navbar').load("../header/header.html", function () {
        singleMode.out();
      });
      self.conTacTinFo();
      $.AMUI.progress.done();
      self.subFn();   //编辑商品
      self.subCreateFn();  //新建商品
      // 选中未发布、已发布还是已删除状态
      // $('#js-selected').unbind("change").on('change',function(){
      //   self.conTacTinFo();
      // });

      // 上传缩略图/背景图---‘提交’按钮选中
      $('#uploadSubmit').click(function () {
        var header_popTitle=$('#header_popTitle').text();
          var typeVal = 'bgimage';
        // var typeVal=header_popTitle==='上传背景图'?'bgimage':'miu';
        var idVal = $('#thumbnailUpId').val();
        $('#productidSvt').val(idVal);
        $('#producttypeSvt').val(typeVal);

        var dataJson = new FormData($('#uploadForm')[0]);
        dataJson.id = idVal;
        dataJson.type=typeVal;
        $.ajax({
          url: singleMode.url + 'upload/product',
          type: 'post',
          data: dataJson,
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function (data) {
            $('#thumbnailUp').modal('close');
            alert(data['msg']);
            self.conTacTinFo();
          },
          error: function (data) {
            alert(data['msg']);
          }
        });
      });

      // 新建
      $('#body').on('click', '#create', function () {
        self.createTopic($(this));
      });

      // 编辑
      $('#body').on('click', '.edit', function () {
        self.editGoods($(this));
      });

      $('#body').on('click', '.release', function () {
        var thats=$(this);
        self.Release(thats);
      });

      $('#body').on('click', '.delete', function () {
        var thats=$(this);
        var pid=$(this).attr('data-id');

        self.deleteGoodsId(pid);

      });

      $('#body').on('click', '.bgImgUp', function () {
        self.thumbnailUp($(this),'bgImgUp');
      });

      $('#body').on('click', '.thumbImgUp', function () {
        self.thumbnailUp($(this),'thumbImgUp');
      });

    },

    // 新建话题
    subCreateFn:function () {
      var vData = {
          poiModuleTitle: {
          norm: /.+/,
          error: '该字段不能为空！'
        },
          poiModulePrice: {
          norm: /.+/,
          error: '该字段不能为空！'
        },
          poiModuleDesr: {
              norm: /.+/,
              error: '该字段不能为空！'
          }
      };
      $('#createFormUp').valid(vData, function() {
        var ismany = $("input[name='isMany']:checked").val();
          // +'&isMany='+ismany
        if(ismany){
            var serialize = $('#createFormUp').serialize();
            var $btn = $('.btn-loading-example');
            $btn.button('loading');
            singleMode.ajaxFun(singleMode.url + 'points/product/add ', serialize, 'post', function(json) {
                if(json['ok'] === true) {
                    if(json['code'] === 1000) {
                        $btn.button('reset');
                        alert('创建商品成功！');
                        $('#my-popupNew').modal('close');
                        pointsPage.conTacTinFo();
                    } else {
                        alert('创建失败！')
                    }
                } else {
                    alert('失败！')
//              window.location.href = '../login/login.html';
                }
            });
        }else{
          alert('请选择是否支持多个兑换');
          return ;
        }
      });
    },

    // 编辑-提交
    subFn:function () {
        var vData = {
            poiModuleTitle: {
                norm: /.+/,
                error: '该字段不能为空！'
            },
            poiModulePrice: {
                norm: /.+/,
                error: '该字段不能为空！'
            },
            poiModuleDesr: {
                norm: /.+/,
                error: '该字段不能为空！'
            }
        };
      $('#editFormUp').valid(vData, function() {
          var ismany = $("input[name='isMany']:checked").val();
          if(ismany){
              var serialize = $('#editFormUp').serialize();
              var $btn = $('.btn-loading-example');
              $btn.button('loading');
              singleMode.ajaxFun(singleMode.url + 'points/product/editor', serialize, 'post', function(json) {
                  if(json['ok'] === true) {
                      if(json['code'] === 1000) {
                          $btn.button('reset');
                          alert('编辑成功！');
                          $('#my-popup').modal('close');
                          pointsPage.conTacTinFo();
                      } else {
                          alert('编辑失败！')
                      }
                  }
              });
          }else{
              alert('请选择是否支持多个兑换');
              return ;
          }

      });
    },

    // 新建话题
    createTopic: function(self) {
      $("#createFormUp").find('textarea[name="description"]').val('');

      $('#my-popupNew').modal({
        dimmer: false
      });
    },

//    编辑话题  '#editFormUp'
    editGoods: function(self) {
      $("#editFormUp").find('input[name="pid"]').val(self.attr('data-id'));
      $("#editFormUp").find('input[name="name"]').val(self.attr('data-name'));
      $("#editFormUp").find('input[name="price"]').val(self.attr('data-price'));
      $("#editFormUp").find('textarea[name="description"]').val(self.attr('data-description'));
      var isMany = self.attr('data-isMany');
      $(":input[name='isMany'][value='" + isMany + "']").prop("checked", "checked");

      $('#my-popup').modal({
        dimmer: false
      });
    },

//    发布话题
    Release: function(self) {
      var that = this;
      singleMode.ajaxFun(singleMode.url + 'topic/release', { tid: self.attr('data-id') }, 'get', function(json) {
        if(json['ok'] === true) {
          $('#my-alert_release').modal('open');
          that.conTacTinFo();
          // alert(json['msg']);
        } else {
          window.location.href = '../login/login.html';
        }
      });
    },

//    删除商品
      deleteGoodsId: function(pid) {
      var that = this;
      singleMode.ajaxFun(singleMode.url + 'points/product/delete', { pid:pid }, 'get', function(json) {
        if(json['ok'] === true) {
          $('#my-alert_del').modal('open');
          that.conTacTinFo();
        } else {
          alert('删除失败！')
        }
      });
    },

//    上传缩略图
    thumbnailUp: function(self,icon) {
      var header_popTitle=icon;
      $('#thumbnailUp').modal({
        dimmer: false
      });
      $('#thumbnailUpId').val(self.attr('data-id'));
      $('#producttypeSvt').val('');
      $('#productidSvt').val('');

      if(header_popTitle==='bgImgUp'){
        $('#header_popTitle').text('上传背景图');
      }else if(header_popTitle==='thumbImgUp'){
        $('#header_popTitle').text('上传缩略图');
      }
    },

    /*
     话题列表
     */

    conTacTinFo: function () {
      var that = this;
      var pagesize=6;
      singleMode.ajaxFun(singleMode.url + 'points/product/list', {page: 1, pagesize: pagesize}, 'get', function(json) {
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
              that.postOrder2(curr, numS);
            } else {
              var interText_sp = doT.template($('#calendarTpl').text());
              $('#calendarTbBody').html(interText_sp(_data.data));
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

                var jsonList1 = json.data;
                jsonList1.forEach(function (item) {
                  if(item['imgUrl']){
                    item['poi_imgUrl']= singleMode.url+item['imgUrl'].match(/..\/(\S*)/)[1]
                  }
                });
                var jsonList=jsonList1;

                var interText_sp = doT.template($('#calendarTpl').text());
                $('#calendarTbBody').html(interText_sp(jsonList));
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

    postOrder2: function( curr, numS) {
      singleMode.ajaxFun(singleMode.url + 'points/product/list', { page: curr, pagesize: numS }, 'get', function(json) {
        if(json['ok'] === true && json.data) {
          var jsonList1 = json.data;
          jsonList1.forEach(function (item) {
              if(item['imgUrl']){
                  item['poi_imgUrl']= singleMode.url+item['imgUrl'].match(/..\/(\S*)/)[1]
              }
          })
          var jsonList=jsonList1;
          var interText_sp = doT.template($('#calendarTpl').text());
          $('#calendarTbBody').html(interText_sp(jsonList));
        } else {
          $('#calendarTbBody').html(json.msg);
          return false;
        }
      });
    },
  };
  module.exports = {
      pointsPage: pointsPage
  };
});