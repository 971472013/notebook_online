
var v1_g=new Vue({
    el: '#list_g',
    data: {
        noteList_g:[]
    },
    created:function(){
        var url='/home/getNoteList_g';
        var _self=this;
        $.get(url,function(data){
            for(var x  in data){
                _self.noteList_g.push(data[x]);
            }
        });
    },
    methods:{
        showNoteInfo:function (event) {
            v2.mark=0;
            v2.name=event.target.id;
            // v3.name=event.target.id;
        }
    }
});
var v1=new Vue({
    el: '#list',
    data: {
        mark: 0,
        noteList:[]
    },
    beforeCreate:function(){
        var url='/home/getNoteList';
        var _self=this;
        $.get(url,function(data){
            for(var x  in data){
                _self.noteList.push(data[x]);
            }
        });
    },
    // beforeCreate:function(){
    //         var url='/home/getNoteList';
    //         var _self=this;
    //         $.get(url,function(data){
    //             for(var x  in data){
    //                 _self.noteList.push(data[x]);
    //             }
    //         });
    //     // var _self=this;
    //     // $.ajax({
    //     //     url: '/home/getNoteList',
    //     //     type: 'POST',
    //     //     data: {
    //     //     },
    //     //     success:function (data) {
    //     //         for(var x  in data){
    //     //                     _self.noteList.push(data[x]);
    //     //                 };
    //     //             _self.mark=1;
    //     //     }});
    //
    // },
    // beforeUpdate:function () {
    //     if(this.mark===1){
    //         alert(_self.noteList);
    //     }
    // },
    methods:{
        showNoteInfo:function (event) {
            v2.mark=0;
            v2.name=event.target.id;
            // v3.name=event.target.id;
        }
    },
});
var content_buff="";
var v2 = new Vue({
    el:'#all',
    // el:'#note_info',
    data:{
        mark:-1,
        name:'',
        belong_user:'',
        belong_group:'',
        n_content:'',
        s_content:'',
        // remain:'',
        label:''
    },
    updated:function () {
        var _self=this;
        if(_self.name!==""){
            if(_self.mark===0){
                $.ajax({
                    url: '/home/getNoteInfo',
                    type: 'GET',
                    data: {
                        a_name:_self.name,
                        a_belong_user:'',
                        a_belong_group:'',
                        a_n_content:'',
                        a_s_content:'',
                        // a_remain:'',
                        a_label:''
                    },
                    success:function (data) {
                        _self.name=data.a_name;
                        _self.belong_user=data.a_belong_user;
                        _self.belong_group=data.a_belong_group;
                        _self.n_content=data.a_n_content;
                        _self.s_content=data.a_s_content;
                        // _self.remain=data.a_remain;
                        _self.label=data.a_label;
                        // console.log(data);
                        _self.mark=1;
                    }
                });
            }
            else if(_self.mark===1){
                content_buff=_self.n_content;
            }
        }
    }
});
$(function () {
    $("#save").click(function(){
        // alert(document.getElementById("n_content").innerHTML);
        if(v2.name===""){
            alert("请先选择要更新的笔记本");
        }else{
            $.ajax({
                url:'/home/saveNote',
                type:'GET',
                data:{
                    old_name:v2.name,
                    name:$("#notebookName").val(),
                    n_content:content_buff,
                    label:$("#notebookLabel").val(),
                    s_content:document.getElementById("my_img").src,
                    belong_user:v2.belong_user,
                    belong_group:v2.belong_group
                },
                success:function (data) {
                    v1.mark=1;
                    alert(data.name+"笔记更改成功");
                    $(location).attr('href','/home');
                }
            });
        }
    });
    $("#delete").click(function () {
        $.ajax({
            url:'/home/delete',
            type:'GET',
            data:{
                name:v2.name
            },
            success:function (data) {
                alert(v2.name+"笔记删除成功");
                $(location).attr('href','/home');
            }
        });
    });
    $("#add").click(function () {
        $.ajax({
            url:'/home/add',
            type:'GET',
            data:{
            },
            success:function (data) {
                alert("未命名   "+"笔记建立成功");
                $(location).attr('href','/home');
            }
        });
    });
    $("#notebook_name").click(function () {
        alert("搜索结果将在我的笔记中展示，搜索范围为————我的笔记+用户组笔记，搜索\"\"将还原");
        var search = $("#search").val().toString();
        // console.log(search);
        if(search.toString()!==""){
            var new_list = [];
            for(var x in v1.noteList){
                // console.log(v1.noteList[x].toString().indexOf(search));
                if(v1.noteList[x].toString().indexOf(search)>=0){
                    // console.log(v1.noteList[x]);
                    new_list.push(v1.noteList[x]);
                }
            }
            for(var y in v1_g.noteList_g){
                // console.log(v1_g.noteList_g[y].toString().indexOf(search));
                if(v1_g.noteList_g[y].toString().indexOf(search)>=0){
                    new_list.push(v1_g.noteList_g[y]);
                }
            }
            v1.noteList=new_list;
            v1_g.noteList_g=[];
        }
        else {
            $(location).attr('href','/home');
        }
    });
    $("#label_name").click(function () {
        alert("标签搜索只搜索属于自己的笔记—————搜索结果将在我的笔记中展示，搜索范围为————我的笔记+用户组笔记，搜索\"\"将还原");
        var search = $("#search").val().toString();
        $.ajax({
            url:'/home/searchLabel',
            type:'GET',
            data:{
                search:search
            },
            success:function (data) {
                v1.noteList=data;
                v1_g.noteList_g=[];
            }
        });
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
    });
    $("#download").click(function () {
        $.ajax({
            url:'/download',
            type:'GET',
            data:{
                n_text:v2.n_content,
                s_text:v2.s_content
            },
            success:function (data) {
                alert("下载成功");
            }
        });
    });
});
// var v3 = new Vue({
//     el:'#noteContent',
//     data:{
//         name:'',
//         // belong_user:'',
//         // belong_group:'',
//         n_content:null,
//         s_content:null,
//         // remain:'',
//         // label:''
//     },
//     updated:function () {
//         console.log(123);
//         var _self=this;
//         $.ajax({
//             url: '/home/getNoteContent',
//             type: 'GET',
//             data: {
//                 a_name:_self.name,
//                 // a_belong_user:'',
//                 // a_belong_group:'',
//                 a_n_content:'',
//                 a_s_content:'',
//                 // a_remain:'',
//                 // a_label:''
//             },
//             success:function (data) {
//                 console.log(data);
//                 _self.name=data.a_name;
//                 // _self.belong_user=data.a_belong_user;
//                 // _self.belong_group=data.a_belong_group;
//                 _self.n_content=data.a_n_content;
//                 _self.s_content=data.a_s_content;
//                 // _self.remain=data.a_remain;
//                 // _self.label=data.a_label;
//             }
//         });
//     }
// });
//
// $(function () {
//     $("#changeInfo").click(function(){
//         $.ajax({
//             url:'/manager/changeInfo',
//             type:'GET',
//             data:{
//                 id:v2.id,
//                 password:$("#password").val(),
//                 userName:$("#userName").val(),
//                 userGroup:$("#userGroup").val()
//             },
//             success:function (data) {
//                 alert(v2.id+"更改成功");
//             }
//         });
//     return false;
//     });
//     $('#delete').click(function () {
//         $.ajax({
//             url: '/manager/delete',
//             type: 'GET',
//             data: {
//                 id: v2.id,
//             },
//             success: function (data) {
//                 // var x ;
//                 // for(x in v1.userList){
//                 //     if(v1.userList[x].toString()===v2.id.toString()){
//                 //         break;
//                 //     }
//                 // }
//
//                 // alert(v1.userList.indexOf(v2.id));
//                 v1.userList=v1.userList.slice(v1.userList.indexOf(v2.id),1);
//                 alert(v2.id+"删除成功");
//                 $(location).attr('href','/manager');
//             }
//         });
//         return false;
//     });
// });