/**
 * Created by 朱圆基 on 2017/4/22.
 */
;(function (angular) {
    var app = angular.module('app',['ui.router']);

    app.controller('AppController',['$scope','$window',function ($scope,$widnow) {
        $scope.title='webApp';
        /*记录当前选中的是哪一个*/
        $scope.type='今日一刻';
        $scope.tabChange=function (type) {
            switch (type){
                case 'home':
                    $scope.type='今日一刻';
                    break;
                case 'author':
                    $scope.type='作者';
                    break;
                case 'content':
                    $scope.type='栏目';
                    break;
                case 'my':
                    $scope.type='我的';
                    break;
            }
            /*发送一个广播给导航，让它改标题*/
            $scope.$broadcast('titleChange',{title:$scope.type}); //必须写在方法中,每次调用方法是都需要发送
                                                                    //titleChange广播
        };
        $scope.isBack=false;
        $scope.$on('isback',function (e,res) {
            
        })
        $scope.back=function () {
            $widnow.history.back();
            $scope.isBack=false;
        }
    }])
})(angular)
/**
 * Created by 朱圆基 on 2017/4/23.
 */
angular.module('app').controller('DetailController',['$scope',"$stateParams",function ($scope,$stateParams) {
    $scope.content=$scope.res[$stateParams.id].content;
    $scope.$emit('isback',{'isback':true});
    // console.log($scope.content);
}])
/**
 * Created by 朱圆基 on 2017/4/23.
 */
angular.module('app').controller('HomeController',['$scope','zyjHttp',function ($scope,zyjHttp) {
    zyjHttp.getData(function (res) {
        $scope.res=res;
    },function (err) {
        console.log(err.msg);
    })
}])
/**
 * Created by 朱圆基 on 2017/4/23.
 */
angular.module('app').config(['$sceDelegateProvider',function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://localhost/code/**'
    ])
}])
/**
 * Created by 朱圆基 on 2017/4/22.
 */
angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        url: '/app',
        views: {
            home: {
                templateUrl: '../views/homeTlp.html',
                controller:'HomeController'
            },
            author: {
                template: '<h1>author</h1>'
            },
            content: {
                template: '<h1>content</h1>'
            },
            my: {
                template: '<h1>my</h1>'
            }
        }
    });
    $urlRouterProvider.otherwise('app/index');
}])

// 配置主路由
angular.module('app').config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('app.index',{
        url:'/index',
        template:'<lists></lists>',
    })
}]);
// 配置详情路由
angular.module('app').config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('app.detail',{
        url:'/datail/:id',
        template:'<detail></detail>'
    })
}])
/**
 * Created by 朱圆基 on 2017/4/23.
 */
angular.module('app').directive('detail',function () {
    return {
        restrict:'EA',
        template:'<div></div>',
        controller:'DetailController',
        link:function ($scope,ele,attr) {
            ele.html($scope.content);
        }
    }
})
/**
 * Created by 朱圆基 on 2017/4/23.
 */
angular.module('app').directive('lists',function () {
    return {
        restrict:'EA',
        templateUrl:'../views/listTlp.html'
    }
})
/**
 * Created by 朱圆基 on 2017/4/22.
 */
angular.module('app').directive('znav',function () {
    return {
        restrict:'EA',
        templateUrl:'../views/navTlp.html',
        link:function ($scope,ele,attr) {
            /*监听标题改变的通知*/
            $scope.$on('titleChange',function (e,res) {
                ele.find('span').html(res.title);
            })
        }
    }
})
/**
 * Created by 朱圆基 on 2017/4/22.
 */
angular.module('app').directive('tabbar',function () {
    return {
        restrist:'EA',
        templateUrl:'../views/tabbarTlp.html',
        link:function ($scope,ele,attr) {

        }
    }
})
/**
 * Created by 朱圆基 on 2017/4/23.
 */
// 自定义服务封装了$http
angular.module('app').service('zyjHttp',['$http',function ($http) {
    this.getData=function (success,error) {
        $http({
            url:'http://localhost/code/home.php',
            method:'jsonp',
        }).then(function (res) {
            success(res.data.posts);
        }).catch(function (err) {
            error(err);
        })
    }
}])