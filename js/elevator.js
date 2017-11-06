//导航二级菜单部分
//鼠标移入，下拉菜单出现
$('.menu').on('mouseover','.menu_da',function(){
  console.log('鼠标移入了');
  $(this).children('a').css('color','#fff' );
 $(this).children('a:not(:only-child)')
     .css('background','url("img/my_00.png") no-repeat bottom');
  $(this).children('.menu_xiao').show();
});
//鼠标移出下拉菜单隐藏
$('.menu').on('mouseleave','li',function(){
  console.log('鼠标移出了');
  $(this).children('a').css('color','')
  .css('background-image','');

  $(this).children('.menu_xiao').hide();
});

//登陆我的德邦切换二维码登陆
$('.choice').on('click','h3',function(){
  $(this).addClass('out').siblings('.out').removeClass('out');
  var a=$(this).attr('name');
  $('.loading').children("[name="+a+"]").addClass('out').siblings().removeClass('out');
});
//德邦公告德邦动态切换
$('.choice').on('click','h3',function(){
  $(this).addClass('out').siblings('.out').removeClass('out');
  var a=$(this).attr('name');

  $('.content').children("[name="+a+"]").addClass('out').siblings().removeClass('out');
});

//滚动距离大于400时二维码出现
$(document).on("scroll",
    function(){
      //查找id为toTop的div
      //设置div的display为:
      //滚动过的距离>=500?block:none
      if($(document).scrollTop()>=400){
        $('#elevator').css('display','block');
      }else{
        $('#elevator').css('display','none');
      }

    }
);

//固定二维码点击关闭
$('.elevator').on('click','b',function(){
  $(this).parent().parent().fadeOut();
});