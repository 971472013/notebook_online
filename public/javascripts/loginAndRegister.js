$('#login').hide();
$('#toggle-login').click(function(){
  $('#login').toggle();
});

$(function(){
    $("#submitButton").click(function(){
        var user=$("#user").val();
        var passwd=$("#passwd").val();
        if(user===""||passwd===""){
            alert("账号密码不能为空");
            return false;
        }
        $.ajax({
            url:'/login',
            type:'POST',
            data:{
                id:user,
                passwd:passwd
            },
            success:function (data) {
                alert(data.state);
                if(data.state==="登录成功" && data.type==="user"){
                    $(location).attr('href','/home');
                }
                else if(data.state==="登录成功" && data.type==="manager"){
                    $(location).attr('href','/manager');
                }
            },
            error: function () {
                alert('error');
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

$(function(){
    $("#RsubmitButton").click(function(){
        var user=$("#user").val();
        var passwd=$("#passwd").val();
        if(user===""||passwd===""){
            alert("账号密码不能为空");
            return false;
        }
        $.ajax({
            url:'/register',
            type:'POST',
            data:{
                id:user,
                passwd:passwd
            },
            success:function (data) {
                alert(data.state);
                if(data.state==="注册成功"){
                    $(location).attr('href','/');
                }
            },
            error: function () {
                alert('error');
            }
        });
        return false;
    });
});
