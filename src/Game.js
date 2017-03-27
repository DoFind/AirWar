
var Game = (function(){
    (function Game(){
        // 初始化引擎，设置宽高
        Laya.init(400,852);

        this.bg = new Background();
        // 添加到舞台
        Laya.stage.addChild(this.bg);
    })();
})();