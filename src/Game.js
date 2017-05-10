// var Game = (function () {
//     (function Game() {

//子弹偏移位置、role的hit半径
this.bulletPos = [[0], [-15, 15], [-30, 0, 30], [-45, -15, 15, 45]];
this.radius = [15, 30, 70];
//关卡等级、积分成绩、升级等级所需的成绩数量、
this.level = 0;
this.score = 0;
this.levelUpScore = 10;
this.bulletLevel = 0;

//初始化引擎
Laya.init(400, 852, Laya.WebGL);
Laya.stage.scaleMode = "showall";
Laya.stage.alignH = "center";
Laya.stage.screenMode = "vertical";

//加载图集
Laya.loader.load("res/atlas/war.json", Laya.Handler.create(this, onLoaded), null, Laya.Loader.ATLAS);
// })();

function onLoaded() {
    //创建循环滚动背景
    this.bg = new Background();
    //添加到舞台
    Laya.stage.addChild(this.bg);

    //实例化角色容器
    this.roleBox = new Laya.Sprite();
    Laya.stage.addChild(this.roleBox);

    //实例化UI界面
    this.gameInfoUI = new GameInfo();
    Laya.stage.addChild(this.gameInfoUI);

    //创建主角
    this.hero = new Role();
    this.roleBox.addChild(this.hero);

    restart();
}

//重置游戏数据
function restart() {

    //关卡等级、积分成绩、升级等级所需的成绩数量、
    this.level = 0;
    this.score = 0;
    this.levelUpScore = 10;
    this.bulletLevel = 0;

    //重置UI界面信息
    this.gameInfoUI.reset();

    //主角相关信息重置
    this.hero.init("hero", 0, 5, 0, 30);
    this.hero.shootType = 1;
    this.hero.pos(200, 500);
    this.hero.shootInterval = 500;
    this.hero.visible = true;

    //循环roleBox，显示主角，移除其他
    for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
        var role = this.roleBox.getChildAt(i);
        if (role != this.hero) {
            role.removeSelf();
            //回收之前重置
            role.visible = true;
            //回收到对象池
            Laya.Pool.recover("role", role);
        }
    }

    //恢复游戏
    resume();
}

//暂停函数
function pause() {
    Laya.timer.clear(this, onLoop);
    //监听舞台的鼠标移动
    Laya.stage.on(Laya.Event.MOUSE_MOVE, this, onMouseMove);
}

//恢复游戏
function resume() {
    Laya.timer.frameLoop(1, this, onLoop);
    Laya.stage.on(Laya.Event.MOUSE_MOVE, this, onMouseMove);
}

