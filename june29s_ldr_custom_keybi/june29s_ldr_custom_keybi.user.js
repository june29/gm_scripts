// ==UserScript==
// @name           june29's LDR Custom Keybinds
// @namespace      http://june29.jp/
// @include        http://reader.livedoor.com/reader/*
// @include        http://fastladder.com/reader/*
// ==/UserScript==

window.addEventListener("load", function() {
	with(unsafeWindow){

		//j/k�ł��̃t�B�[�h�ֈړ�
		Keybind.add("j",Control.go_next);
		Keybind.add("k",Control.go_prev);

		//p�s���𗧂Ă��玟�̃A�C�e���Ɉړ�
		Keybind.add('p', function(){
			Control.pin();
			Control.go_next();
		})

		//S-j�A�C�e����o�b�N�O���E���h�ŊJ���Ď��̃A�C�e���Ɉړ�
		Keybind.add('o', function(){
			var item = get_active_item(true);
			if (!item) return;
			GM_openInTab(item.link);
			Control.go_next();
		})
		
		//S-m�t�B�[�h�̃A�C�e����ׂăo�b�N�O���E���h�ŊJ��
		Keybind.add('M', function(){
			var queue = new Queue();
			get_active_feed().items.forEach(function(item){
				queue.push(function(){
					GM_openInTab(item.link);
				});
			});
			queue.interval = 200;
			queue.exec();
		})

		//�g��Ȃ��L�[�o�C���h�폜
		Keybind.remove("b");
		Keybind.remove("i");
	}
},false);
