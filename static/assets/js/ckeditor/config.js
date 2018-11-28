/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	
	// %REMOVE_START%
	// The configuration options below are needed when running CKEditor from source files.
	config.plugins = 'dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,div,toolbar,elementspath,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc,lineutils,widget,filetools,notification,notificationaggregator,uploadwidget,uploadimage';
	config.skin = 'moono';
	// %REMOVE_END%

	config.enterMode = CKEDITOR.ENTER_BR; 
	config.shiftEnterMode = CKEDITOR.ENTER_BR;
	
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	config.toolbarGroups = [
	                		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
	                		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
	                		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
	                		{ name: 'forms', groups: [ 'forms' ] },
	                		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
	                		{ name: 'insert', groups: [ 'insert' ] },
	                		'/',
	                		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
	                		{ name: 'links', groups: [ 'links' ] },
	                		{ name: 'styles', groups: [ 'styles' ] },
	                		{ name: 'colors', groups: [ 'colors' ] },
	                		{ name: 'tools', groups: [ 'tools' ] },
	                		{ name: 'others', groups: [ 'others' ] },
	                		{ name: 'about', groups: [ 'about' ] }
	                	];

	config.removeButtons = 'About,Save,Templates,Cut,Copy,Paste,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Blockquote,CreateDiv,Language,Link,Unlink,Anchor,Flash,Iframe,Styles,Find,Replace,Strike,Subscript,Superscript,NumberedList,BulletedList,BidiLtr,BidiRtl,Smiley,ShowBlocks';
	
	config.filebrowserUploadUrl="../upload?action=uploadPictureCkeditor&type=filebrowser";
	
	config.uploadUrl = "../upload?action=uploadPictureCkeditor&type=uploadimage";
	
	//字体默认大小 plugins/font/plugin.js
    config.fontSize_defaultLabel = '16';

	config.height = 350;
};
