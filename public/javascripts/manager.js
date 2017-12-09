var v1=new Vue({
    el: '#list',
    data: {
        userList:[]
    },
    beforeCreate:function(){
        var url="/manager/getUserList";
        var _self=this;
        $.get(url,function(data){
            for(var x  in data){
                _self.userList.push(data[x]);
            }
        })
    },
    methods:{
        showInfo:function (event) {
            v2.id=event.target.id;
        }
    }
});
var v2 = new Vue({
    el:'#user_info',
    data:{
        id:'',
        password:'',
        userGroup:'',
        userName:''
    },
    updated:function () {
        var _self=this;
        $.ajax({
            url: '/manager/getUserInfo',
            type: 'GET',
            data: {
                a_id:_self.id,
                a_password:'',
                a_userGroup:'',
                a_userName:''
            },
            success:function (data) {
                _self.id=data.a_id;
                _self.password = data.a_password;
                _self.userName=data.a_userName;
                _self.userGroup=data.a_userGroup;
            }
        });
    }
});
$(function () {
    $("#changeInfo").click(function(){
        $.ajax({
            url:'/manager/changeInfo',
            type:'GET',
            data:{
                id:v2.id,
                password:$("#password").val(),
                userName:$("#userName").val(),
                userGroup:$("#userGroup").val()
            },
            success:function (data) {
                alert(v2.id+"更改成功");
            }
        });
    return false;
    });
    $('#delete').click(function () {
        $.ajax({
            url: '/manager/delete',
            type: 'GET',
            data: {
                id: v2.id,
            },
            success: function (data) {
                // var x ;
                // for(x in v1.userList){
                //     if(v1.userList[x].toString()===v2.id.toString()){
                //         break;
                //     }
                // }

                // alert(v1.userList.indexOf(v2.id));
                v1.userList=v1.userList.slice(v1.userList.indexOf(v2.id),1);
                alert(v2.id+"删除成功");
                $(location).attr('href','/manager');
            }
        });
        return false;
    });
    $("#cutPage").click(function () {
        $.ajax({
            url:'/cutPage',
            type:'GET',
            data:{
            },
            success:function (data) {
                alert("截图成功");
            }
        });
    })
});