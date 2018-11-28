/**
 * 公共方法common.js
 */

var singleMode = (function() {
  var privateNum = 1;
    // var _url='https://zx.hefupb.com/admin/';
    // var _url = 'http://192.168.10.177:8087/admin/';      //Hk
    // var _url = 'http://192.168.10.182:8080/admin/';      //Qgang
  var _url='https://hegui.hefupb.com/admin/';

  /*
   封装AJAX
   */
  this.getStatus_au=function (status) {
    var json = {
      "1":'草稿',
      "2": "待审核",
      "3": "未通过",
      '4':'认定违规',
      '5':'已关闭',
      '6':'被举报',
      "7": "已通过"
    };
    return json[status + ''];
  },

    this.getClosed_re=function (isclose) {
      var json = {
        "0":'未关闭',
        "1": "已关闭"
      };
      return json[isclose + ''];
    },

    this.getDelete_au=function (isclose) {
      var json = {
        "0":'未删除',
        "1": "已删除"
      };
      return json[isclose + ''];
    },

    this.getComplain_re=function (complainFlag) {
      var json = {
        "0":'垃圾广告信息',
        "1": "不构成提问或回答",
          "2": "包含主观判断",
          "3": "缺乏可信来源",
          "4": "辱骂等人身攻击",
          "5": "引战争议等非真实问题",
          "6": "针对具体病情的求医问药",
          "7": "寻人、征友、作业等个人任务",
          "8": "政治敏感",
          "9": "色情低俗",
          "10": "有人意图自杀或自残",
          "11": "违法违规",
          "12": "看相、算命、星盘等迷信活动",
          "13": "个人侵权",
          "14": "企业侵权",
          "15": "其他"
      };
      return json[complainFlag + ''];
    },

    this.getStatus_re=function (status) {
      var json = {
        "1":'待审核',
        "2": "已通过",
        "3": "未通过"
      };
      return json[status + ''];
    },

    this.clicksMenuList=function () {
      $(".sidebar-nav-links > a").click(function(){
        $(this).addClass("active") //给当前元素添加"current"样式
        // .next().show() //下一个元素显示
          .parent().siblings().children("a").removeClass("active") //父元素的兄弟元素的子元素<a>移除"current"样式
        // .next().hide(); //它们的下一个元素隐藏
        return false;
      });
    },

    this.clicksMenuSubList=function () {
      $(".sidebar-nav-linkc > a").click(function(){
        $(this).addClass("sub-active") //给当前元素添加"current"样式
        // .next().show() //下一个元素显示
          .parent().siblings().children("a").removeClass("sub-active") //父元素的兄弟元素的子元素<a>移除"current"样式
        // .next().hide(); //它们的下一个元素隐藏
        return false;
      });
    },

    this.ajaxFun = function(url, params, type, successFun) {
      $.ajax({
        url: url,
        data: params,
        type: type,
        cache: false,
        async: true,
        dataType: 'json',
        success: function(data) {
          if (successFun && typeof(successFun) === 'function') {
            if(data.code==1003 || data.code==1009){
              alert('登陆过期，请退出重新登陆！');
                window.location.href = '../login/login.html';
            }else{
              successFun(data);
            }
          }
        },
        statusCode: {404: function() {
          alert('404错误！');
        }}
      });
    };
  /*
   cookie判断
   */
  this.out = function () {
    if($.cookie('code') === 'null' || $.cookie('code') === undefined) {
      // if($.cookie('id') === 'null' || $.cookie('id') === undefined) {
      $('#notLg').text('请登陆').attr('href', '../login/login.html');
      $('#signOut').hide();
      $('.tpl-header-navbar').show();
      // window.location.href = '../login/login.html';
    } else {
      $('#userName').text('欢迎你,' + 'admin');
      $('#tcFs').text('退出');
      $('.am-icon-sign-out').show();
      $('.tpl-header-navbar').show();
    }

    $('#signOut').on('click', function () {
      singleMode.ajaxFun(singleMode.url + 'login/logout', {}, 'get', function(json) {
        console.log('退出')

        //     $.cookie('JSESSIONID', null);
        //     $.cookie('id', null);
        //     $.cookie('username', null);
        //     $.cookie('cookie', null,{expires: -1});
        $.cookie('code', null,{expires: -1});
        window.location.href = '../login/login.html';

        // else {
        //   alert('网络错误！');
        // }
      });
    })
  };
  /*
   解析地址栏
   */
  this.parseURL = function (urlParameter) {
    var _url = window.location.href.split('?')[1];
    if (_url !== undefined) {
      var _index;
      var _arr = _url.split('&');
      for (var i = 0, _len = _arr.length; i < _len; i++) {
        if (_arr[i].indexOf(urlParameter + '=') >= 0) {
          _index = i;
          break;
        } else {
          _index = -1;
        }
      }
      if (_index >= 0) {
        var _key = _arr[_index].split('=')[1];
        return _key;
      }
    }
  };
  return {
    publicMethod1: privateNum,
    ajaxFun: ajaxFun,
    url: _url,
    out: out,
    parseURL: parseURL,
    clicksMenuList:clicksMenuList,
    clicksMenuSubList:clicksMenuSubList,
    getStatus_au:getStatus_au,
    getClosed_re:getClosed_re,
    getComplain_re:getComplain_re,
    getStatus_re:getStatus_re,
    getDelete_au:getDelete_au
  };
})();