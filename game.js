
class GRAPHIC extends CONSTANTS{
	constructor(){
		super();
	}

	render(node=this.now){
		
		const black = node.black;
		const white = node.white;
		let num_black = node.black;
		let num_white = node.white;
		
		//評価値を消す
		for(let value of squares){
			value.className = '';
		}
		
		//石の数をカウント
		num_black = (num_black&0b0101010101010101) + ((num_black>>1)&0b0101010101010101);
		num_black = (num_black&0b0011001100110011) + ((num_black>>2)&0b0011001100110011);
		num_black = (num_black&0b0000111100001111) + ((num_black>>4)&0b0000111100001111);
		num_black = (num_black&0b0000000011111111) + ((num_black>>8)&0b0000000011111111);
		num_white = (num_white&0b0101010101010101) + ((num_white>>1)&0b0101010101010101);
		num_white = (num_white&0b0011001100110011) + ((num_white>>2)&0b0011001100110011);
		num_white = (num_white&0b0000111100001111) + ((num_white>>4)&0b0000111100001111);
		num_white = (num_white&0b0000000011111111) + ((num_white>>8)&0b0000000011111111);
		
		//石を置く
		for(let i=0, bit=1;i<16;i++){
			if(black&bit){
				circles[15-i].className = 'black';
			}else if(white&bit){
				circles[15-i].className = 'white';	
			}else{
				circles[15-i].className = 'blank';
			}
			bit <<= 1;
		}
		
		black_score.innerText = num_black + '';
		white_score.innerText = num_white + '';
		
		if(node.turn!==this.colorOfCpu){
			comment.innerText = 'player turn';
		}
		
		if(node.state()===3){//終局
			if(num_black > num_white){
				comment.innerText = 'black win';
			}else if(num_black < num_white){
				comment.innerText = 'white win';
			}else{
				comment.innerText = 'draw';
			}
			
			return;
		}
	}
	
	showEval(node=0, alpha=-100,beta=100, depth=this.depth){
		if(!node){
			node = this.now;
		}
		
		const evals = ai.cpuHand(node, alpha, beta, depth);

		if(evals.length===0){
			return;
		}

		// delete former evels
		for(let element of circles){
			element.innerText = '';
		}

		for(let node of evals){
			const hand = node.hand;
			let put = 0;
			if(hand[0]<0){
				put = 1;
			}else if(hand[0]>0){
				put = 32-Math.log2(hand[0]);
			}
			if(hand[1]<0){
				put = 33;
			}else if(hand[1]>0){
				put = 64-Math.log2(hand[1]);
			}

			circles[put-1].innerText = node.e;
			if(node.e>0){
				circles[put-1].className = 'eval_plus';
				circles[put-1].innerText = (node.e + '').slice(0, 5);
			}else{
				circles[put-1].className = 'eval_minus';
				circles[put-1].innerText = (node.e + '').slice(0, 5);
			}
		}
		
		return;
	}
	
	showMove(node=this.now){

		const legalhand = node.legalHand();
		
		for(let i=0;i<16;i++){
			if(legalhand&(1<<i)){
				squares[15-i].className = 'legal';
			}else{
				squares[15-i].className = '';
			}
		}
	}
	
	showLastPlace(node=this.now){
		
		if(!Array.isArray(node.hand)){
			for(let i=0;i<16;i++){
				if(squares[i].className==='lastput'){
					squares[i].className==='';
				}
			}
			return;
		}
		const e = Math.log2(node.hand);
		squares[e].className = 'lastput';
	}
}



class MASTER extends GRAPHIC {
	constructor(){
		super();
		this.mode = 'gameb';
		this.record = [new BOARD()];
	}

	resetGame(){
		this.mode = 'gameb';
		this.record = [new BOARD()];
		this.render(this.now);
	}
	
	//最新のBoardを返す
	get now(){
		return this.record[0];
	}
	
