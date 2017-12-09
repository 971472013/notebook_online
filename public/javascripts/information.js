var id =document.cookie;
var v1=new Vue({
    el:'#Information',
    data:{
        id:id,
        password:'',
        userGroup:'',
        userName:'',
        userList:[]
    },
    created:function () {
        var _self=this;
        $.ajax({
            url: '/information/info',
            type: 'GET',
            data: {
                a_id: _self.id,
                a_password: '',
                a_userGroup: '',
                a_userName: '',
                userList:[]
            },
            success: function (data) {
                _self.id = data.a_id;
                _self.password = data.a_password;
                _self.userName = data.a_userName;
                _self.userGroup = data.a_userGroup;
                _self.userList = data.userList;
            }
        });
    }
});
$(function () {
    $("#sure").click(function () {
        $.ajax({
            url: '/manager/changeInfo',
            type: 'GET',
            data: {
                id: v1.id,
                password: $("#password").val(),
                userName: $("#userName").val(),
                userGroup: $("#userGroup").val()
            },
            success: function (data) {
                alert(v1.id + "更改成功");
                $(location).attr('href','/information');
            }
        });
        return false;
    });
});