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



    var switchPage = {
        init: function () {
            var self = this;
            $.AMUI.progress.start();
            $('.tpl-header-navbar').load("../header/header.html", function () {
                singleMode.out();
            });
            $.AMUI.progress.done();
            self.conTacTinFo();

            // switchCheck
            $('#switchCheck').click(function () {
                var checked=$(this).is(':checked');
                if(checked){
                    self.change_conTacTinFo(1);
                }else{
                    self.change_conTacTinFo(0);
                }
            })
        },


        //获取审核功能开关的状态
        conTacTinFo: function () {
            singleMode.ajaxFun(singleMode.url + 'switch/get/status', {}, 'get', function(json) {
                if(json['ok'] === true && json.code===1001) {
                    var initSwi=json.switch;
                    if(initSwi=='1'){   //开关已打开
                        $("#switchCheck").prop("checked","checked");//全选
                        $('#labelbox').html('关闭审核');
                        $('#statusInit').html('已开启');
                        $('#swiinitBox').show();

                    }else{            //开关已关闭
                        $("#switchCheck").prop("checked",false);
                        $('#labelbox').html('开启审核');
                        $('#statusInit').html('已关闭');
                        $('#swiinitBox').show();
                    }

                } else {
                    $('#swiinitBox').show();
                    alert('获取开关状态失败')
                }
            });
        },

        //改变审核功能开关的状态
        change_conTacTinFo: function (switchtype) {
            var that = this;
            singleMode.ajaxFun(singleMode.url + 'switch/turn/onoff', {switchtype:switchtype}, 'get', function(json) {
                if(json['ok'] === true && json.code===1000) {

                    if(switchtype=='1'){

                        $('#labelbox').html('关闭审核');
                        $('#statusInit').html('已开启');
                        $("#switchCheck").prop("checked","checked");//全选

                    }else{
                        $('#labelbox').html('开启审核');
                        $('#statusInit').html('已关闭');
                        $("#switchCheck").prop("checked",false);
                    }

                } else {
                    alert(json['msg'])
                }
            });
        },
    };
    module.exports = {
        switchPage: switchPage
    };
});