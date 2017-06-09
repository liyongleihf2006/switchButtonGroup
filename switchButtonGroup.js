/**
 * Created by LiYonglei on 2017/6/9.
 * bootstrap切换选中状态的按钮组
 * options:
 *      containerCls:"btn-group",容器的class
 *      btnCls:"btn",每个按钮的class
 *      uncheckedCls:"btn-default",未选中按钮的class
 *      checkedCls:"btn-info",选中按钮的class
 *      data:[],生成组件的数据
 *      formatter:function(item){每个按钮中的dom结构
 *          return item;
 *      },
 *      onChecked:function(item){},按钮被选中时触发的回调
 *      doCheck:function(keyword,item){check方法选中某条数据进行的运算,keyword是check中传入的数据,item是组件中的每条数据
 *          return keyword==item;
 *      }
 *methods:
 *      check(keyword) 根据传入的数据来选中某个按钮
 *      checkByIndex(index) 根据索引选中某个按钮,index是按钮所在的顺序
 *      getChecked 获取到被选中按钮的数据
 */
(function($){
    if($.fn.switchButtonGroup){
        return;
    }
    var setMethods={
        check:check,
        checkByIndex:checkByIndex
    };
    var getMethods={
        getChecked:getChecked
    };
    $.fn.switchButtonGroup=function(){
        var args=arguments,params,method;
        if(!args.length|| typeof args[0] == 'object'){
            return this.each(function(idx){
                var $self=$(this);
                $self.data('switchButtonGroup',$.extend(true,{},$.fn.switchButtonGroup.default,args[0]));
                params=$self.data('switchButtonGroup');
                _init.call( $self,params);
                _render.call($self);
            });
        }else{
            if(!$(this).data('switchButtonGroup')){
                throw new Error('You has not init switchButtonGroup!');
            }
            params=Array.prototype.slice.call(args,1);
            if (setMethods.hasOwnProperty(args[0])){
                method=setMethods[args[0]];
                return this.each(function(idx){
                    var $self=$(this);
                    method.apply($self,params);
                    _render.call($self);
                });
            }else if(getMethods.hasOwnProperty(args[0])){
                method=getMethods[args[0]];
                return method.apply(this,params);
            }else{
                throw new Error('There is no such method');
            }
        }
    };
    $.fn.switchButtonGroup.default={
        containerCls:"btn-group",
        btnCls:"btn",
        uncheckedCls:"btn-default",
        checkedCls:"btn-info",
        data:[],
        formatter:function(item){
            return item;
        },
        onChecked:function(item){},
        doCheck:function(keyword,item){
            return keyword==item;
        }
    };
    function _init(params){
        return this;
    }
    function check(keyword){
        var $self=this;
        var params=$self.data("switchButtonGroup");
        params.data.forEach(function(item){
            item._active=params.doCheck.call($self,keyword,item);
        })
    }
    function checkByIndex(idx){
        var $self=this;
        var params=$self.data("switchButtonGroup");
        params.data.forEach(function(item,i){
            item._active=i==idx;
        })
    }
    function getChecked(){
        var $self=this;
        var params=$self.data("switchButtonGroup");
        return params.data.filter(function(item){
            return item._active;
        })[0];
    }
    function _render(){
        var $self=this;
        var params=$self.data("switchButtonGroup");
        $self.addClass(params.containerCls).html(
            params.data.map(function(item){
                if(item._active){
                    params.onChecked.call($self,item);
                }
                return $("<a/>",{
                    "class":function(){
                        return params.btnCls+" "+(item._active?params.checkedCls:params.uncheckedCls);
                    },
                    html:params.formatter.call($self,item),
                    "click":function(){
                        params.data.forEach(function(item){
                           item._active=false;
                        });
                        item._active=true;
                        _render.call($self);
                    }
                })
            })
        )
    }
})(jQuery);
