//探査では、currentTurn から見た評価値が返される。

class AI extends EV {
	constructor(arg){
		super(arg);
	}
	
	negaScout(node, alpha, beta, depth, showStatus=false){

		const argnode = new BOARD(node);
		let num_readnode = 0;
		let value = 0;

		
		const search = (board, alpha, beta, depth)=>{
			num_readnode++;

			if(depth===0){
				return this.evaluation(board)*board.turn;
			}
		
			const state = board.state(board);
			let max = -16, v = 0;
			
			if(state===1){
				//expand child node
				const childNodes = board.expand();
				
				for(const child of childNodes){
					child.e = -this.evaluation(child)*child.turn;
				}
				
				//move ordering
				if(board.stones<10){
					childNodes.sort((a,b)=>{return b.e-a.e});
				}
				
				max = v = -search(childNodes[0], -beta, -alpha, depth-1);
				if(beta<=v){return v;} //cut
				if(alpha<v){alpha = v;}
				
				for(let i=1;i<childNodes.length;i++){
					v = -search(childNodes[i], -alpha-1, -alpha, depth-1);
					if(beta<=v){return v;}
					if(alpha<v){
						alpha = v;
						v = -search(childNodes[i], -beta, -alpha, depth-1);
						if(beta<=v){return v;}
						if(alpha<v){alpha = v;}
					}
					if(max<v){max = v;}
				}
				
				return max;
			}else if(state===2){ //pass
				const child = new BOARD(board);
				child.turn *= -1;
				return -search(child, -beta, -alpha, depth-1);
			}else{ //game finish
				return board.b_w()*board.turn;
			}
		}

		value = search(argnode, alpha, beta, depth);
		if(showStatus){
			console.log(`NegaScout\nread nodes: ${num_readnode}\nevaluation: ${value}`);
		}
		return value;
	}

	cpuHand(board, alpha=-100, beta=100, depth=0, showStatus=false){
		
		const startTime = performance.now();
		const childNodes = board.expand();
		let rand=0, temp=0;

		if(childNodes.length===0){
			return childNodes;
		}
		
		for(const child of childNodes){
			child.e = -this.negaScout(child, alpha, beta, depth)
		}
		// sort
		childNodes.sort((a,b)=>{return b.e-a.e});
		
		//最大値がいくつあるかをrandにカウント
		for(let i=1;i<childNodes.length;i++){
			if(~~childNodes[0].e===~~childNodes[i].e){
				rand = i;
			}else{
				break;
			}
		}
		
		//0番目とrand番目を入れ替える
		rand = ~~(Math.random() * rand);
		temp = childNodes[0];
		childNodes[0] = childNodes[rand];
		childNodes[rand] = temp;
		
		if(showStatus){
			console.log(
				"read " + this.num_readnode + " nodes\n" + 
				"process time " + (performance.now()-startTime) + " ms\n" + 
				(~~(this.num_readnode/(performance.now()-startTime))) + " nodes per ms\n" + 
				"cpu put at " + childNodes[rand].hand + "\n"
			);
		}
		
		return childNodes;
	}
	
	randomHand(board){
		const childNodes = new Array();
		let legalhand = board.legalHand();

		if(legalhand===0){
			return childNodes;
		}
		
		while(legalhand){
			const bit = -legalhand & legalhand;
			const child = new BOARD(board);
			child.placeAndTurnStones(bit);
			child.hand = bit;
			childNodes.push(child);
			legalhand ^= bit;
		}
		
		childNodes.sort(()=>Math.random()-0.5);

		return childNodes;
	}
	
}

const ai = new AI();
