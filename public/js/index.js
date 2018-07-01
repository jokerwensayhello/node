$(function(){
    let $loginBox = $("#loginBox");
    let $registerBox = $("#registerBox");
    let $userInfo = $("#userInfo");
    

    $loginBox.find("a.colMint").on("click",function(){
        $loginBox.hide();
        $registerBox.show();
    });

    $registerBox.find("a.colMint").on("click",function(){
        $registerBox.hide();
        $loginBox.show();
    });

    $registerBox.find("button").on("click",function(){//注册
        $.ajax({
            type: "post",
            url: '/api/user/register',
            dataType:"json",
            data: {
                username: $registerBox.find("[name='username']").val(),
                password: $registerBox.find("[name='password']").val(),
                repassword: $registerBox.find("[name='repassword']").val(),
            },
            success: function(result){
                $registerBox.find('.colWarning').html(result.message);
                if(!result.code){
                    setTimeout(()=>{
                        $registerBox.hide();
                        $loginBox.show();
                    },1000)
                }
                
            }
        })
    });
    $loginBox.find("button").on("click",()=>{//登陆
        $.ajax({
            type: "post",
            url: '/api/user/login',
            dataType: "json",
            data: {
                username: $loginBox.find("[name='username']").val(),
                password: $loginBox.find("[name='password']").val(),
            },
            success(result){
                $loginBox.find('.colWarning').html(result.message);
                if(!result.code){
                    parent.location.reload();
                }

            }
        })
    });
    $userInfo.find('#logoutBtn').on("click",()=>{//退出登陆
        $.ajax({
            url: '/api/user/logout',
            success(result){
                if(!result.code){
                    parent.location.reload();
                }
            }
        })
    })

})