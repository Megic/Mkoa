/** Created by mkoa */
module.exports = function ($this, $M) {
    var main = {};

    main['_init'] = function *() {/*先执行的公共函数 （不会被缓存部分） */
    };
    main['_after'] = function *() {/*最后执行的公共函数*/
    };


    /*增加或者修改*/
    main['add'] = function *() {
        /*验证规则*/
        var rules = {
                name: {rule:'required',error:'验证失败!'}};

        var check = $M['F'].V.validate($M.POST, rules);//验证数据

        if (check.status) {/*通过验证*/
            var where = {id: $M.POST['id'] ? parseInt($M.POST['id']) : 0};
            var res,resData;
            if (where.id) {/*存在数据ID更新改数据*/
                res = yield $M.D('test').update($M.POST, {where: where});
                resData = $M.POST;
            } else {/*新增*/
                res = yield $M.D('test').build($M.POST).save();
                resData = res;
            }
            $this.success(resData);
        } else {
            $this.error(rules[check.rejects[0].field].error);//数据验证有误
        }
    };


    //返回数据
    main['findOne'] = function *() {
        var where = {
            id: parseInt($M.GET['id'])
        };
        var res = yield $M.D('test').findOne({where: where}, {raw: true});
        $this.success(res);
    };


    //返回分页数据
    main['findAll'] = function *() {
        var perPages=$M.GET['perPages']?parseInt($M.GET['perPages']):10;//每页数据数
        var currentPage=$M.GET['currentPage']?parseInt($M.GET['currentPage']):1;//查询页码
        var where = {};
        var res = yield $M.D('test').findAndCountAll({
        where: where,
        limit: perPages,
        offset: perPages * (currentPage - 1)
        }, {raw: true});
        if (res)$this.success(res);
    };


    //删除数据
    main['delete'] = function *() {
        var where = {
            id: parseInt($M.GET['id'])
        };
        if (where.id)yield $M.D('test').destroy({where: where});
        $this.success();
    };

return main;
};