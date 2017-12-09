var express = require('express');
var router = express.Router();
var path="";
var book_name="";

// var file = require("../public/javascripts/file.js");
var formidable = require('formidable');
var fs = require('fs');  //node.js核心的文件处理模块
var pdf = require('pdfkit');
router.get('/form',function (req,res,next) {
    res.render("form");
});

router.get('/home/getNoteList',function (req, res, next) {
    var data=[];
    console.log(1111111111);
    db.all("select * from note_book where belong_user=\""+req.cookies.user.toString()+"\"",function (err,row) {
        if(!err){
            row.forEach(function (each) {
                data.push(each.name);
            });
            console.log(data);
            res.send(data);
        }
    });

});
router.post('/fileupload',function(req, res, next) {
    var message = '';
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/images/';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        }

        var filename = files.resource.name;

        // 对文件名进行处理，以应对上传同名文件的情况
        var nameArray = filename.split('.');
        var type = nameArray[nameArray.length - 1];
        var name = '';
        for (var i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        var rand = Math.random() * 100 + 900;
        var num = parseInt(rand, 10);

        var avatarName = name + num + '.' + type;

        var newPath = form.uploadDir + avatarName;
        fs.renameSync(files.resource.path, newPath);  //重命名
        // console.log(newPath)
        db.run("update note_book set s_content=\""+newPath.split("public")[1]+"\" where name=\""+book_name+"\"");
    });
    res.render("home");
});
router.get('/download', function(req, res) {
    // var fs = require('fs');
    var pdfo = new pdf();
    var text = req.query.n_text;
    console.log(text);
    pdfo.pipe(fs.createWriteStream('../../pdf下载.pdf'));
    pdfo.text(text,100,100);
    // if(req.query.s_text!==''){
    //     pdfo.image(req.query.s_text,{width: 450});
    // }
    pdfo.end();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.cookie('user','null',{maxAge:0,httpOnly:true, path:'/'});
    res.render('index');
});

router.get('/login', function(req, res, next) {
    path='/login';
    res.cookie('user','null',{maxAge:0,httpOnly:true, path:'/'});
    res.render('login');
});
router.post('/login',function (req,res,next) {
    var id = req.body.id;
    var pass = req.body.passwd;
    if(id.length===1){
        db.all("select * from manager where id=\"" + id+"\"", function (err, row) {
            if(!err){
                if(row.length===0){
                    var data={state:"账号不存在"};
                    res.send(data);
                }
                else {
                    row.forEach(function (each) {
                        if (!(pass.toString().trim() === each.passwd.toString().trim())) {
                            var data={state:"账号密码不匹配"};
                            res.send(data);
                        }
                        else{
                            res.cookie("user",id,{ maxAge: 1000*60*30,httpOnly:true, path:'/'});
                            data={type:"manager",state:"登录成功",id:id,passwd:pass};
                            res.send(data);
                        }
                    })
                }
            }
        });
    }
    else{
        db.all("select * from user where id=\"" + id+"\"", function (err, row) {
            if(!err){
                if(row.length===0){
                    var data={state:"账号不存在"};
                    res.send(data);
                }
                else {
                    row.forEach(function (each) {
                        if (!(pass.toString().trim() === each.passwd.toString().trim())) {
                            var data={state:"账号密码不匹配"};
                            res.send(data);
                        }
                        else{
                            res.cookie("user",id,{ maxAge: 1000*60*30,httpOnly:true, path:'/'});
                            data={type:"user",state:"登录成功",id:id,passwd:pass};
                            res.send(data);
                        }
                    })
                }
            }
        });
    }
});
router.get('/register', function(req, res, next) {
    path='/register';
    res.render('register');
});
router.post('/register',function (req,res,next) {
    var id = req.body.id;
    var pass = req.body.passwd;
    db.all("select * from user where id=\"" + id+"\"", function (err, row) {
        if(!err){
            if(row.length!==0){
                var data={state:"账号已存在"};
                res.send(data);
            }
            else {
                if(id.length===1){
                    var data={state:"不能注册管理员账号"};
                    res.send(data);
                }
                else {
                    db.run("insert into user values("+id.toString()+","+
                        pass.toString()+",null,null)");
                    var data={state:"注册成功"};
                    res.send(data);
                }
            }
        }
    });
});
router.get('/manager', function(req, res, next) {
    // if(req.cookies.user!==undefined){
    path='/manager';
        res.render('manager');
    // }else{
    //     res.send("请先登录");
    // }
});
router.get('/manager/getUserList',function (req, res, next) {
    var data = [];
    db.all("select * from user",function (err,row) {
        if(!err){
            row.forEach(function (each) {
                data.push(each.id);
            });
            res.send(data);
        }
    })
});
router.get('/manager/getUserInfo',function (req, res, next) {
    var data={a_id:'',a_password:'',a_userName:'',a_userGroup:''};
    db.all("select * from user where id=\"" + req.query.a_id+"\"",function (err,row) {
        if(!err){
            row.forEach(function (each) {
               data.a_id=each.id;
               data.a_password=each.passwd;
               if(each.name===null){
                   data.a_userName='空';
               }
               else {
                   data.a_userName=each.name;
               }
               if(each.user_group===null){
                   data.a_userGroup='空';
               }
               else{
                   data.a_userGroup=each.user_group;
               }

            });
            res.send(data);
        }
    })
});
router.get('/manager/changeInfo',function (req, res, next) {
    // console.log(req.query);
    db.run("update user set passwd=\""+req.query.password.toString()+"\",name =\""
    +req.query.userName.toString()+"\",user_group =\""+req.query.userGroup.toString()
        +"\" where id =\"" +req.query.id.toString()+"\"");
    res.sendStatus(200);
});
router.get('/manager/delete',function (req, res, next) {
    db.run("delete from user where id=\""+req.query.id+"\"");
    res.send(200);
});

