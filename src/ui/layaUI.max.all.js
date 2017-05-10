var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var GameInfoUI=(function(_super){
		function GameInfoUI(){
			
		    this.pauseBtn=null;
		    this.hpLabel=null;
		    this.levelLabel=null;
		    this.scoreLabel=null;
		    this.infoLabel=null;

			GameInfoUI.__super.call(this);
		}

		CLASS$(GameInfoUI,'ui.GameInfoUI',_super);
		var __proto__=GameInfoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameInfoUI.uiView);
		}

		STATICATTR$(GameInfoUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":400,"height":852},"child":[{"type":"Button","props":{"y":140,"x":319,"var":"pauseBtn","stateNum":"1","skin":"war/btn_pause.png"}},{"type":"Label","props":{"y":150,"x":20,"width":80,"var":"hpLabel","text":"HP:5","height":30,"fontSize":14,"font":"Arial","color":"#06ff10","bold":true,"align":"center"}},{"type":"Label","props":{"y":150,"x":100,"width":80,"var":"levelLabel","text":"Level:1","height":30,"fontSize":14,"font":"Arial","color":"#ffea00","bold":true,"align":"center"}},{"type":"Label","props":{"y":150,"x":200,"width":80,"var":"scoreLabel","text":"Score:0","height":30,"fontSize":14,"font":"Arial","color":"#ff0014","bold":true,"align":"center"}},{"type":"Label","props":{"y":430,"x":13,"wordWrap":true,"width":373,"var":"infoLabel","text":"游戏结束游戏结束游戏结束游戏结束游戏结束游戏结束游戏结束游戏结束游戏结束游戏结束","height":111,"fontSize":20,"color":"#ffffff","bold":true,"align":"center"}}]};}
		]);
		return GameInfoUI;
	})(View);