/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-26
 * Time: 上午11:43
 * To change this template use File | Settings | File Templates.
 */
var ScrollBar = function(ele,opt){
    this.$element = ele;
    this.con = null;
    this.conL = 0;//内容区域的left
    this.conT = 0;//内容区域的top
    this.barL = 0;//滚动条的left
    this.barT = 0;//滚动条的top
    this.settings = {
        sleep : 150, //滚动速度
        content: "",
        Direction:"cross"  //cross:横向，vertical：纵向
    }
    $.extend(this.settings,opt);
}
ScrollBar.prototype = {
    init:function(){
        this.Con =this.$element.find('.'+this.settings.content);
        var key =0;
        var _this = this;
        var onOff = true;
        this.addScrollEvent(this.$element[0],key ,function(key){
            _this.banScroll(); //禁止window滚动
            _this.conL = _this.Con.position().left;
            _this.conT = _this.Con.position().top;
            _this.barL = _this.$element.find(".bar").position().left;
            _this.barT = _this.$element.find(".bar").position().top;
            if(_this.settings.Direction == "cross"){
                if(key < 0){
                    if(onOff){
                        onOff = false;
                        _this.barL+=_this.settings.sleep/_this.pro;
                        _this.barL = (_this.barL>_this.scrollW-_this.barW)?_this.scrollW-_this.barW : _this.barL;
                        _this.conL-=_this.settings.sleep;
                        _this.conL = (_this.conL< (_this.scrollW - _this.ConW ))?_this.scrollW - _this.ConW :_this.conL;
                        _this.startMove(_this.conL,_this.barL);
                        onOff = true;
                    }
                }else{
                    if(onOff){
                        onOff = false;
                        _this.barL-=_this.settings.sleep/_this.pro;
                        _this.barL = (_this.barL<0)?0:_this.barL;
                        _this.conL+=_this.settings.sleep;
                        _this.conL = (_this.conL>0)?0:_this.conL;
                        _this.startMove(_this.conL,_this.barL);
                        onOff = true;
                    }
                }
            }else if(_this.settings.Direction == "vertical"){
                if(key < 0){
                    if(onOff){
                        onOff = false;
                        _this.barT+=_this.settings.sleep/_this.pro;
                        _this.barT = (_this.barT>_this.scrollH-_this.barH)?_this.scrollH-_this.barH : _this.barT;
                        _this.conT-=_this.settings.sleep;
                        _this.conT = (_this.conT< (_this.scrollH - _this.ConH ))?_this.scrollH - _this.ConH :_this.conT;
                        _this.startMove(_this.conT,_this.barT);
                        onOff = true;
                    }
                }else{
                    if(onOff){
                        onOff = false;
                        _this.barT-=_this.settings.sleep/_this.pro;
                        _this.barT = (_this.barT<0)?0:_this.barT;
                        _this.conT+=_this.settings.sleep;
                        _this.conT = (_this.conT>0)?0:_this.conT;
                        _this.startMove(_this.conT,_this.barT);
                        onOff = true;
                    }
                }
            }
        });
        this.createBar();
    },
    addScrollEvent:function(obj,key ,fn){  //鼠标滚动方法封装
        obj.onmousewheel=scrollFunc;
        obj.addEventListener("DOMMouseScroll", scrollFunc);
        function scrollFunc(ev){
            ev = window.event || ev;
            key = ev.wheelDelta || -ev.detail;//滚轮向上滚动返回的数值是正数，向下滚动是负数
            fn(key);
        }
    },
    createBar: function(){   //创建滚动条
        var _this = this;
        this.scrollW = this.$element.width();  //可视区域宽度
        this.scrollH = this.$element.height();  //可视区域高度
        this.ConW = this.Con.width(); //内容宽度
        this.ConH = this.Con.height(); //内容高度
        this.pro = (_this.settings.Direction == "cross")?this.ConW/this.scrollW:this.ConH/this.scrollH;//比例
        this.barW = this.scrollW/this.pro; //滚动条宽度
        this.barH = this.scrollH/this.pro; //滚动条高度
        this.$element.hover(function(){
            if(!$(this).find("div").hasClass("bar")){
                $(this).append("<div class='bar'></div>");
            }else{
                $(this).find("div.bar").show();
            }
            if(_this.settings.Direction == "cross"){
                $(this).find("div.bar").addClass("cross").removeClass("vertical");
                $(this).find("div.bar").css('width',_this.barW);
            }else if(_this.settings.Direction == "vertical"){
                $(this).find("div.bar").addClass("vertical").removeClass("cross");
                $(this).find("div.bar").css('height',_this.barH);
            }

        },function(){
            $(this).find("div.bar").hide();
        })
    },
    startMove : function(con,bar){ //内容区域移动方法
        if(this.settings.Direction == "cross"){
            this.Con.stop().animate({left:con+"px"},200);
            this.$element.find(".bar").stop().animate({left:bar+"px"},200);
        }else if(this.settings.Direction == "vertical"){
            this.Con.stop().animate({top:con+"px"},200);
            this.$element.find(".bar").stop().animate({top:bar+"px"},200);
        }

    },
    banScroll : function(ev){  //禁止window滚动方法
        ev = ev||window.event;
        if (ev&&ev.preventDefault){
            ev.preventDefault();
            ev.stopPropagation();
        }else{
            ev.returnvalue=false;
            return false;
        }
    }
}
$.fn.ScrollBar = function(opt){
    var scroll = new ScrollBar(this,opt);
    return scroll.init();
}
