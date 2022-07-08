var game = new Phaser.Game(240, 400, Phaser.CANVAS, 'game');

var upKey;
var bossx = 50;
var time = 0;
var bossV = 1;
game.MyStates = {};
game.score = 0; //分数初始为零
game.playerLife = 1; //游戏次数
// **************************************************************************************************************************************************
//进度条资源
// boot场景，加载进度条以及游戏设置
game.MyStates.boot = {
	preload: function () {
		game.load.image('preload', 'assets/preloader.gif');
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT; //充满游戏父元素,长宽比变化
		// game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //尽量填充游戏父元素,长宽比不变
	},
	create: function () {
		game.state.start('load'); //执行load场景
	},
};
// *************************************************************************************************************************************************************
// load场景，用于预加载资源
game.MyStates.load = {
	preload: function () {
		var PreloadSprite = game.add.sprite(game.width / 2 - 220 / 2, game.height / 2 - 19 / 2, 'preload'); //创建进度条精灵
		game.load.setPreloadSprite(PreloadSprite); //设置进度条根据加载情况改变宽度

		game.load.image('award1', 'assets/award1.png');
		game.load.image('award2', 'assets/award2.png');
		game.load.image('bg', 'assets/bg2.png');
		game.load.image('bullet', 'assets/bullet.png');
		game.load.image('mybullet', 'assets/mybullet.png');
		game.load.image('bossBullet', 'assets/123.png');
		game.load.image('logo', 'assets/logo.jpg');
		game.load.image('close', 'assets/close.png');
		game.load.image('enemy1', 'assets/enemy1.png');
		game.load.image('enemy2', 'assets/enemy2.png');
		game.load.image('enemy3', 'assets/enemy3.png');
		game.load.image('boss1', 'assets/boss1.png');
		game.load.image('boss2', 'assets/boss2.png');
		game.load.image('boss3', 'assets/boss3.png');
		game.load.image('shield', 'assets/shield.png');
		game.load.spritesheet('myplane', 'assets/myplane.png', 30, 30, 4); //(图片名称， 图片地址， 宽， 高， 帧数)
		game.load.spritesheet('myexplode', 'assets/myexplode.png', 40, 40, 3);
		game.load.spritesheet('explode1', 'assets/explode1.png', 30, 20, 3);
		game.load.spritesheet('explode2', 'assets/explode2.png', 30, 30, 3);
		game.load.spritesheet('explode3', 'assets/explode3.png', 50, 50, 3);
		game.load.spritesheet('bossdie', 'assets/bossdie.png', 100, 50, 3);
		game.load.spritesheet('replaybutton', 'assets/replaybutton.png', 80, 30, 2);
		game.load.spritesheet('sharebutton', 'assets/sharebutton.png', 80, 30, 2);
		game.load.spritesheet('startbutton', 'assets/startbutton.png', 100, 40, 2);
		game.load.audio('ao', 'assets/ao.mp3');
		game.load.audio('crash1', 'assets/crash1.mp3');
		game.load.audio('crash2', 'assets/crash2.mp3');
		game.load.audio('crash3', 'assets/crash3.mp3');
		game.load.audio('deng', 'assets/deng.mp3');
		game.load.audio('fashe', 'assets/fashe.mp3');
		game.load.audio('normalback', 'assets/normalback.mp3');
		game.load.audio('pi', 'assets/pi.mp3');
		game.load.audio('playback', 'assets/playback.mp3');
		game.load.audio('o', 'assets/o.mp3');
		//获取加载百分比调用的函数
		// game.load.onFileComplete.add(function (r) {
		// 	console.log(arguments); //arguments打印函数中所有的参数  返回Arguments(5) [4, 'award', true, 1, 26]
		// 	// var pre = arguments[0];
		// 	// console.log(pre);
		// 	// var style = { font: '20px', fill: '#fff', align: 'center' };
		// 	// var text = game.add.text(game.world.centerX, game.world.centerY + 20, pre + '%', style);
		// 	// text.anchor.set(0.5);
		// });
	},
	create: function () {
		game.state.start('start'); //执行start场景
	},
};
// ****************************************************************************************************************************
// start场景，游戏开始界面
game.MyStates.start = {
	create: function () {
		game.add.sprite(0, 0, 'bg'); //加载背景
		var myplane = game.add.sprite(100, 100, 'myplane'); //加载首页飞机
		myplane.animations.add('fly'); // 飞机添加动画
		myplane.animations.play('fly', 15, true); //(动画名称， 播放快慢， 循环播放)
		game.add.button(70, 200, 'startbutton', this.onStartClick, this, 1, 1, 0); //定义开始按钮
		this.normalback = game.add.audio('normalback', 0.2, true); //加载背景声音
		try {
			this.normalback.play(); //播放背景音 ，使用try{}catch(){},不会因为音乐加载失败而阻塞代码执行
		} catch (error) {
			console.log('音乐加载失败');
		}
	},
	//开始按钮点击函数
	onStartClick: function () {
		game.state.start('play'); //进入play场景
		this.normalback.stop();
	},
};
// ***************************************************************************************************************************
//play场景，游戏进行中页面
game.MyStates.play = {
	create: function create() {
		game.physics.startSystem(Phaser.Physics.ARCADE); //开启游戏中的物理引擎
		var background = game.add.tileSprite(0, 0, game.width, game.height, 'bg'); //加载瓦片背景
		background.autoScroll(0, 20); //y轴滚动
		this.myplane = game.add.sprite(100, 100, 'myplane'); //加载首页飞机
		this.myplane.animations.add('fly'); // 飞机添加动画
		this.myplane.animations.play('fly', 15, true); //(动画名称， 播放快慢， 循环播放)
		game.physics.arcade.enable(this.myplane); //给我的飞机挂载物理属性，可以设置body
		game.debug.body(this.myplane);
		this.myplane.body.collideWorldBounds = true; //我的飞机和世界边添加碰撞事件
		//调试代码，产生一架敌机
		// this.enemy = game.add.sprite(100, 10, 'enemy1'); //加载敌机
		// game.physics.arcade.enable(this.enemy); //给敌机挂载物理引擎
		//我的飞机飞到底部的动画
		var tween = game.add.tween(this.myplane).to({ y: game.height - 40 }, 1000, Phaser.Easing.Quadratic.InOut, true); //添加点击开始后飞机滑到屏幕底端渐变
		tween.onComplete.add(this.onStart, this); //添加飞机渐变结束后的回调函数

		//死亡音
		this.ao = game.add.audio('ao', 10, false);
		//爆炸音
		this.crash1 = game.add.audio('crash1', 10, false);
		this.crash2 = game.add.audio('crash2', 10, false);
		this.crash3 = game.add.audio('crash3', 20, false);
		//升级音
		this.deng = game.add.audio('deng', 10, false);
		//升级音
		this.o = game.add.audio('o', 5, false);
		//打中敌人声音
		this.fashe = game.add.audio('fashe', 5, false);
		// 开火音
		this.pi = game.add.audio('pi', 1, false);
		//背景音
		this.playback = game.add.audio('playback', 0.2, true);
		try {
			this.playback.play();
		} catch (e) {
			console.log('音乐加载失败');
		}
	},
	update: function () {
		if (this.myplane.MyStartFire) {
			this.myPlaneFire();
			this.generateEnemy();
			this.enemyFire();
			this.generateBoss();
			this.bossFire();
			game.physics.arcade.overlap(this.enemys, this.myBullets, this.hitEnemy, null, this); //我方子弹和敌机碰撞检测
			game.physics.arcade.overlap(this.enemys, this.myplane, this.collision, null, this); //我方飞机和敌机碰撞检测
			game.physics.arcade.overlap(this.enemysBullets, this.myplane, this.hitplane, null, this); //我方飞机和敌机子弹碰撞检测
			game.physics.arcade.overlap(this.awards, this.myplane, this.upgrade, null, this); //我的飞机和奖牌碰撞检测
			game.physics.arcade.overlap(this.shield, this.enemysBullets, this.getHudun, null, this); //我的盾牌和敌人子弹碰撞检测
			game.physics.arcade.overlap(this.shield, this.enemys, this.bothdie, null, this); //我的盾牌和敌人碰撞检测
			game.physics.arcade.overlap(this.bosss, this.myplane, this.mydie, null, this); //我和boss碰撞
			game.physics.arcade.overlap(this.bossBullets, this.myplane, this.bosshitplane, null, this); //boss子弹和我的飞机碰撞检测
			game.physics.arcade.overlap(this.shield, this.bossBullets, this.Hudunboss, null, this); //boss子弹和我的飞机碰撞
			game.physics.arcade.overlap(this.myBullets, this.bosss, this.hitboss, null, this); //我的子弹和boss碰撞
		}
		if (this.shield) {
			//盾牌跟随
			this.shield.x = this.myplane.x - 15;
			this.shield.y = this.myplane.y - 15;
		}
		if (game.time.now - time > 3000) {
			bossx = -bossx;
			time = game.time.now;
		}
		if (this.boss) {
			this.boss.body.velocity.x = bossx;
		}
	},
	//我的子弹和boss碰撞
	hitboss: function (myBullets, boss) {
		try {
			this.fashe.play();
		} catch (error) {
			console.log('音乐加载失败');
		}
		boss.life = boss.life - 1;
		if (boss.life <= 0) {
			try {
				this.crash3.play(); //敌机爆炸，根据enemyindex判断是那种爆炸音
			} catch (e) {
				console.log('音乐加载失败');
			}
			boss.kill();
			bossV += 1;
			// debugger;
			var explode = game.add.sprite(boss.x, boss.y, 'bossdie');
			// explode.anchor.setTo(0.5, 0.5); //设置锚点为中心
			var anim = explode.animations.add('explode');
			anim.play(30, false, false);
			anim.onComplete.addOnce(function () {
				explode.destroy();
				game.score = game.score + boss.score;
				this.text.text = '分数' + game.score;
				delete this.boss;
			}, this);
		}
		myBullets.kill();
	},
	//我和boss子弹碰撞检测
	bosshitplane: function (myplane, bossbullet) {
		bossbullet.kill();
		myplane.life = myplane.life - 1;
		//生命值
		this.life.text = '生命：' + this.myplane.life;
		if (myplane.life <= 0) {
			this.playback.stop();
			try {
				this.ao.play(); //死亡音
			} catch (e) {
				console.log('音乐加载失败');
			}
			myplane.kill();

			delete this.boss;
			var explode = game.add.sprite(myplane.x, myplane.y, 'myexplode');
			var anim = explode.animations.add('explode');
			anim.play(30, false, false);
			anim.onComplete.addOnce(function () {
				explode.destroy(); //从系统内存中删除掉对象提高性能
				game.state.start('over');
			});
		}
	},
	//我和boss碰撞函数
	mydie: function (myplane, boss) {
		myplane.kill();
		game.state.start('over');
	},
	//我的盾牌和敌人子弹碰撞函数
	getHudun: function (shield, bullet) {
		bullet.kill();
	},
	//boss子弹和我的护盾碰撞
	Hudunboss: function (shield, bossbullet) {
		bossbullet.kill();
	},
	bothdie: function (shield, bullet) {
		bullet.kill();
		shield.kill();
	},
	//敌机生命值（子弹击中次数）
	hitEnemy: function (enemy, myBullets) {
		try {
			this.fashe.play();
		} catch (error) {
			console.log('音乐加载失败');
		}
		enemy.life = enemy.life - 1;
		if (enemy.life <= 0) {
			try {
				this['crash' + enemy.index].play(); //敌机爆炸，根据enemyindex判断是那种爆炸音
			} catch (e) {
				console.log('音乐加载失败');
			}
			enemy.kill();
			// debugger;
			var explode = game.add.sprite(enemy.x, enemy.y, 'explode' + enemy.index);
			explode.anchor.setTo(0.5, 0.5); //设置锚点为中心
			var anim = explode.animations.add('explode');
			anim.play(30, false, false);
			anim.onComplete.addOnce(function () {
				explode.destroy();
				game.score = game.score + enemy.score;
				this.text.text = '分数' + game.score;
			}, this);
		}
		myBullets.kill();
	},
	//我的飞机和敌机碰撞
	collision: function (enemy, myplane) {
		try {
			this.ao.play();
		} catch (e) {}
		this.playback.stop();
		enemy.kill();
		myplane.kill();
		var explode = game.add.sprite(myplane.x, myplane.y, 'myexplode');
		var anim = explode.animations.add('myexplode');
		anim.play(30, false, true);
		explode = null;
		game.state.start('over');
	},
	//我的飞机和敌机子弹碰撞
	hitplane: function (myplane, bullet) {
		bullet.kill();
		myplane.life = myplane.life - 1;
		//生命值显示
		this.life.text = '生命:' + this.myplane.life;
		if (myplane.life <= 0) {
			this.playback.stop();
			try {
				this.ao.play(); //死亡音
			} catch (e) {
				console.log('音乐加载失败');
			}
			myplane.kill();
			var explode = game.add.sprite(myplane.x, myplane.y, 'myexplode');
			var anim = explode.animations.add('explode');
			anim.play(30, false, false);
			anim.onComplete.addOnce(function () {
				explode.destroy(); //从系统内存中删除掉对象提高性能
				game.state.start('over');
			});
		}
	},
	//我的飞机和奖牌碰撞
	upgrade: function (myplane, award) {
		award.kill();
		if (award.index == 1) {
			try {
				this.deng.play();
			} catch (e) {
				console.log('音乐加载失败');
			}
			if (myplane.life < 3) {
				myplane.life = myplane.life + 1;
        this.life.text = '生命:' + this.myplane.life;
				//5发子弹buff持续时间为10秒
				game.time.events.add(
					Phaser.Timer.SECOND * 10,
					function () {
						if (myplane.life == 3) {
							myplane.life = myplane.life - 1;
              this.life.text = '生命:' + this.myplane.life;
						}
					},
					this
				);
			}
		} else if (award.index == 2) {
			try {
				this.o.play();
			} catch (e) {
				console.log('音乐加载失败');
			}
			myplane.hudun = myplane.hudun + 1;
			game.time.events.add(
				Phaser.Timer.SECOND * 10,
				function () {
					if (myplane.hudun == 1) {
						myplane.hudun = myplane.hudun - 1;
						this.shield.kill(); //10秒时间到消除护盾
						console.log('hudun', myplane.hudun);
					}
				},
				this
			);
			if (myplane.hudun == 1) {
				this.shield = game.add.sprite(this.myplane.x - 20, this.myplane.y - 20, 'shield'); //加载护盾
				game.physics.arcade.enable(this.shield); //给我的护盾挂载物理属性，可以设置body
			}
		}
	},
	// 定义飞机渐变结束后执行的回调函数
	onStart: function () {
		this.bosss = game.add.group(); //创建boss组
		this.bossBullets = game.add.group(); //创建boss子弹组
		this.bosss.lastbossTime = 0;

		this.myplane.inputEnabled = true; //允许输入开启
		this.myplane.input.enableDrag(); //开启鼠标拖动精灵，参数默认为false，为true时精灵中心始终跟随鼠标，为false可以点击精灵任意位置拖动
		this.myplane.MyStartFire = true; //定义myplane.MyStartFire为true
		this.myplane.life = 2; //初始生命值为2
		this.myplane.hudun = 0; //初始护盾值为0
		this.myplane.lastBulletTime = 0; //定义lastBulletTime初始为0
		this.myBullets = game.add.group(); //创建我的子弹组
		this.enemys = game.add.group(); //创建敌机组
		this.enemysBullets = game.add.group(); //创建敌机子弹组
		this.enemys.lastEnemyTime = 0;

		//添加分数
		var style = { font: '16px', fill: '#ff0000' };
		this.text = game.add.text(0, 0, '分数:' + game.score, style);

		//生命值
		var style = { font: '16px', fill: '#ff0000' };
		this.life = game.add.text(100, 0, '生命:' + this.myplane.life, style);

		// 奖牌组
		this.awards = game.add.group();
		//奖牌每隔30秒产生一次
		game.time.events.loop(Phaser.Timer.SECOND * 30, this.generateaward, this);
	},
	// 发射奖牌
	generateaward: function () {
		index = game.rnd.integerInRange(1, 2); //随机奖牌
		var awardSize = game.cache.getImage('award' + index);
		var x = game.rnd.integerInRange(0, game.width - awardSize.width / 2); //phaser方法生成随机数
		// var x = Math.random() * (game.width - awardSize.width / 2) + awardSize.width / 2; //js方法生成随机数
		var award = this.awards.getFirstExists(false, true, x, 0, 'award' + index);
		award.index = index;
		award.outOfBoundsKill = true; //当奖牌飞出边界回收奖牌
		award.checkWorldBounds = true; //检测奖牌碰撞边界
		game.physics.arcade.enable(award); //给奖牌挂载物理引擎
		award.body.velocity.y = 300; //奖牌重力（速度）
	},
	//封装的发射子弹函数
	myPlaneFire: function () {
		var getMyPlaneBullet = function () {
			// var myBullet = game.add.sprite(this.myplane.x + 15, this.myplane.y - 10, 'mybullet'); //加载我的子弹
			var myBullet = this.myBullets.getFirstExists(false); //从子弹组group取出子弹
			if (myBullet) {
				game.physics.enable(myBullet, Phaser.Physics.ARCADE); //给我的子弹挂载物理引擎
				myBullet.reset(this.myplane.x + 10, this.myplane.y - 10); //reset设置子弹位置
				myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
			} else {
				//没有获取到就创建一个
				myBullet = game.add.sprite(this.myplane.x + 15, this.myplane.y - 10, 'mybullet'); //加载我的子弹
				myBullet.outOfBoundsKill = true; //当子弹飞出边界回收子弹
				myBullet.checkWorldBounds = true; //检测子弹碰撞边界
				this.myBullets.addChild(myBullet); //把创建的子弹加入组里面
				game.physics.enable(myBullet, Phaser.Physics.ARCADE); //给我的子弹挂载物理引擎  
			}
			return myBullet;
		};
		var now = game.time.now; //获取现在时间
		// 当现在时间减去this.lastBulletTime大于300时发射子弹
		if (this.myplane.alive && now - this.myplane.lastBulletTime > 500) {
			var myBullet = getMyPlaneBullet.call(this);
			myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
			this.myplane.lastBulletTime = now; //将现在时间赋值给lastBulletTime
			if (this.myplane.life >= 2) {
				var myBullet = getMyPlaneBullet.call(this);
				myBullet.body.velocity.x = 20; //给我的子弹添加向右的重力
				myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
				var myBullet = getMyPlaneBullet.call(this);
				myBullet.body.velocity.x = -20; //给我的子弹添加向左的重力
				myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
			}
			if (this.myplane.life >= 3) {
				var myBullet = getMyPlaneBullet.call(this);
				myBullet.body.velocity.x = 20; //给我的子弹添加向右的重力
				myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
				var myBullet = getMyPlaneBullet.call(this);
				myBullet.body.velocity.x = 35; //给我的子弹添加向右的重力
				myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
				var myBullet = getMyPlaneBullet.call(this);
				myBullet.body.velocity.x = -20; //给我的子弹添加向左的重力
				myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
				var myBullet = getMyPlaneBullet.call(this);
				myBullet.body.velocity.x = -35; //给我的子弹添加向左的重力
				myBullet.body.velocity.y = -200; //给我的子弹添加向上的重力
			}
			try {
				this.pi.play(); //发射子弹音
			} catch (e) {
				console.log('音乐加载失败');
			}
		}
	},
	// //boss生成函数
	generateBoss: function () {
		var now = game.time.now; //获取现在时间
		var time = 60000;
		if (now - this.bosss.lastbossTime > time && game.score >= bossV * 2000) {
			var key = 'boss' + bossV;
			this.boss = this.bosss.getFirstExists(false, true, game.width / 2 - 30, -50, key); //从敌机组group取出敌机,如果组中没有就会创建一个
			game.add.tween(this.boss).to({ y: 10 }, 2000, Phaser.Easing.Quadratic.InOut, true);
			game.physics.arcade.enable(this.boss); //给敌机挂载物理引擎
			this.boss.body.collideWorldBounds = true;
			this.boss.lastFireTime = 0;
			if (bossV == 1) {
				this.boss.bulletTime = 800;
				this.boss.life = 80;
				this.boss.score = 1000;
			}
			if (bossV == 2) {
				this.boss.bulletTime = 1200;
				this.boss.life = 100;
				this.boss.score = 2000;
			}
			if (bossV == 3) {
				this.boss.bulletTime = 1200;
				this.boss.life = 120;
				this.boss.score = 3000;
			}
			this.bosss.lastbossTime = now;
		}
	},
	//boss子弹生成函数
	bossFire: function () {
		var now = game.time.now;
		this.bosss.forEachAlive(function (boss) {
			if (boss.life > 0 && now - boss.lastFireTime > boss.bulletTime) {
   console.log(bossV);
				if (bossV == 1 || bossV == 3) {
					var bossBullet = this.bossBullets.getFirstExists(false, true, boss.x + 10, boss.y + 40, 'bossBullet');
					bossBullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
					bossBullet.checkWorldBounds = true; //检测敌机碰撞边界
					bossBullet.anchor.setTo(0.5, 0.5); //设置锚点
					game.physics.arcade.enable(bossBullet); //给敌机子弹挂载物理引擎
					bossBullet.body.velocity.y = 85; //敌机子弹重力（速度）

					var bossBullet = this.bossBullets.getFirstExists(false, true, boss.x + 60, boss.y + 40, 'bossBullet');
					bossBullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
					bossBullet.checkWorldBounds = true; //检测敌机碰撞边界
					bossBullet.anchor.setTo(0.5, 0.5); //设置锚点
					game.physics.arcade.enable(bossBullet); //给敌机子弹挂载物理引擎
					bossBullet.body.velocity.y = 85; //敌机子弹重力（速度）
				}
				if (bossV == 2 || bossV == 3) {
					var bossBullet = this.bossBullets.getFirstExists(false, true, boss.x + 50, boss.y + 40, 'bossBullet');
					bossBullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
					bossBullet.checkWorldBounds = true; //检测敌机碰撞边界
					bossBullet.anchor.setTo(0.5, 0.5); //设置锚点
					game.physics.arcade.enable(bossBullet); //给敌机子弹挂载物理引擎
					bossBullet.body.velocity.y = 85; //敌机子弹重力（速度）

					var bossBullet = this.bossBullets.getFirstExists(false, true, boss.x + 50, boss.y + 40, 'bossBullet');
					bossBullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
					bossBullet.checkWorldBounds = true; //检测敌机碰撞边界
					bossBullet.anchor.setTo(0.5, 0.5); //设置锚点
					game.physics.arcade.enable(bossBullet); //给敌机子弹挂载物理引擎
					bossBullet.body.velocity.y = 83; //敌机子弹重力（速度）
					bossBullet.body.velocity.x = 20;

					var bossBullet = this.bossBullets.getFirstExists(false, true, boss.x + 50, boss.y + 40, 'bossBullet');
					bossBullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
					bossBullet.checkWorldBounds = true; //检测敌机碰撞边界
					bossBullet.anchor.setTo(0.5, 0.5); //设置锚点
					game.physics.arcade.enable(bossBullet); //给敌机子弹挂载物理引擎
					bossBullet.body.velocity.y = 83; //敌机子弹重力（速度）
					bossBullet.body.velocity.x = -20;

					var bossBullet = this.bossBullets.getFirstExists(false, true, boss.x + 50, boss.y + 40, 'bossBullet');
					bossBullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
					bossBullet.checkWorldBounds = true; //检测敌机碰撞边界
					bossBullet.anchor.setTo(0.5, 0.5); //设置锚点
					game.physics.arcade.enable(bossBullet); //给敌机子弹挂载物理引擎
					bossBullet.body.velocity.y = 78; //敌机子弹重力（速度）
					bossBullet.body.velocity.x = 40;

					var bossBullet = this.bossBullets.getFirstExists(false, true, boss.x + 50, boss.y + 40, 'bossBullet');
					bossBullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
					bossBullet.checkWorldBounds = true; //检测敌机碰撞边界
					bossBullet.anchor.setTo(0.5, 0.5); //设置锚点
					game.physics.arcade.enable(bossBullet); //给敌机子弹挂载物理引擎
					bossBullet.body.velocity.y = 78; //敌机子弹重力（速度）
					bossBullet.body.velocity.x = -40;
				}
				boss.lastFireTime = now;
			}

			// if (boss.life)
		}, this);
	},
	// 封装敌机生成函数
	generateEnemy: function () {
		var now = game.time.now; //获取现在时间
		var time = 1500 - game.score / 10;
		if (time <= 500) {
			time = 500;
		}
		// 当现在时间减去this.lastBulletTime大于2000时生成敌机
		if (now - this.enemys.lastEnemyTime > time && !this.boss) {
			var enemyIndex = game.rnd.integerInRange(0, 2); //取0-2随机数
			var key = 'enemy' + (enemyIndex + 1);
			var size = game.cache.getImage(key).width; //game.cache拿到缓存中的图片信息
			var x = game.rnd.integerInRange(size / 2, game.width - size / 2);
			var y = 0;
			var enemy = this.enemys.getFirstExists(false, true, x, y, key); //从敌机组group取出敌机,如果组中没有就会创建一个

			enemy.index = enemyIndex + 1;
			enemy.outOfBoundsKill = true; //当敌机飞出边界回收子弹
			enemy.checkWorldBounds = true; //检测敌机碰撞边界
			enemy.anchor.setTo(0.5, 0.5); //设置敌机锚点为中心
			game.physics.arcade.enable(enemy); //给敌机挂载物理引擎
			enemy.body.setSize(size, size); //设置碰撞体积，精灵碰撞体积和自身尺寸可以不同
			enemy.body.velocity.y = 50; //敌机重力（速度）
			enemy.size = size; //方便外面获取size

			enemy.lastFireTime = 0;

			if (enemyIndex == 0) {
				enemy.bulletV = 100;
				enemy.bulletTime = 6000;
				enemy.life = 2;
				enemy.score = 10;
			} else if (enemyIndex == 1) {
				enemy.bulletV = 150;
				enemy.bulletTime = 4000;
				enemy.life = 3;
				enemy.score = 20;
			} else if (enemyIndex == 2) {
				enemy.bulletV = 200;
				enemy.bulletTime = 2000;
				enemy.life = 4;
				enemy.score = 30;
			}

			this.enemys.lastEnemyTime = now;
		}
	},
	//封装敌机子弹生成函数
	enemyFire: function () {
		var now = game.time.now; //获取现在时间
		this.enemys.forEachAlive(function (enemy) {
			if (now - enemy.lastFireTime > enemy.bulletTime) {
				var Bullet = this.enemysBullets.getFirstExists(false, true, enemy.x, enemy.y + enemy.size / 2, 'bullet'); //从敌机子弹组group取出敌机,如果组中没有就会创建一个
				Bullet.outOfBoundsKill = true; //当敌机飞出边界回收子弹
				Bullet.checkWorldBounds = true; //检测敌机碰撞边界
				Bullet.anchor.setTo(0.5, 0.5); //设置锚点
				game.physics.arcade.enable(Bullet); //给敌机子弹挂载物理引擎
				Bullet.body.velocity.y = enemy.bulletV; //敌机子弹重力（速度）

				enemy.lastFireTime = now;
			}
		}, this);
	},
	//调试
	// render: function () {
	// 	if (this.enemys) {
	// 		this.enemys.forEachAlife(function (enemy) {
	// 			game.debug.body(enemy);
	// 		});
	// 	}
	// },
};
//******************************************************************************************************************************* */
//游戏结束场景
game.MyStates.over = {
	create: function () {
		game.add.sprite(0, 0, 'bg'); //加载背景

		var myplane = game.add.sprite(100, 100, 'myplane'); //加载首页飞机
		myplane.animations.add('fly'); // 飞机添加动画
		myplane.animations.play('fly', 15, true); //(动画名称， 播放快慢， 循环播放)

		game.add.button(30, 300, 'replaybutton', this.onReplayClick, this, 0, 0, 1); //定义重来按钮
		game.add.button(140, 300, 'sharebutton', this.onShareClick, this, 0, 0, 1); //定义分享按钮

		var style = { font: '25px', fill: 'red', align: 'center' };
		var text = game.add.text(game.world.centerX, game.world.centerY, '分数：' + game.score, style);
		text.anchor.set(0.5);
	},
	onReplayClick: function () {
		game.state.start('play');
		game.score = 0;
		bossV = 1;
		game.playerLife = 1;
	},
	onShareClick: function () {
		$('.share').show();
	},
};

// 场景1中预加载的东西可以在场景2中加载，所以可以专门设置一个加载场景
//添加场景
game.state.add('boot', game.MyStates.boot);
game.state.add('load', game.MyStates.load);
game.state.add('start', game.MyStates.start);
game.state.add('play', game.MyStates.play);
game.state.add('over', game.MyStates.over);

// 加载场景
game.state.start('boot'); //第二个参数是布尔值，为false时切换场景不会删除上一场景精灵
