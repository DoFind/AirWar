//主飞机
var Role = (function (_super) {
    function Role() {
        Role.super(this);
        //this.init();
    }

    Laya.class(Role, "Role", _super);

    Role.cached = false;

    var _proto = Role.prototype;

    _proto.init = function (_type, _camp, _hp, _speed, _hitRadius, _heroType = 0) {
        
        //角色类型 0普通 1子弹 2炸药 3药包
        this.heroType = _heroType;

        //飞机类型
        this.type = _type;
        //阵营：敌我
        this.camp = _camp;
        //血量
        this.hp = _hp;
        //速度
        this.speed = _speed;
        //攻击半径
        this.hitRadius = _hitRadius;

        //射击类型
        this.shootType = 0;
        //射击间隔
        this.shootInterval = 500;
        //下次射击时间
        this.shootTime = Laya.Browser.now() + 2000;
        //当前动作
        this.action = "";
        //是否是子弹
        this.isBullet = false;

        if (!Role.cached) {
            Role.cached = true;

            //主飞机
            Laya.Animation.createFrames(["war/hero_fly1.png", "war/hero_fly2.png"], "hero_fly");
            Laya.Animation.createFrames(["war/hero_down1.png", "war/hero_down2.png", "war/hero_down3.png", "war/hero_down4.png"], "hero_down");
            //敌机1
            Laya.Animation.createFrames(["war/enemy1_fly1.png"], "enemy1_fly");
            Laya.Animation.createFrames(["war/enemy1_down1.png", "war/enemy1_down2.png", "war/enemy1_down3.png", "war/enemy1_down4.png"], "enemy1_down");
            //敌机2
            Laya.Animation.createFrames(["war/enemy2_fly1.png"], "enemy2_fly");
            Laya.Animation.createFrames(["war/enemy2_hit.png"], "enemy2_hit");
            Laya.Animation.createFrames(["war/enemy2_down1.png", "war/enemy2_down2.png", "war/enemy2_down3.png", "war/enemy2_down4.png"], "enemy2_down");
            //敌机3
            Laya.Animation.createFrames(["war/enemy3_fly1.png", "war/enemy3_fly2.png"], "enemy3_fly");
            Laya.Animation.createFrames(["war/enemy3_hit.png"], "enemy3_hit");
            Laya.Animation.createFrames(["war/enemy3_down1.png", "war/enemy3_down2.png", "war/enemy3_down3.png", "war/enemy3_down4.png", "war/enemy3_down5.png", "war/enemy3_down6.png"], "enemy3_down");

            //子弹
            Laya.Animation.createFrames(["war/bullet1.png"], "bullet1_fly");

            //强化包
            Laya.Animation.createFrames(["war/ufo1.png"], "ufo2_fly");
            //血量包
            Laya.Animation.createFrames(["war/ufo2.png"], "ufo3_fly");
        }


        if (!this.body) {
            //创建animation作为飞机的身体
            this.body = new Laya.Animation();
            //添加到容器
            this.addChild(this.body);

            this.body.on(Laya.Event.COMPLETE, this, this.onPlayComplete);
        }

        //播放飞机飞行动画
        this.playAction("fly");
    }

    //动画结束事件
    _proto.onPlayComplete = function () {
        //击毁动画，隐藏对象
        //Warn!!!  ===  之前写成了=
        if (this.action === "down") {
            this.body.stop();
            this.visible = false;
        }
        else if (this.action === "hit") {
            this.playAction("fly");
        }
    }

    //动画
    _proto.playAction = function (action) {
        //记录一下播放动画类型
        this.action = action;
        //Play
        this.body.play(0, true, this.type + "_" + action);
        //获取当前对象的显示区域
        this.bound = this.body.getBounds();
        //设置机身居中
        this.body.pos(-this.bound.width / 2, -this.bound.height / 2);
    }
    return Role;

})(Laya.Sprite);