	//ゲームを進行する
	play(hand){
		const legalhand = this.now.legalHand();
		
		if(!(hand===0)){//handle illegal hand
			if(!(legalhand&hand)){
				console.error(`error ( ${hand} ) is illegal hand`);
				return;
			}
		}
		
		//思考中のタッチ操作を無効にする
		clickDisabled = true;

		const player_turn = ()=>{ return new Promise((resolve)=>{
			if(this.now.turn===this.colorOfCpu){
				resolve();
			}else{
				this.record.unshift(new BOARD(this.now));
				this.now.placeAndTurnStones(hand);
				resolve();
			}
		});};
		
		const cpu_turn = ()=>{ return new Promise((resolve)=>{
			if(this.now.state()===1){
				this.record.unshift(new BOARD(this.now));
				const move = ai.cpuHand(this.now, -100, 100, this.depth, true);
				this.now.placeAndTurnStones(move[0].hand);
				this.now.hand = move[0].hand;
			}else if(this.now.state()===2){
				this.record.unshift(new BOARD(this.now));
				this.now.turn *= -1;
				resolve();
			}else{
				console.log('終局');
				resolve();
			}
			
			if(this.now.state()===1){
				resolve();
			}else if(this.now.state()===2){
				this.record.unshift(new BOARD(this.now));
				this.now.turn *= -1;
				this.play(0);
				resolve();
			}else{
				resolve();
			}
		});};
		
		const render = ()=>{return new Promise((resolve)=>{
			setTimeout(() => {
				resolve();
			}, 50);
			this.render(this.now);
			this.showMove(this.now);
			this.showLastPlace(this.now);
		});};
		

		player_turn()
			.then(render)
			.then(cpu_turn)
			.then(render)
			.catch(e=>{
				console.error(e);
			});

			
		
		//クリック操作を有効化
		clickDisabled = false;
		
		return;
	}

	get state(){
		return this.now.state;
	}

	generateGame(random_rate=0){
		const node_now = new BOARD();
		const nodes = [new BOARD(node_now)];
		
		while(true){
			const state = node_now.state();

			if(state===1){
				const move = ai.cpuHand(node_now, -100, 100, 0);
				const index = Math.random()<random_rate ? Math.floor(Math.random()*move.length) : 0;
				const next_move = move[index];
				const next_node = new BOARD(next_move);
				next_node.e = -next_move.e;
				nodes.push(next_node);
				node_now.placeAndTurnStones(next_move.hand);
			}else if(state===2){
				node_now.turn *=-1;
			}else{
				break;
			}
		}
		return nodes;
	}
    
    generateNode(N=1){
		if(N===1){
			N = Math.floor(Math.random()*9)+5;
		}
		const n = Math.max(Math.min(14, N), 4);
		let node_now = new BOARD();
		
		while(true){
			const state = node_now.state();
			
			if(node_now.stones===n){
				node_now.turn = 1;
				return node_now;
			}

			if(state===1){
				const move = ai.randomHand(node_now);
				node_now.placeAndTurnStones(move[0].hand);
			}else if(state===2){
				node_now.turn *= -1;
			}else{
				if(node_now.stones===N){
					node_now.turn = 1;
					return node_now;
				}else{
					node_now = new BOARD();
				}
			}
		}
	}

}
const master = new MASTER();




const selfPlay = (num_iter=1, random_rate=0)=>{
	
	for(let i=0;i<num_iter;i++){
		const game = master.generateGame(random_rate);
		const last = game[game.length-1];
		const value = last.b_w();
		for(const node of game){
			if(node.turn===1){
				node.e = value;
			}else{
				node.swap();
				node.e = -value;
			}

			node.turn = 1;
			backup.push(node);
		}
	}
};


const trainEV = ()=>{
	const weights_temp = new Float32Array(6561);
	const indexb = ai.indexb;
	const indexw = ai.indexw;

	while(backup.length>0){
		const node = backup.pop();
		const value = node.e;

		const node1 = new BOARD(node);
		const node2 = ai.rotateBoard(node1);
		const node3 = ai.rotateBoard(node2);
		const node4 = ai.rotateBoard(node3);
		const node5 = ai.flipBoard(node1);
		const node6 = ai.rotateBoard(node5);
		const node7 = ai.rotateBoard(node6);
		const node8 = ai.rotateBoard(node7);

		for(let node of [node1, node2, node3, node4, node5, node6, node7, node8]){
			const shape = node.shape();

			//上辺
			index = indexb[shape[0]] + indexw[shape[1]];
			weights_temp[index] += value;
			//下辺
			index = indexb[shape[2]] + indexw[shape[3]];
			weights_temp[index] += value;
			//右辺
			index = indexb[shape[4]] + indexw[shape[5]];
			weights_temp[index] += value;
			//左辺
			index = indexb[shape[6]] + indexw[shape[7]];
			weights_temp[index] += value;
			
		}
	}
	
	return weights_temp;
};

const montecarlo = (random_rate=0)=>{
	const N = 50000;
	selfPlay(N, random_rate);
	const w = trainEV();
	for(let i=0;i<w.length;i++){
		if(w[i]===0){
			continue;
		}
		ai.weights[i] = ai.weights[i]*0.7 + w[i]/N*0.3;
	}
};