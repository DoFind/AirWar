var Game = (function () {
    (function Game() {
        //子弹偏移位置
        this.bulletPos = [[0], [-15, 15], [-30, 0, 30], [-45, -15, 15, 45]];
        //关卡等级
        this.level = 0;
        //积分成绩
        this.score = 0;
        //升级等级所需的成绩数量
        this.levelUpScore = 0;
        //子弹级别
        this.bulletLevel = 0;

        this.hps = [1, 1, 3];
        this.speeds = [3, 2, 1];
        this.hitRadius = [15, 30, 70];

        //初始化引擎
        Laya.init(400, 852);
        //创建循环滚动背景
        this.bg = new Background();
        //添加到舞台
        Laya.stage.addChild(this.bg);
        //加载图集
        Laya.loader.load("res/atlas/war.json", Laya.Handler.create(this, onLoaded), null, Laya.Loader.ATLAS);
    })();

    function onLoaded() {
        //创建主角
        this.hero = new Role();
        this.hero.init("hero", 0, 10, 0, 30);
        this.hero.shootType = 1;
        //设置主角的位置
        this.hero.pos(200, 500);
        Laya.stage.addChild(this.hero);
        //监听舞台的鼠标移动
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, onMouseMove);
        //移除事件
        //Laya.stage.off(Laya.Event.MOUSE_MOVE, this, onMouseMove);

        //手动创建敌机
        //createEnemy(10);
        //循环创建敌人
        Laya.timer.frameLoop(1, this, onLoop);
    }

    function onLoop() {
        //遍历所有飞机，更改位置
        for (var i = Laya.stage.numChildren - 1; i > 0; i--) {
            var role = Laya.stage.getChildAt(i);
            if (role && role.speed) {
                role.y += role.speed;
                if (role.y > 1000 || !role.visible || (role.isButtlet && role.y < -20)) {
                    role.removeSelf();
                    role.isButtlet = false;
                    role.visible = true;
                    Laya.Pool.recover("role", role);
                }
            }

            //处理发射子弹的逻辑
            if (role.shootType > 0) {
                var time = Laya.Browser.now();
                if (time > role.shootTime) {
                    role.shootTime = time + role.shootInterval;
                    this.pos = this.bulletPos[role.shootType - 1];

                    for (var index = 0; index < pos.length; index++) {

                        //创建子弹
                        var bullet = Laya.Pool.getItemByClass("role", Role);

                        //初始化子弹信息
                        bullet.init("bullet1", role.camp, 1, -4 - role.shootType - Math.floor(this.level / 15), 1, 1);
                        //设置角色类型为子弹类型
                        bullet.isButtlet = true;
                        //设置子弹发射的初始化位置
                        bullet.pos(role.x + this.pos[index], role.y - role.hitRadius - 10);
                        //添加到舞台
                        Laya.stage.addChild(bullet);
                    }
                }
            }
        }

        //检测碰撞
        for (var i = Laya.stage.numChildren - 1; i > 0; i--) {
            var role1 = Laya.stage.getChildAt(i);
            if (role1.hp < 1) continue; //忽略，继续检测别的
            for (var j = i - 1; j > 0; j--) {
                if (!role1.visible) continue;
                var role2 = Laya.stage.getChildAt(j);

                if (role2.hp > 0 && role1.camp != role2.camp) {
                    var hitRadius = role1.hitRadius + role2.hitRadius;
                    if (Math.abs(role1.x - role2.x) < hitRadius && Math.abs(role1.y - role2.y) < hitRadius) {
                        loseHp(role1, 1);
                        loseHp(role2, 1);
                    }
                }
            }
        }
        //主角死亡，游戏结束
        if (this.hero.hp < 1) {
            Laya.timer.clear(this, onLoop);
        }

        //每隔30帧创建新的飞机
        if (Laya.timer.currFrame % 60 == 0) {
            createEnemy(2);
        }
    }

    //掉血
    //子弹 忽略
    //主角碰到敌机掉血，敌机碰到子弹掉血
    function loseHp(role, loseHp) {
        role.hp -= loseHp;

        //吃炸药包了
        if (role.heroType === 2) {
            //吃一个道具，子弹升级+1
            this.bulletLevel++;
            //子弹升2级，子弹数量+1，最大上限为4
            this.hero.shootType = Math.min(Math.floor(this.bulletLevel / 2) + 1, 4);
            //子弹级别越高，发射频率越快
            this.hero.shootInterval = 500 - 20 * (this.bulletLevel > 20 ? 20 : this.bulletLevel);
            //隐藏道具
            role.visible = false;
        }
        //吃血瓶了
        else if (role.heroType === 3) {
            //血量+1，最大上限为10
            this.hero.hp++;
            if (this.hero.hp > 10) this.hero.hp = 10;
            //隐藏道具
            role.visible = false;
        }
        else {
            if (role.hp > 0) {
                role.playAction("hit");
            }
            else {
                if (role.isButtlet) {
                    role.visible = false;
                }
                else {
                    role.playAction("down");
                    //击中boss
                    if (role.type === "enemy3") {
                        var type = Math.random() < 0.7 ? 2 : 3;
                        var item = Laya.Pool.getItemByClass("role", Role);
                        item.init("ufo" + type, role.camp, 1, 1, 15, type);
                        item.pos(role.x, role.y);
                        Laya.stage.addChild(item);
                    }
                }
            }
        }


    }
    //鼠标移动事件
    function onMouseMove() {
        this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
    }

    //创建敌机
    function createEnemy(num) {

        for (var i = 0; i < num; i++) {
            //随机出现敌人
            var r = Math.random();
            //根据随机数随机敌人
            var type = r < 0.7 ? 0 : r < 0.95 ? 1 : 2;
            //创建敌人
            //var enemy = new Role();
            //从对象池创建对象
            var enemy = Laya.Pool.getItemByClass("role", Role);
            //初始化角色，并赋值
            enemy.init("enemy" + (type + 1), 1, this.hps[type], speeds[type], hitRadius[type]);
            //随机位置
            enemy.pos(Math.random() * 360 + 40, Math.random() * -100);
            //添加到舞台
            Laya.stage.addChild(enemy);
        }
    }
})();