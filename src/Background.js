//背景循环播放
var Background = (function(_super){
    function Background(){
        Background.super(this);
        //创建游戏背景1
        this.bg1 = new Laya.Sprite();
        //加载并显示背景图
        this.bg1.loadImage("war/background.png");
        //把背景1放在容器中
        this.addChild(this.bg1);

        this.bg2 = new Laya.Sprite();
        this.bg2.loadImage("war/background.png");
        //更改位置，2在1上面
        this.bg2.pos(0,-852);
        this.addChild(this.bg2);

        //创建一个帧循环，更新容器位置
        Laya.timer.frameLoop(1,this,this.onLoop);
    }
    //注册类
    Laya.class(Background, "Background", _super);

    var _proto = Background.prototype;
    _proto.onLoop = function(){
        //背景容器每帧向下移动一个像素
        this.y += 1;
        if( this.bg1.y + this.y >= 852){
            this.bg1.y -= 852*2;
        }
        if( this.bg2.y + this.y >= 852){
            this.bg2.y -= 852*2;
        }
    }
    return Background;
})(Laya.Sprite);