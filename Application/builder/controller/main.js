/**
 * Created by megic on 2015-06-11.
 */

module.exports = function($this,$M){
    var main={};
    main['_init']=function *(){//先执行的公共函数不会被缓存部分
    };
    main['_after']=function *(){//后行的公共函数
        //console.log('公共头部');
    };

    main['index']=function *(){

        var person = {
                name: 'Peter',
                phone: '15521286598x',
                email: 'peterexample.com',
                age: 24,
                gendar: 'male',
                hobbies: ['coding', 'singing', 'movies'],
                studentId: 'X2345678',
                contact: '',
                smilie: '{doge}'
            },

            rules = {
                name:['required|string','验证错误'],
                phone:['phone','手机号码错误'],
                email:['required_without:phone|email'],
                gendar:['in:male,female'],
                age:['integer|between:0,120|older_than:17'],
                hobbies:['array'],
                studentId:['alpha_num|size:8'],
                contact:['required_without:phone,email'],
                smilie:['regex:^{([a-z]*)}$']
            };


        var ss=$M['F'].V.validate(person, rules);

        console.log(rules[ss.rejects[0].field]);
    };

    return main;
};
