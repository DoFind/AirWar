
var Background = (function(_super){
    function Background(){
        Background.super(this);
        this.bg1 = new Laya.Sprite();
        this.bg1.loadImage("res/background.png");
        this.addChild(this.bg1);

    }
    // 注册类
    Laya.class(Background, "Background", _super);
    return Background;
})(Laya.Sprite);