router.get('/home/searchLabel',function (req,res,next) {
    var data=[];
    // console.log(req.query.);
    db.all("select * from note_book where label=\""+req.query.search+"\" and belong_user=\""+req.cookies.user.toString()+"\"",function (err,row) {
        if(!err){
            row.forEach(function (each) {
                data.push(each.name);
            });
            // console.log(data);
            res.send(data);
        }
    })
});
router.get('/home/getNoteList_g',function (req, res, next) {
    var data=[];
    var group;
    db.all("select * from user where id=\""+req.cookies.user.toString()+"\"",function (err,row) {
        if(!err){
            row.forEach(function (each) {
                group = each.user_group;
                db.all("select * from note_book where belong_group=\""+group+"\" and belong_user!=\""+req.cookies.user.toString()+"\"",function (err,row) {
                    if(!err){
                        row.forEach(function (each) {
                            data.push(each.name);
                        });
                        // console.log(data);
                        res.send(data);
                    }
                })
            });
        }
    });

});
router.get('/home/getNoteInfo', function(req, res, next) {
    book_name=req.query.a_name.toString();
    var data={a_name:'',a_belong_group:'',a_label:'',a_belong_user:'',a_n_content:'',a_s_content:''};
    db.all("select * from note_book where name=\""+req.query.a_name.toString()+"\"",function (err,row) {
        if(!err){
            row.forEach(function (each) {
                data.a_name=each.name;
                data.a_belong_user=each.belong_user;
                if(each.belong_group===null){
                    data.a_belong_group= "无";
                }
                else {
                    data.a_belong_group=each.belong_group
                }
                if(each.label===null){
                    data.a_label= "无";
                }
                else {
                    data.a_label=each.label;
                }
                if(each.n_content!==null){
                    data.a_n_content=each.n_content;
                }
                if(each.s_content!==null){
                    data.a_s_content=each.s_content;
                }
            });
            res.send(data);
        }
    });
});
router.get('/home/saveNote',function (req,res,next) {
    // console.log(req.query);
    var data={name:req.query.name.toString()};
    // console.log(req.query.s_content);
    var label="";
    if(req.query.label==="空"){
        // db.run("UPDATE note_book SET name=\""+req.query.name.toString()+"\",n_content=\""+
        //     req.query.n_content.toString()+"\",label=null"+" WHERE name=\""+
        //     req.query.old_name.toString+"\"",function (err,row) {
        //     if(!err){
        //         res.send(data);
        //     }
        // });
        db.run("delete from note_book where name=\""+req.query.old_name+"\"",function (err,row) {
            if(!err){
                db.run("insert into note_book values(\""+req.query.name.toString()+"\","+req.query.belong_user.toString()+
                    ",\""+req.query.belong_group.toString()+"\",\""+req.query.n_content.toString()+"\",\""+
                    req.query.s_content.toString()+"\",null,null)",function (err,row) {
                    if(!err){
                        res.send(data);
                    }
                })
            }
        });
    }
    else{
        // db.run("UPDATE note_book SET name=\""+req.query.name.toString()+"\",n_content=\""+
        //     req.query.n_content.toString()+"\",label=\""+req.query.label+"\" WHERE name=\""+
        //     req.query.old_name.toString+"\"",function (err,row) {
        //     if(!err){
        //         res.send(data);
        //     }
        // });
        db.run("delete from note_book where name=\""+req.query.old_name+"\"",function (err,row) {
            if(!err){
                db.run("insert into note_book values(\""+req.query.name.toString()+"\","+req.query.belong_user.toString()+
                    ",\""+req.query.belong_group.toString()+"\",\""+req.query.n_content.toString()+"\",\""+
                    req.query.s_content.toString()+"\",null,\""+req.query.label.toString()+"\")",function (err,row) {
                    if(!err){
                        res.send(data);
                    }
                })
            }
        });
    }

});
router.get('/home/delete',function (req,res,next) {
    db.run("delete from note_book where name =\""+req.query.name+"\"");
    res.send(200);
});
router.get('/home/add',function (req,res,next) {
    db.run("insert into note_book values(\"未命名\","+req.cookies.user.toString()+",null,null,null,null,null)");
    res.send(200);
});
router.get('/logout', function(req, res, next) {
    res.cookie('user','null',{maxAge:0});
    res.render('index');
});
router.get('/home', function(req, res, next) {
    // if(req.cookies.user!==undefined){
    path='/home';
        res.render('home');
    // }else{
    //     res.send("请先登录");
    // }
});
router.get('/information',function (req,res,next) {
    if(req.cookies.user!==undefined){
        res.render('information',{user:req.cookies.user});
    }else{
        res.send("请先登录");
    }
});
router.get('/information/info',function (req,res,next) {
    var data={a_id:'',a_password:'',a_userName:'',a_userGroup:'',userList:[]};
    db.all("select * from user where id=\"" + req.query.a_id+"\"",function (err,row) {
        if(!err){
            row.forEach(function (each) {
                data.a_id=each.id;
                data.a_password=each.passwd;
                if(each.name===null){
                    data.a_userName='空';
                }
                else {
                    data.a_userName=each.name;
                }
                if(each.user_group===null){
                    data.a_userGroup='空';
                }
                else{
                    data.a_userGroup=each.user_group;
                    db.all("select * from user where user_group=\""+data.a_userGroup+"\" and id !=\""+ data.a_id+"\"",function (err,row) {
                        if(!err){
                            row.forEach(function (each) {
                                var tem = each.id+"  "+each.name;
                                data.userList.push(tem);
                            })
                        }
                        res.send(data);
                    });
                }
            });
        }
    })
});
router.get('/cutPage',function (req,res,next) {
    var options = {
        screenSize: {
            width: 1320
            , height: 700
        }
        , shotSize: {
            width: 1320
            , height: 'all'
        }
    };
    var url = 'http://'+req.headers.host+path;
    webshot(url, '../../test.png',options, function(err) {
    });
    res.send(200);
});





module.exports = router;