//游戏主逻辑，子弹发射，碰撞检测，等价变化，结束判定，敌机创建....
function onLoop() {
    //遍历所有飞机，更改位置
    for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
        var role = this.roleBox.getChildAt(i);
        if (role && role.speed) {
            role.y += role.speed;
            if (role.y > 1000 || !role.visible || (role.heroType > 0 && role.y < -20)) {
                role.removeSelf();
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
                    //设置子弹发射的初始化位置
                    bullet.pos(role.x + this.pos[index], role.y - role.hitRadius - 10);
                    //添加到舞台
                    this.roleBox.addChild(bullet);
                }
                Laya.SoundManager.playSound("res/sound/bullet.mp3");
            }
        }
    }

    //检测碰撞
    for (var i = this.roleBox.numChildren - 1; i > -1; i--) {
        var role1 = this.roleBox.getChildAt(i);
        if (role1.hp < 1) continue; //忽略，继续检测别的
        for (var j = i - 1; j > -1; j--) {
            if (!role1.visible) continue;
            var role2 = this.roleBox.getChildAt(j);

            if (role2.hp > 0 && role1.camp != role2.camp) {
                var hitRadius = role1.hitRadius + role2.hitRadius;
                if (Math.abs(role1.x - role2.x) < hitRadius && Math.abs(role1.y - role2.y) < hitRadius) {
                    loseHp(role1, 1);
                    loseHp(role2, 1);

                    this.score++;
                    //设置得分
                    this.gameInfoUI.score(this.score);

                    if (this.score > this.levelUpScore) {
                        this.level++;
                        //设置关卡等级
                        this.gameInfoUI.level(this.level);
                        //提高下一级的难度
                        this.levelUpScore += this.level * 5;
                    }
                }
            }
        }
    }
    //主角死亡，游戏结束
    if (this.hero.hp < 1) {
        Laya.timer.clear(this, onLoop);
        Laya.SoundManager.playSound("res/sound/game_over.mp3");

        this.gameInfoUI.infoLabel.text = "GAME OVER! 分数：" + this.score + "\n点击这里重新开始";
        //注册点击事件
        this.gameInfoUI.infoLabel.once(Laya.Event.CLICK, this, restart);
    }

    //敌机的变化  创建时间间隔，飞行速度，血量，数量
    var curTime = this.level < 30 ? this.level * 2 : 60;
    var speedUp = Math.floor(this.level / 6);
    var hpUp = Math.floor(this.level / 8);
    var numUp = Math.floor(this.level / 10);

    //小飞机
    if (Laya.timer.currFrame % (80 - curTime) === 0) {
        createEnemy(0, 2 + numUp, 3 + speedUp, 1);
    }
    //中飞机
    if (Laya.timer.currFrame % (150 - curTime) === 0) {
        createEnemy(1, 1 + numUp, 2 + speedUp, 2 + hpUp * 2);
    }
    //大boss  
    //Warn!! 创建出来的全是小飞机，有打不死的小飞机  哈哈 贴图错了(第一个类型参数错了)
    if (Laya.timer.currFrame % (900 - curTime) === 0) {
        createEnemy(2, 1, 1 + speedUp, 10 + hpUp * 6);
        Laya.SoundManager.playSound("res/sound/enemy3_out.mp3");
    }
}

//掉血
//子弹、道具 忽略，直接销毁隐藏
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

        Laya.SoundManager.playSound("res/sound/achievement.mp3");
    }
    //吃血瓶了
    else if (role.heroType === 3) {
        //血量+1，最大上限为10
        this.hero.hp++;
        this.gameInfoUI.hp(this.hero.hp);
        if (this.hero.hp > 10) this.hero.hp = 10;
        //隐藏道具
        role.visible = false;

        Laya.SoundManager.playSound("res/sound/achievement.mp3");
    }
    else {
        if (role.hp > 0) {
            role.playAction("hit");
        }
        else {
            if (role.heroType > 0) {
                role.visible = false;
            }
            else {
                role.playAction("down");

                if (role.type != "hero") {
                    Laya.SoundManager.playSound("res/sound/" + role.type + "_down.mp3");
                    if (role.type === "enemy3") {
                        var type = Math.random() < 0.7 ? 2 : 3;
                        var item = Laya.Pool.getItemByClass("role", Role);
                        item.init("ufo" + type, role.camp, 1, 1, 15, type);
                        item.pos(role.x, role.y);
                        this.roleBox.addChild(item);
                    }
                }
            }
        }
    }
    //设置主角血量
    if (role === this.hero) {
        this.gameInfoUI.hp(role.hp);
    }
}
//鼠标移动事件
function onMouseMove() {
    this.hero.pos(Laya.stage.mouseX, Laya.stage.mouseY);
}

//创建敌机
function createEnemy(type, num, speed, hp) {

    for (var i = 0; i < num; i++) {
        //从对象池创建对象
        var enemy = Laya.Pool.getItemByClass("role", Role);
        //初始化角色，并赋值
        enemy.init("enemy" + (type + 1), 1, hp, speed, this.radius[type]);
        //随机位置
        enemy.pos(Math.random() * 360 + 40, -Math.random() * 200 - 100);
        //添加到舞台
        this.roleBox.addChild(enemy);
    }
}
// })();