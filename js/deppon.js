//广告轮播
/*广告图片数组*/
var imgs = [
  {'i': 0, 'img': 'img/11113413ra8m.jpg'},
  {'i': 1, 'img': 'img/12151011r5e8.jpg'},
  {'i': 2, 'img': 'img/15101327aqyu.jpg'},
  {'i': 3, 'img': 'img/16145719i3m2.jpg'},
  {'i': 4, 'img': 'img/31160051j31q.jpg'},
  {'i': 5, 'img': 'img/151150531ag4.jpg'},
  {'i': 6, 'img': 'img/200913308x4t.jpg'}
];

var slider= {
  //保存每个li的宽度,其实就是#slider的初始宽
  LIWIDTH: 0,
  //动画的总时长
  DURATION: 1000,
  //自动轮播之间的等待时间
  WAIT: 3000,
  //保存一次性定时器序号
  timer: null,
  //保存是否可以自动轮播
  canAuto: true,
  init: function () {
    this.LIWIDTH = parseFloat($('#slider').css('width'));
    this.updateView();
    //为#indexs的ul添加事件代理，只有不是hover的li才能响应事件
    $('#indexs').on('mouseover', 'li:not(.hover)',
        function (e) {
          var $target = $(e.target);//获得目标元素$target
          //调用move方法，传入要移动的个数：
          //目标元素的内容-目标元素的兄弟中class为hover的li的内容
          this.move($target.attr('data') - $target.siblings('.hover').attr('data'));
        }.bind(this));
        //当鼠标进入#slider时，将canAuto改为false
        //当鼠标移出#slider时，将canAuto改为true
        $('#slider').hover(
            function () {this.canAuto = false;}.bind(this),
            function () {this.canAuto = true;}.bind(this)
        );
    //启动自动轮播
    this.autoMove();
  },
  //move方法
  move: function (n) {
    //停止一次性定时器
    clearTimeout(this.timer);
    this.timer = null;
    $('#imgs').stop(true);
    //获得#imgs当前的left,转为浮点数
    var left = parseFloat($('#imgs').css('left'));
    //如果n<0，右移
    if (n < 0) {//先改数组再移动
      n *= -1;//将n转为正数
      //先删除结尾的n个元素，拼接到开头
      imgs = imgs.splice(imgs.length - n, n).concat(imgs);
      //更新界面
      this.updateView();
      //修改#imgs的left为left-n*LIWIDTH
      $('#imgs').css('left', left - n * this.LIWIDTH);
      //启动动画，在duration时间内,left移动到0
      $('#imgs').animate(
          {left: '0'},
          this.DURATION,
          this.autoMove.bind(this)//启用自动轮播
      );
    } else {//否则，左移，先移动，再改数组
      //让#imgs的ul在DURATION事件内，left变为-n*this.LIWIDTH
      $('#imgs').animate(
          {left: -n * this.LIWIDTH + 'px'},
          this.DURATION,
          //在动画结束后调用endMove,替换this,传入参数n
          this.endMove.bind(this, n)
      );

    }
  },

  //自动轮播
  autoMove: function () {
    //启用一次性定时器
    this.timer = setTimeout(
        function () {
          if (this.canAuto) {
            this.move(1);//执行move移动一个
          } else {
            this.autoMove();
          }
        }.bind(this),
        this.WAIT
    );

  },

  endMove: function (n) {
    //删除imgs数组开头的n个元素,再拼接到结尾
    imgs = imgs.concat(imgs.splice(0, n));
    //更新页面
    this.updateView();
    //设置#imgs的left为0
    $('#imgs').css('left', 0);
    //启动自动轮播
    this.autoMove();
  },

  //将数组中的元素更新到页面
  updateView: function () {
    //遍历imgs数组中每一个图片对象
    for (var i = 0, html = "", idxs = ""; i < imgs.length; i++) {
      html += "<li><img src='" + imgs[i].img + "'/></li>";
      idxs += "<li data='"+(i+1)+"'></li>";
    }
    //设置id为imgs的内容为html,再设置宽度为LIWIDTH*imgs.length
    $('#imgs').html(html)
        .css('width', this.LIWIDTH * imgs.length);
    //设置id为indexs的内容为idxs
    $('#indexs').html(idxs);
    //获得#indexs下的和imgs中第一个元素的i属性对应的li,设置其class为hover
    //选择兄弟中的class为hover的li,清除其class

    $("#indexs>li:eq(" + imgs[0].i + ")")
        .addClass('hover')
        .siblings('.hover')
        .removeClass('hover');
  }
};
slider.init();