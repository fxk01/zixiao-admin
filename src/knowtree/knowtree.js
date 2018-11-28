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
    common:"../../static/assets/js/common",
    velocity:'../../static/assets/js/jquery.velocity.min'
  },
  shim: {
    theme: ['jquery'],
    bootstrapfile: ['jquery'],
    amazeuipage: ['jquery'],
    appmin: ['jquery'],
    velocity:['jquery']
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
  'velocity',
  'module'
], function($, amui, theme, bootstrapfile, doT, amazeuipage, cookiemin, appmin, common,velocity, module) {

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

  var knowtreePage = {
    init: function () {
      $("textarea").txtaAutoHeight();
      var self = this;
      $.AMUI.progress.start();
      $('.tpl-header-navbar').load("../header/header.html", function () {
        singleMode.out();
      });
      $.AMUI.progress.done();
      var createKnowledge = CKEDITOR.replace("knowledge_content");
      var editKnowledge = CKEDITOR.replace("knowledge_contentEdit");


      self.conTacTinFo(self);
      self.plusFn(self);  //新建话题标题
      self.editFn(self);  //编辑话题标题
      self.plusKnowledgeFn(self,createKnowledge);   //新建知识
      self.editKnowledgeFn(self,editKnowledge);   //编辑知识

      //添加一级菜单
      $('#body').on('click', '#createOneMenu', function (event) {
        event.stopPropagation();
        $("#my-popupNew").addClass("createOneMenu");
        $('#my-popupNew').modal({
          dimmer: false
        });
        self.createOneMenu($(this));
      });

      // 添加话题（操作）
      $('#body').on('click', '.know_plus', function (event) {
        event.stopPropagation();
        $("#my-popupNew").removeClass("createOneMenu");
        $('#my-popupNew').modal({
          dimmer: false
        });
        self.createTopic($(this));
      });

      // 上传背景图
      $('#body').on('click', '.bgImgUp', function () {
          self.thumbnailUp($(this),'bgImgUp');
      });

      // 上传缩略图/背景图---‘提交’按钮选中
      $('#uploadSubmit').click(function () {
          var header_popTitle=$('#header_popTitle').text();
          var typeVal=header_popTitle==='上传背景图'?'bgimage':'miu';
          var idVal = $('#thumbnailUpId').val();
          $('#productidSvt').val(idVal);

          $('#producttypeSvt').val(typeVal);

          var dataJson = new FormData($('#uploadForm')[0]);
          dataJson.id = idVal;
          dataJson.type=typeVal;

          $.ajax({
              url: singleMode.url + 'upload/menu',
              type: 'post',
              data: dataJson,
              async: false,
              cache: false,
              contentType: false,
              processData: false,
              success: function (data) {
                if(data['code']==1000){
                    $('#thumbnailUp').modal('close');
                    $('#'+idVal+'').children('div.operation').children("a:last-child").text('查看背景图');

                }

                  alert(data['msg']);

              },
              error: function (data) {
                  alert(data['msg']);
              }
          });
      });

      //添加知识
      $('#body').on('click', '.knowLedge_plus', function (event) {
        event.stopPropagation();
        CKEDITOR.instances.knowledge_content.setData('')

         var _thiss=$(this);

          var menuid=$(this).parent().parent().parent().attr('data-id');
          // 知识的回显
          singleMode.ajaxFun(singleMode.url + 'tree/knowledge/echo', { menuid: menuid }, 'get', function(json) {
              if(json['ok'] === true && json['data']) {
                  var len=json.data.length;
                  if(len){
                      alert('您已编辑过该知识无需再次添加，请点击‘编辑知识’查看')
                  }else{
                      $('#my-knowledge').modal({
                          dimmer: false
                      });
                      self.plusKnowledge(_thiss);
                  }

              } else {
                  $('#my-knowledge').modal({
                      dimmer: false
                  });
                  self.plusKnowledge(_thiss);
              }
          });
      });

      // 编辑知识
      $('#body').on('click', '.knowLedge_edit', function (event) {
        event.stopPropagation();
        var menuid=$(this).parent().parent().parent().attr('data-id');
        // 知识的回显
        singleMode.ajaxFun(singleMode.url + 'tree/knowledge/echo', { menuid: menuid }, 'get', function(json) {
          if(json['ok'] === true && json['data']) {
            var len=json.data.length;
            var knowledgeData=json.data[len-1];
            if(knowledgeData){
              self.editKnowledge(knowledgeData,editKnowledge);
            }else{
              alert('您未添加知识暂无法编辑，编辑前请您先添加知识！')
            }
          } else {
            alert('您未添加知识暂无法编辑，编辑前请您先添加知识！')
          }
        });
      });

      // 编辑话题（操作）
      $('#body').on('click', '.know_edit', function (event) {
        event.stopPropagation();
        $('#my-popup').modal({
          dimmer: false
        });
        self.editTopic($(this));
      });

      // 删除话题（操作）
      $('#body').on('click', '.know_del', function (event) {
        var that=$(this);
        event.stopPropagation();

        self.delTopic(that);

      });


      $('#my-confirm_del').on('closed.modal.amui', function() {
        $(this).removeData('amui.modal');
      });

      // 删除知识
      $('#body').on('click', '.knowLedge_del', function (event) {
        var that=$(this);
        event.stopPropagation();

        var menuid=$(this).parent().parent().parent().attr('data-id');
        // 知识的回显
        singleMode.ajaxFun(singleMode.url + 'tree/knowledge/echo', { menuid: menuid }, 'get', function(json) {
          if(json['ok'] === true && json['data']) {
            var len=json.data.length;
            var knowledgeData=json.data[len-1];
            if(knowledgeData){
              self.delKnowledge(that,menuid,knowledgeData);
            }else{
              alert('您暂未添加任何知识，删除失败！')
            }
          } else {
            alert('您暂未添加任何知识，删除失败！')
          }
        });
      });

      $('#konwledge_confirm_del').on('closed.modal.amui', function() {
        $(this).removeData('amui.modal');
      });

      // 取消-创建话题
      $('#createCancel').click(function () {
        $('#my-popupNew').modal('close');
      })

      // 取消-编辑话题
      $('#editCancel').click(function () {
        $('#my-popup').modal('close');
      })
    },

    createOneMenu: function(that) {
      var referenceid='0';
      $("#createFormUp").find('input[name="referenceid"]').val(referenceid);
      $("#createFormUp").find('textarea[name="title"]').val('');
      $("#createFormUp").find('#fatherBox').css('display','none');
    },

    createTopic: function(that) {

      var referenceid=that.parent().parent().attr('data-id');
      var fathername=that.parent().parent().attr('data-title');

      $("#createFormUp").find('input[name="referenceid"]').val(referenceid);
      $("#createFormUp").find('textarea[name="title"]').val('');
      $("#createFormUp").find('#fatherBox').css('display','block');
      $("#createFormUp").find('#fatherName').val(fathername);
    },

    // 添加知识
    plusKnowledge:function(that) {
      var menuid=that.parent().parent().parent().attr('data-id');
      var koneledge_fatherName=that.parent().parent().parent().attr('data-title');
      $("#knowledgeFormUp").find('input[name="menuid"]').val(menuid);
      $("#knowledgeFormUp").find('textarea[name="title"]').val(koneledge_fatherName);
      $("#knowledgeFormUp").find('#koneledge_fatherName').val(koneledge_fatherName);
      // createKnowledge.getData();       //清除富文本编辑框内容
      // CKEDITOR.instances.knowledge_content.setData('')
    },

    //编辑知识
    editKnowledge:function(knowledgeData,editKnowledge) {

      $("#knowledge_editFormUp").find('input[name="knowledgeid"]').val(knowledgeData.id);
      $("#knowledge_editFormUp").find('textarea[name="title"]').val(knowledgeData.title);
      editKnowledge.setData(knowledgeData.content);
      $('#my-knowledge_edit').modal({
        dimmer: false
      });
    },

    // 编辑话题
    editTopic: function(that) {

      var menuid=that.parent().parent().attr('data-id');
      var title=that.parent().parent().attr('data-title');
      $("#editFormUp").find('input[name="menuid"]').val(menuid);
      $("#editFormUp").find('textarea[name="title"]').val(title);
    },

    // 删除话题
    delTopic: function(self) {
      var that = this;
      var menuid=self.parent().parent().attr('data-id');
      var referenceid=self.parent().parent().attr('data-referenceid');

      var menuX=Number($('#'+menuid+'').attr("data-menu"));
      if(menuX===4){    //父节点为三级菜单
        var sublingSize=$('#'+menuid+'').siblings().size();
          if(sublingSize == 0) {      //四级菜单无兄弟姐妹节点
              $('#'+referenceid+'').children('div.operation').prepend(`<div class="menu_ledge"> <a class="knowLedge_plus" href="javascript:;" title="添加知识"> <i class="am-icon-plus"></i>添加知识 </a> <a class="knowLedge_edit" href="javascript:;" title="编辑知识"> <i class="am-icon-pencil"></i>编辑知识 </a> <a href="javascript:;" title="删除知识" class="knowLedge_del"> <i class="am-icon-trash"></i>删除知识 </a> </div>`);
          }
      };
      singleMode.ajaxFun(singleMode.url + 'tree/menu/delete', { menuid: menuid }, 'get', function(json) {
        if(json['ok'] === true) {
          $('#my-alert_del').modal('open');

          $('#'+menuid+'').remove()    //直接删除该元素，无需刷新

        } else {
          // window.location.href = '../login/login.html';
        }
      });
    },

    //删除知识
    delKnowledge: function(that,menuid,knowledgeData) {
      singleMode.ajaxFun(singleMode.url + 'tree/menu/knowledge/delete', { menuid: menuid,knowledgeid:knowledgeData.id }, 'get', function(json) {
        if(json['ok'] === true) {
          $('#my-alert_del').modal('open');
          that.conTacTinFo(that);
        } else {
          // window.location.href = '../login/login.html';
        }
      });
    },

    // 编辑知识
    editKnowledgeFn:function (self,editKnowledge) {
      var vData4 = {
        ModuleKnowledgeid: {
          norm: /.+/,
          error: '该字段不能为空！'
        },
        ModuleTitle: {
          norm: /.+/,
          error: '该字段不能为空！'
        }
      };

      $('#knowledge_editFormUp').valid(vData4, function() {
        var _htmlContent = editKnowledge.getData();

        var id=$("#knowledge_editFormUp").find('input[name="knowledgeid"]').val();
        var title=$("#knowledge_editFormUp").find('textarea[name="title"]').val();
        var serialize ={
            knowledgeid:id,
            title:title,
            content:_htmlContent
        };
        var $btn = $('.btn-loading-example');
        $btn.button('loading');
        singleMode.ajaxFun(singleMode.url + 'tree/menu/knowledge/edit', serialize, 'post', function(json) {
          if(json['ok'] === true) {
            if(json['code'] === 1000) {
              $btn.button('reset');
              alert('编辑知识成功！');
              $('#my-knowledge_edit').modal('close');
            } else {
              alert('编辑知识失败！')
            }
          } else {
            alert('失败！')
//              window.location.href = '../login/login.html';
          }
        });

      });
    },

    // 添加知识
    plusKnowledgeFn:function (self,createKnowledge) {
      var vData3 = {
        ModuleMenuid: {
          norm: /.+/,
          error: '该字段不能为空！'
        },
        ModuleTitle: {
          norm: /.+/,
          error: '该字段不能为空！'
        }

      };

      $('#knowledgeFormUp').valid(vData3, function() {
        var _htmlContent = createKnowledge.getData();

          var id=$("#knowledgeFormUp").find('input[name="menuid"]').val();
          var title=$("#knowledgeFormUp").find('textarea[name="title"]').val();
          var serialize ={
              menuid:id,
              title:title,
              content:_htmlContent
          };

        var $btn = $('.btn-loading-example');
        $btn.button('loading');
        singleMode.ajaxFun(singleMode.url + 'tree/menu/knowledge/new', serialize, 'post', function(json) {
          if(json['ok'] === true) {
            if(json['code'] === 1000) {
              $btn.button('reset');
              alert('添加知识成功！');
              $('#my-knowledge').modal('close');

            } else {
              $btn.button('reset');
              alert('添加知识失败！')
            }
          } else {
              $btn.button('reset');
            alert('失败！')
//              window.location.href = '../login/login.html';
          }
        });

      });
    },

    // 添加菜单
    plusFn:function (self) {
      var vData = {
        ModuleReferenceid: {
          norm: /.+/,
          error: '该字段不能为空！'
        },
        ModuleTitle: {
          norm: /.+/,
          error: '该字段不能为空！'
        }
      };

      $('#createFormUp').valid(vData, function() {
        var isha=$("#my-popupNew").hasClass("createOneMenu");   //true:新建一级菜单  false:新建的不是一级
        var childtitle=$("#createFormUp").find('textarea[name="title"]').val();
        var fartherid=$("#createFormUp").find('input[name="referenceid"]').val();
        var serialize = $('#createFormUp').serialize();
        var $btn = $('.btn-loading-example');

        $btn.button('loading');
        singleMode.ajaxFun(singleMode.url + 'tree/menu/new', serialize, 'post', function(json) {
          if(json['ok'] === true) {
            if(json['code'] === 1001) {
                var j_id=(json.id).toString();
                $btn.button('reset');
              alert('创建菜单成功！');
              $('#my-popupNew').modal('close');
                if(isha){
                    var len=$(".mtree").children().length;
                    $(".mtree").append(`<li class="menuKnowtree mtree-node menu1" data-menu="1" data-prop="${len+1}" id=${j_id} data-id=${j_id} data-title=${childtitle} style="opacity: 1; transform: translateY(0px);"><a class="menuTitle1" href="#">${len+1}. <span class="tit_sp">${childtitle}</span></a> <div class="tpl-table-black-operation operation operation1"> <a class="know_plus" href="javascript:;" title="添加话题"> <i class="am-icon-plus"></i> </a> <a class="know_edit" href="javascript:;" title="编辑话题"> <i class="am-icon-pencil"></i> </a> <!--<a href=\"javascript:;\" title=\"发布\" class=\"tpl-table-black-operation-del know_archive\">--> <!--<i class=\"am-icon-archive\"></i>--> <!--</a>--> <a href="javascript:;" title="删除话题" class="tpl-table-black-operation-del know_del"> <i class="am-icon-trash"></i> </a> </div>  </li>`);
                }else{

                    var f_len= $('#'+fartherid+'').children("ul").length;
                    var menuX=Number($('#'+fartherid+'').attr("data-menu"));
                    var propX=String($('#'+fartherid+'').attr("data-prop"));
                    if(menuX===3){
                        $('#'+fartherid+'').children('div').children('.menu_ledge').remove();
                    };

                    if(f_len){

                        var ulen=Number($('#'+fartherid+'').children("ul").children().length);
                        if(menuX<2){
                            $('#'+fartherid+'').children("ul").append(`<li class="menuKnowtree menu${menuX+1}" data-menu=${menuX+1} data-prop=${propX}.${ulen+1} id=${j_id} data-id=${j_id} data-title=${childtitle} data-referenceid=${fartherid}><a class="menuTitle2" href="#">${propX}.${ulen+1} <span class="tit_sp">${childtitle}</span></a> <div class="tpl-table-black-operation operation"> <a class="know_plus" href="javascript:;" title="添加话题"> <i class="am-icon-plus"></i> </a> <a class="know_edit" href="javascript:;" title="编辑话题"> <i class="am-icon-pencil"></i> </a> <!--<a href="javascript:;" title="发布" class="tpl-table-black-operation-del know_archive">--> <!--<i class="am-icon-archive"></i>--> <!--</a>--> <a href="javascript:;" title="删除话题" class="tpl-table-black-operation-del know_del"> <i class="am-icon-trash"></i> </a> </div>  </li>`);
                        }else{
                            // ${propX}.${ulen+1}
                            $('#'+fartherid+'').children("ul").append(`<li class="menuKnowtree menu${menuX+1}" data-menu=${menuX+1} data-prop=${propX}.${ulen+1} id=${j_id} data-id=${j_id} data-title=${childtitle} data-referenceid=${fartherid}><a class="menuTitle2" href="#">${menuX>=3 ? '':  propX+'.'+(Number(ulen)+1) } <span class="tit_sp">${childtitle}</span></a> <div class="tpl-table-black-operation operation"> <div class="menu_ledge" > <a class="knowLedge_plus"  href="javascript:;" title="添加知识"><i class="am-icon-plus"></i>添加知识</a><a class="knowLedge_edit"  href="javascript:;" title="编辑知识"><i class="am-icon-pencil"></i>编辑知识</a><a href="javascript:;" title="删除知识" class="knowLedge_del"><i class="am-icon-trash"></i>删除知识</a></div><a  class= "${menuX>2? '' : 'know_plus' }"  style="${menuX>2? 'opacity: 0' : '' }" href="javascript:;" title="添加话题"> <i class="am-icon-plus"></i> </a> <a class="know_edit" href="javascript:;" title="编辑话题"> <i class="am-icon-pencil"></i> </a> <!--<a href="javascript:;" title="发布" class="tpl-table-black-operation-del know_archive">--> <!--<i class="am-icon-archive"></i>--> <!--</a>--> <a href="javascript:;" title="删除话题" class="tpl-table-black-operation-del know_del"> <i class="am-icon-trash"></i> </a><a style="${menuX===2? 'display:block;' : 'display:none;' }"  href="javascript:;" title="上传背景图" class="tpl-table-black-operation-del bgImgUp">上传背景图</a> </div>  </li>`);
                        }
                    }else{
                        $('#'+fartherid+'').addClass("mtree-node  mtree-open");
                        if(menuX<2){
                            $('#'+fartherid+'').append(`<ul class="ul_new mtree-level-${menuX}" style="overflow: hidden; height: auto; display: block;">  <li class="menuKnowtree menu${menuX+1}" data-menu=${menuX+1} data-prop=${propX}.1 id=${j_id} data-id=${j_id} data-title=${childtitle} data-referenceid=${fartherid}><a class="menuTitle2" href="#">${propX}.1 <span class="tit_sp">${childtitle}</span></a> <div class="tpl-table-black-operation operation"> <a class="know_plus" href="javascript:;" title="添加话题"> <i class="am-icon-plus"></i> </a> <a class="know_edit" href="javascript:;" title="编辑话题"> <i class="am-icon-pencil"></i> </a> <!--<a href="javascript:;" title="发布" class="tpl-table-black-operation-del know_archive">--> <!--<i class="am-icon-archive"></i>--> <!--</a>--> <a href="javascript:;" title="删除话题" class="tpl-table-black-operation-del know_del"> <i class="am-icon-trash"></i> </a> </div>  </li>  </ul>`);
                        }else{
                            $('#'+fartherid+'').append(`<ul class="ul_new mtree-level-${menuX}" style="overflow: hidden; height: auto; display: block;">  <li class="menuKnowtree menu${menuX+1}" data-menu=${menuX+1} data-prop=${propX}.1 id=${j_id} data-id=${j_id} data-title=${childtitle} data-referenceid=${fartherid}><a class="menuTitle2" href="#">${menuX>=3?'': propX+'.1'} <span class="tit_sp">${childtitle}</span></a> <div class="tpl-table-black-operation operation"> <div class="menu_ledge"><a class="knowLedge_plus"  href="javascript:;" title="添加知识"><i class="am-icon-plus"></i>添加知识 </a><a class="knowLedge_edit"  href="javascript:;" title="编辑知识"> <i class="am-icon-pencil"></i>编辑知识</a><a href="javascript:;" title="删除知识" class="knowLedge_del"><i class="am-icon-trash"></i>删除知识</a></div> <a class= "${menuX>2? '' : 'know_plus' }"  style="${menuX>2? 'opacity: 0' : '' }" href="javascript:;" title="添加话题"> <i class="am-icon-plus"></i> </a> <a class="know_edit" href="javascript:;" title="编辑话题"> <i class="am-icon-pencil"></i> </a> <!--<a href="javascript:;" title="发布" class="tpl-table-black-operation-del know_archive">--> <!--<i class="am-icon-archive"></i>--> <!--</a>--> <a href="javascript:;" title="删除话题" class="tpl-table-black-operation-del know_del"> <i class="am-icon-trash"></i> </a><a style="${menuX===2? 'display:block;' : 'display:none;' }"  href="javascript:;" title="上传背景图" class="tpl-table-black-operation-del bgImgUp">上传背景图</a> </div>  </li>  </ul>`);
                        }
                    }
                }


                var close_same_level_s = false;
                var duration = 400;
                var listAnim = true;
                var easing = 'easeOutQuart';
                var node_s = $('li:has(.ul_new)');

                $('.ul_new li > *:first-child').unbind().on('click.mtree-active', function (e) {
                    // alert('heihei1')
                    if ($(this).parent().hasClass('mtree-closed')) {
                        $('.mtree-active').not($(this).parent()).removeClass('mtree-active');
                        $(this).parent().addClass('mtree-active');
                    } else if ($(this).parent().hasClass('mtree-open')) {
                        $(this).parent().removeClass('mtree-active');
                    } else {
                        $('.mtree-active').not($(this).parent()).removeClass('mtree-active');
                        $(this).parent().toggleClass('mtree-active');
                    }
                });

                node_s.children(':first-child').unbind().on('click.mtree', function (e) {

                    var el = $(this).parent().children('ul').first();
                    var isOpen = $(this).parent().hasClass('mtree-open');
                    if ((close_same_level_s || $('.csl').hasClass('active')) && !isOpen) {
                        var close_items = $(this).closest('ul').children('.mtree-open').not($(this).parent()).children('ul');
                        if ($.Velocity) {
                            close_items.velocity({ height: 0 }, {
                                duration: duration,
                                easing: easing,
                                display: 'none',
                                delay: 100,
                                complete: function () {
                                    setNodeClass($(this).parent(), true);
                                }
                            });
                        } else {
                            close_items.delay(100).slideToggle(duration, function () {
                                setNodeClass($(this).parent(), true);
                            });
                        }
                    }
                    el.css({ 'height': 'auto' });
                    if (!isOpen && $.Velocity && listAnim)
                      // alert('44')
                        el.find(' > li, li.mtree-open > ul > li').css({ 'opacity': 0 }).velocity('stop').velocity('list');
                    if ($.Velocity) {
                      // alert(555)
                        el.velocity('stop').velocity({
                            height: isOpen ? [
                                0,
                                el.outerHeight()
                            ] : [
                                el.outerHeight(),
                                0
                            ]
                        }, {
                            queue: false,
                            duration: duration,
                            easing: easing,
                            display: isOpen ? 'none' : 'block',
                            begin: setNodeClass($(this).parent(), isOpen),
                            complete: function () {
                                if (!isOpen)
                                    $(this).css('height', 'auto');
                            }
                        });
                    } else {
                      // alert('666')
                        setNodeClass($(this).parent(), isOpen);
                        el.slideToggle(duration);
                    }
                    e.preventDefault();
                });

                function setNodeClass(el, isOpen) {
                    if (isOpen) {
                        el.removeClass('mtree-open').addClass('mtree-closed');
                    } else {
                        el.removeClass('mtree-closed').addClass('mtree-open');
                    }
                }
            } else {
                $btn.button('reset');
                alert('创建失败！')
            }
          } else {
              $btn.button('reset');
              alert('失败！')
//              window.location.href = '../login/login.html';
          }
        });

      });
    },

    // 修改菜单
    editFn:function (self) {
      var vData2 = {
        ModuleReferenceid: {
          norm: /.+/,
          error: '该字段不能为空！'
        },
        ModuleTitle: {
          norm: /.+/,
          error: '该字段不能为空！'
        }
      };

      $('#editFormUp').valid(vData2, function() {
        var menuid= $("#editFormUp").find('input[name="menuid"]').val();
        var title=$("#editFormUp").find('textarea[name="title"]').val();

        var serialize = $('#editFormUp').serialize();
        var $btn = $('.btn-loading-example');
        $btn.button('loading');
        singleMode.ajaxFun(singleMode.url + 'tree/menu/edit', serialize, 'post', function(json) {
          if(json['ok'] === true) {
            if(json['code'] === 1000) {
              $btn.button('reset');
              alert('更改话题成功！');
              $('#my-popup').modal('close');

                $('#'+menuid+'').attr('data-title',title);
                $('#'+menuid+'').children(':first-child').find('.tit_sp').text(title)
            } else {
              alert('创建失败！')
            }
          } else {
            alert('失败！')
//              window.location.href = '../login/login.html';
          }
        });

      });
    },

      //    上传背景
      thumbnailUp: function(self,icon) {
          var header_popTitle=icon;
          // setcookie;
          $.cookie('knowMenu_id', self.parent().parent().attr('data-id'), { path: '/'});
          $('#thumbnailUp').modal({
              dimmer: false
          });
          $('#thumbnailUpId').val(self.parent().parent().attr('data-id'));
          var bgimgInit=self.parent().parent().attr('data-bgimg');
          if(bgimgInit){
             $('#picImg').attr('src',bgimgInit);
             $('#thumbnail_new img').attr('src',bgimgInit);
          }else{
              $('#picImg').attr('src','../../static/assets/images/noimage.png');
          }
          $('#productidSvt').val('');

          if(header_popTitle==='bgImgUp'){
              $('#header_popTitle').text('上传背景图');
          }else if(header_popTitle==='thumbImgUp'){
              $('#header_popTitle').text('上传缩略图');
          }
      },

    /*
     知识树-回显
     */
    conTacTinFo: function (self) {

      var jsonList = '';
      singleMode.ajaxFun(singleMode.url + 'tree/menu/echo', {}, 'get', function(json) {
        if(json['ok'] === true) {
          jsonList = json.data;
            jsonList.forEach(function (item) {
            if(item.menus && item.menus.length>0){

              var menu2=item.menus;
                menu2.forEach(function (item2) {
                    if(item2.menus && item2.menus.length>0){

                      var menu3=item2.menus;
                        menu3.forEach(function (item3) {
                            if(item3['bgImage']){
                                item3['bgImageNew']=singleMode.url+item3['bgImage'].match(/..\/(\S*)/)[1];
                            };

                            if(item3.menus && item3.menus.length>0){    //
                                item3['knowIsblock']=false;
                            }else{
                                item3['knowIsblock']=true;
                            }
                        })
                    }
                })

            }
          });

          var interText = doT.template($('#calendarTpl').text());
          $('#calendarTbBody').html(interText(jsonList));
          self.menu();

        } else {
          // window.location.href = '../login/login.html';
        }
      });
    },

    menu:function () {
      (function ($, window, document, undefined) {
        if ($('ul.mtree').length) {
          var collapsed = true;    //false 全部展开；  true 只显示一级菜单
          var close_same_level = false;
          var duration = 400;
          var listAnim = true;
          var easing = 'easeOutQuart';
          $('.mtree ul').css({
            'overflow': 'hidden',
            'height': collapsed ? 0 : 'auto',
            'display': collapsed ? 'none' : 'block'
          });
          var node = $('.mtree li:has(ul)');
          var li_node=$('.mtree li');
            li_node.each(function (index, val) {
                $(this).addClass('mtree-node')
            });
          node.each(function (index, val) {
            $(this).children(':first-child').css('cursor', 'pointer');
            $(this).addClass('mtree-node mtree-' + (collapsed ? 'closed' : 'open'));
            $(this).children('ul').addClass('mtree-level-' + ($(this).parentsUntil($('ul.mtree'), 'ul').length + 1));
          });


            // $('#body').on('click.mtree-active','.mtree li > *:first-child',function(e){
          $('.mtree li > *:first-child').on('click.mtree-active', function (e) {
                // alert('哈哈哈1')
            if ($(this).parent().hasClass('mtree-closed')) {
              $('.mtree-active').not($(this).parent()).removeClass('mtree-active');
              $(this).parent().addClass('mtree-active');
            } else if ($(this).parent().hasClass('mtree-open')) {
              $(this).parent().removeClass('mtree-active');
            } else {
              $('.mtree-active').not($(this).parent()).removeClass('mtree-active');
              $(this).parent().toggleClass('mtree-active');
            }
          });

          // $('#body').on('click.mtree',node.children(':first-child'),function(e){
          node.children(':first-child').on('click.mtree', function (e) {
              // alert('哈哈哈2')
            var el = $(this).parent().children('ul').first();
            var isOpen = $(this).parent().hasClass('mtree-open');
            if ((close_same_level || $('.csl').hasClass('active')) && !isOpen) {
              var close_items = $(this).closest('ul').children('.mtree-open').not($(this).parent()).children('ul');
              if ($.Velocity) {
                close_items.velocity({ height: 0 }, {
                  duration: duration,
                  easing: easing,
                  display: 'none',
                  delay: 100,
                  complete: function () {
                    setNodeClass($(this).parent(), true);
                  }
                });
              } else {
                close_items.delay(100).slideToggle(duration, function () {
                  setNodeClass($(this).parent(), true);
                });
              }
            }
            el.css({ 'height': 'auto' });
            if (!isOpen && $.Velocity && listAnim)
              el.find(' > li, li.mtree-open > ul > li').css({ 'opacity': 0 }).velocity('stop').velocity('list');
            if ($.Velocity) {
              el.velocity('stop').velocity({
                height: isOpen ? [
                  0,
                  el.outerHeight()
                ] : [
                  el.outerHeight(),
                  0
                ]
              }, {
                queue: false,
                duration: duration,
                easing: easing,
                display: isOpen ? 'none' : 'block',
                begin: setNodeClass($(this).parent(), isOpen),
                complete: function () {
                  if (!isOpen)
                    $(this).css('height', 'auto');
                }
              });
            } else {
              setNodeClass($(this).parent(), isOpen);
              el.slideToggle(duration);
            }
            e.preventDefault();
          });
          function setNodeClass(el, isOpen) {
            if (isOpen) {
              el.removeClass('mtree-open').addClass('mtree-closed');
            } else {
              el.removeClass('mtree-closed').addClass('mtree-open');
            }
          }
          if ($.Velocity && listAnim) {
            $.Velocity.Sequences.list = function (element, options, index, size) {
              $.Velocity.animate(element, {
                opacity: [
                  1,
                  0
                ],
                translateY: [
                  0,
                  -(index + 1)
                ]
              }, {
                delay: index * (duration / size / 2),
                duration: duration,
                easing: easing
              });
            };
          }
          if ($('.mtree').css('opacity') == 0) {
            if ($.Velocity) {
              $('.mtree').css('opacity', 1).children().css('opacity', 0).velocity('list');
            } else {
              $('.mtree').show(200);
            }
          }
        }
      }($, this, this.document));
    }
  };
  module.exports = {
      knowtreePage: knowtreePage
  };
});