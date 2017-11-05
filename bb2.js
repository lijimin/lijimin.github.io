var bubbles = [
    {label:"主页", img:"img/imgs/zyl.jpg", href:"https://www.baidu.com/"},
    {label:"简历", img:"img/imgs/jll.jpg", href:"https://www.taobao.com/"},
    {label:"作品", img:"img/imgs/zpl.jpg", href:"https://www.1688.com/"},
    {label:"其他", img:"img/imgs/qtl.jpg", href:"https://www.qq.com/"}
];

var svgns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";
var groups = null;
var gMouseOver=null;//判断鼠标是否移入了



//sizes是传入的数组[1.5,1,0.75]
function setupBubbles(sizes) {
    for(var size=0;size<sizes.length;size++){
        for(var i=0;i<bubbles.length;i++){
            var baseName="bubble-"+sizes[size]+"-"+i+"-";
            //设置气泡变化transform
            var transform={};
            //移动
            //transform.translate=[10+Math.random()*500+(i%3)*250,10+Math.random()*50+(i%3)*28];
            transform.translate=[10+Math.random()*1366,10+Math.random()*650];
            //缩放
            transform.scale=sizes[size];
            //这个不知道是什么属性 [-1~0.5随机数 ，0～1.5随机数]
            transform.delta=[Math.random()*2.5-1,Math.random()*2.5];
            createBubble(baseName,transform,bubbles[i]);//调用createBubble
        }
    }
    groups=document.getElementsByTagNameNS(svgns,"g");
    //设置动画的定时器
    setInterval(doMove,10);
}



function createBubble(baseName,transform,bubble) {
    //id为svg的svg
    var svgdoc=document.getElementById("svg");
    //气泡包裹在一个气泡组中，其中有2D转换和缩放相关的自定义数据
    //调用makeSVG传入参数
    var group=makeSVG("g",{id:baseName+"g"});
    group.vTranslate=transform.translate;
    group.vScale=transform.scale;
    group.vDelta=transform.delta;
    //创建clipPath，气泡里面的图片不能超出气泡的大小
    var clipPath=makeSVG("clipPath",{id:baseName+"clip"});
    //画圆路径
    var clip=makeSVG("circle",{cx:"-60",cy:"-60",r:"50"});
    //把clip拼接到clipPath结尾
    clipPath.appendChild(clip);
    //把clipPath拼接到group--就是g的结尾
    group.appendChild(clipPath);

    //鼠标停留在气泡上显示的图片
    var img=makeSVG("image",{id:baseName+"img",x:"-110",y:"-110",width:"100",height:"100",preserveAspectRatio:"xMinYMin slice",svgHref:bubble.img,style:"clip-path:url(#"+baseName+"clip)"});

    //把img拼接到group结尾
    group.appendChild(img);
    //画圆的气泡半径为50的圆
    var circle=makeSVG("circle",{id:baseName+"circle",cx:"-60",cy:"-60",r:"50"});
    //圆形气泡添加鼠标移入移出事件监听
    circle.addEventListener("mouseover",doMouseOver,false);
    circle.addEventListener("mouseout",doMouseOut,false);
    //添加一个点击事件
    circle.addEventListener("click",doClick,false);

    //气泡拼接到group结尾
    group.appendChild(circle);
    //设置气泡上的标签
    var text=makeSVG("text",{id:baseName+"text",x:"-60",y:"-60"});
    //设置text内容为label
    text.textContent=bubble.label;
    //文本text拼接到group结尾
    group.appendChild(text);




    //再将group拼接到id为svg的标签下面---svgdoc
    svgdoc.appendChild(group);
}



var ATTR_MAP={
    "className":"class",
    "svgHref":"href"
};

var NS_MAP={
    "svgHref":xlinkns
};



//svg上创建节点--节点名，节点的属性和值{id:id值....}类数组对象
function makeSVG(tag,attributes) {
    //创建节点tag
    var elem=document.createElementNS(svgns,tag);
    for(var attribute in attributes){//遍历传入的attributes
        //属性名如果包含在ATTR_MAP里面，name属性名为ATTR_MAP[attribute],
        // 如果不包含，name属性名为attribute
        var name=(attribute in ATTR_MAP ? ATTR_MAP[attribute]:attribute);
        //属性值为attributes[attribute]
        var value=attributes[attribute];
        //如果属性名在NS_MAP里面找到---xlinkns
        if(attribute in NS_MAP){
            //setAttributeNS(ns,name,value)
            elem.setAttributeNS(NS_MAP[attribute],name,value);
        }else{
            //setAttribute(name,value)
            elem.setAttribute(name,value);
        }
    }
    //返回一个创建的元素节点
    return elem;
}



//气泡移动
function doMove() {
    //遍历气泡团数组--前面的var groups=...
    for(var i=0;i<groups.length;i++){
        var group=groups[i];
        //鼠标移入在气泡里的时候，气泡停止移动
        //group--circle.parentNode
        if (gMouseOver==group){
            continue;
        }

        var pos=group.vTranslate;
        group.vTranslate=[pos[0]+group.vDelta[0],pos[1]+group.vDelta[1]];
        //判断气泡移动的距离，如果超出视图范围就就移回
        //x轴移动大于矩形宽||
        /**
        if (group.vTranslate[0]>1000||group.vTranslate[0]<-200||group.vTranslate[1]>400){
            group.vTranslate=[10+Math.random()*500+(i%3)*250,-50];

        }
         **/
        if (group.vTranslate[0]>1366||group.vTranslate[0]<-200||group.vTranslate[1]>850){
            group.vTranslate=[10+Math.random()*1366,-50];

        }

        //移动气泡和缩放大小
        group.setAttribute("transform","translate("+group.vTranslate[0]+","+group.vTranslate[1]+") scale("+group.vScale+","+group.vScale+")");

    }
}



//鼠标移入
function doMouseOver(event) {
    //鼠标移入，隐藏气泡的填充和标签名，显示图片
    var circle=event.target;
    circle.style.setProperty("fill-opacity","0","");//气泡透明
    circle.nextSibling.style.display="none";//标签隐藏
    circle.previousSibling.style.display="inline";//图片显示
    //将gMouseOver的值改为circle.parentNode
    gMouseOver=circle.parentNode;
}
//鼠标移出
function doMouseOut(event) {
    //鼠标移出，隐藏图片，显示气泡的填充和标签名
    var circle=event.target;
    circle.style.setProperty("fill-opacity","1","");
    circle.nextSibling.style.display="inline";
    circle.previousSibling.style.display="none";
    //将gMouseOver的值改为null
    gMouseOver=null;

}

//鼠标点击
function doClick(event) {
    //获得目标
    var circle=event.target;
    //circle.id按照 - 切割成数组[bubble,1.5,0,circle]
    //                          0     1  2   3
    var arr=circle.id.split("-");
    //2位置是bubbles数组的下标转为浮点数
    var i=parseFloat(arr[2]);
    window.open(bubbles[i].href);
}







function init() {
    //setupBubbles([1.5, 1, 0.75]);
    setupBubbles([1.2,1.0, 0.8, 0.6,0.5]);
}