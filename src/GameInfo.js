var GameInfo = (function (_super) {
    function GameInfo() {
        GameInfo.super(this);

        //注册按钮点击事件
        this.pauseBtn.on(Laya.Event.CLICK, this, this.onPause);
        //初始化各数值
        this.reset();
    }

    Laya.class(GameInfo, "GameInfo", _super);

    var _proto = GameInfo.prototype;
    _proto.reset = function(){
        this.infoLabel.text = "";
        this.hp(5);
        this.level(0);
        this.score(0);
    }
    _proto.onPause = function (e) {
        e.stopPropagation();
        //this.infoLabel.text = "游戏已暂停，点击任意位置恢复游戏";
        pause();
        Laya.stage.once(Laya.Event.CLICK, this, this.onReplay);
    }
    _proto.onReplay = function () {
        this.infoLabel.text = "";
        resume();
    }

    //显示hp
    _proto.hp = function (value) {
        this.hpLabel.text = "HP:" + value;
    }
    //显示等级level
    _proto.level = function (value) {
        this.levelLabel.text = "Level:" + value;
    }
    //显示分数score
    _proto.score = function (value) {
        this.scoreLabel.text = "Score:" + value;
    }
    return GameInfo;

})(ui.GameInfoUI);