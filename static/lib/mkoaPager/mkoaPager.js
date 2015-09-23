/**
 * Created by Administrator on 2015/9/16 0016.
 */
define(["avalon","mkoaAjax/mkoaAjax","css!./mkoa.pager.css"], function (avalon,$a) {
    function heredoc(fn) {
        return fn.toString()
            .replace(/^[^\/]+\/\*!?\s?/, '')
            .replace(/\*\/[^\/]+$/, '')
    }
    var _interface = function () {
    };
    avalon.component("mkoa:pager", {
        url:"",//数据获取地址
        $list: "",
        listData:[],
        perPages: 10, //@config {Number} 每页包含多少条目
        showPages: 10, //@config {Number} 中间部分一共要显示多少页(如果两边出现省略号,即它们之间的页数)
        currentPage: 0, //@config {Number} 当前选中的页面 (按照人们日常习惯,是从1开始)，它会被高亮
        totalItems: 0, //@config {Number} 总条目数
        totalPages: 0, //@config {Number} 总页数,通过Math.ceil(vm.totalItems / vm.perPages)求得
        pages: [], //@config {Array} 要显示的页面组成的数字数组，如[1,2,3,4,5,6,7]
        empty:"没有数据",
        ellipseText: "…", //@config {String} 省略的页数用什么文字表示
        prevText: "上一页", //@config {String} “下一页”分页按钮上显示的文字
        nextText: "下一页", //@config {String} “上一页”分页按钮上显示的文字
        firstPage: 0, //@config {Number} 当前可显示的最小页码，不能小于1
        lastPage: 0, //@config {Number} 当前可显示的最大页码，不能大于totalPages
        showFirstOmit: false,
        showLastOmit: false,
        changePage:_interface,
        //插件模板
        $template: heredoc(function (vm) {
            /*
             {{$list|html}}
             <p class="mkoa-pager-empty" ms-if="!totalItems">{{empty}}</p>
             <div class="mkoa-pager" ms-if="totalItems">
             <span  ms-click="changePage(currentPage-1)" class="mkoa-pager-button" ms-class="mkoa-pager-lock:currentPage==1">{{prevText}}</span>
             <span class="mkoa-pager-span" ms-if="firstPage>1" ms-click="changePage(1)">1</span>
             <span ms-if="firstPage>2">{{ellipseText}}</span>
             <span ms-repeat="pages" class="mkoa-pager-span" ms-click="changePage(el)"  ms-class="mkoa-pager-curpage:(currentPage==el)" >{{el}}</span>
             <span ms-if="lastPage<totalPages-1" >{{ellipseText}}</span>
             <span class="mkoa-pager-span" ms-if="lastPage<totalPages" ms-click="changePage(totalPages)">{{totalPages}}</span>
             <span  ms-click="changePage(currentPage+1)" class="mkoa-pager-button" ms-class="mkoa-pager-lock:currentPage==totalPages">{{nextText}}</span>
             </div>
             */
        }),
        $init:function(vm){

            //修改当前页面
            vm.changePage=function(index){
                if(index>0&&index<=vm.totalPages)vm.currentPage=index;
            };
            vm.$watch("totalItems", function (){
                vm.pages=getPages(vm);
            });
            //监控页码变动
            vm.$watch("currentPage", function (){
                vm.pages=getPages(vm);
                //ajax获取数据
                var option={};
                option['currentPage']=vm.currentPage;//当前页码
                option['perPages']=vm.perPages;//每页页数
                option['t']=new Date().getTime();
                $a.getJSON(vm.url,option,function(data){//获取列表数据
                    if(!data.error){
                        vm.totalItems=data.data.count;
                        vm.listData=data.data.rows;
                        //console.log(vm.listData);
                    }
                });
            });
            vm.currentPage=1;


        }
    });


    function getPages(vm) {
        var c = vm.currentPage, max = Math.ceil(vm.totalItems / vm.perPages), pages = [], s = vm.showPages,
            left = c, right = c;
        //一共有p页，要显示s个页面
        vm.totalPages = max;
        if (max <= s) {
            for (var i = 1; i <= max; i++) {
                pages.push(i)
            }
        } else {
            pages.push(c);
            while (true) {
                if (pages.length >= s) {
                    break
                }
                if (left > 1) {//在日常生活是以1开始的
                    pages.unshift(--left)
                }
                if (pages.length >= s) {
                    break
                }
                if (right < max) {
                    pages.push(++right)
                }
            }
        }
        vm.firstPage = pages[0] || 1;
        vm.lastPage = pages[pages.length - 1] || 1;
        vm.showFirstOmit = vm.firstPage > 2;
        vm.showLastOmit = vm.lastPage < max - 1;
        return  pages;//[0,1,2,3,4,5,6]
    }


    return avalon;
});