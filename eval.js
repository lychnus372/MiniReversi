
class EV extends CONSTANTS {
	constructor(){
		super();
		this.weights = new Float32Array(6561);

		this.temp_weights;
        
		//index table
		this.indexb = new Uint16Array(256);
		this.indexw = new Uint16Array(256);
		for(let i=0;i<256;i++){
			this.indexb[i] = parseInt(parseInt(i.toString(2),10)*2,3);
			this.indexw[i] = this.indexb[i]/2;
		}
	}
	
	//

	evaluation(board){
	
		const shape = board.shape();
		let index = 0, score = 0;
		
		const weights = this.weights;
		const indexb = this.indexb;
		const indexw = this.indexw;
		
		//horizontal 1
		//上辺
		index = indexb[shape[0]] + indexw[shape[1]];
		score += weights[index];
		//下辺
		index = indexb[shape[2]] + indexw[shape[3]];
		score += weights[index];
		//右辺
		index = indexb[shape[4]] + indexw[shape[5]];
		score += weights[index];
		//左辺
		index = indexb[shape[6]] + indexw[shape[7]];
		score += weights[index];
		
		
		if(isNaN(score)){
			throw 'error score is NaN';
		}
		
		return score/16;
	}
	
	updateWeights(board, e){

			
		const shape = board.shape();
		let index = 0, score = 0;
		
		const weights = this.weights;
		const indexb = this.indexb;
		const indexw = this.indexw;

		
		//accurate evaluation of this node
		const y = e;
		//predicted evaluation of this node
		const W = this.evaluation(board);
		//delta
		const delta = (y - W)*this.learning_rate;

		
		//上辺
		index = indexb[shape[0]] + indexw[shape[1]];
		weights[index] += delta;
		//下辺
		index = indexb[shape[2]] + indexw[shape[3]];
		weights[index] += delta;
		//右辺
		index = indexb[shape[4]] + indexw[shape[5]];
		weights[index] += delta;
		//左辺
		index = indexb[shape[6]] + indexw[shape[7]];
		weights[index] += delta;
		
		return score/16;
	}

	train(iter=100){
		
		for(let i=0;i<iter;i++){
			const node1 = master.generateNode();
			const node2 = this.rotateBoard(node1);
			const node3 = this.rotateBoard(node2);
			const node4 = this.rotateBoard(node3);
			const node5 = this.flipBoard(node1);
			const node6 = this.rotateBoard(node5);
			const node7 = this.rotateBoard(node6);
			const node8 = this.rotateBoard(node7);
			
			const value = ai.negaScout(node1, -16, 16, -1);

			this.updateWeights(node1, value);
			this.updateWeights(node2, value);
			this.updateWeights(node3, value);
			this.updateWeights(node4, value);
			this.updateWeights(node5, value);
			this.updateWeights(node6, value);
			this.updateWeights(node7, value);
			this.updateWeights(node8, value);
		}
	}
	
	flipBoard(board){
		const reverse = (x)=>{
			x = ((x&0b1010)>>>1) | ((x&0b0101)<<1);
			x = ((x&0b1100)>>>2) | ((x&0b0011)<<2);
			return x;
		};
		
		const black = board.black;
		const white = board.white;
		
		const b0 = reverse((black>>>12) & 0b1111);
		const b1 = reverse((black>>>8) & 0b1111);
		const b2 = reverse((black>>>4) & 0b1111);
		const b3 = reverse((black>>>0) & 0b1111);
		const w0 = reverse((white>>>12) & 0b1111);
		const w1 = reverse((white>>>8) & 0b1111);
		const w2 = reverse((white>>>4) & 0b1111);
		const w3 = reverse((white>>>0) & 0b1111);

		const newboard = new BOARD(board);
		
		newboard.black = (b0<<12)|(b1<<8)|(b2<<4)|(b3);
		newboard.white = (w0<<12)|(w1<<8)|(w2<<4)|(w3);

		return newboard;
	}

	rotateBoard(board){
		const reverse = (x)=>{
			x = ((x&0b1010)>>>1) | ((x&0b0101)<<1);
			x = ((x&0b1100)>>>2) | ((x&0b0011)<<2);
			return x;
		};
		
		const black = board.black;
		const white = board.white;
	
		const b0 = (black>>>12) & 0b1111;
		const b1 = (black>>>8) & 0b1111;
		const b2 = (black>>>4) & 0b1111;
		const b3 = (black>>>0) & 0b1111;
		const w0 = (white>>>12) & 0b1111;
		const w1 = (white>>>8) & 0b1111;
		const w2 = (white>>>4) & 0b1111;
		const w3 = (white>>>0) & 0b1111;
		
		const newboard = new BOARD(board);
		let lineb, linew, newBlack = 0, newWhite = 0;

		//vertical
		lineb = ((b0&1)<<3)|((b1&1)<<2)|((b2&1)<<1)|((b3&1));
		linew = ((w0&1)<<3)|((w1&1)<<2)|((w2&1)<<1)|((w3&1));
		newBlack |= lineb<<12;
		newWhite |= linew<<12;
		
		lineb = ((b0&2)<<2)|((b1&2)<<1)|((b2&2))|((b3&2)>>1);
		linew = ((w0&2)<<2)|((w1&2)<<1)|((w2&2))|((w3&2)>>1);
		newBlack |= lineb<<8;
		newWhite |= linew<<8;
		
		lineb = ((b0&4)<<1)|((b1&4))|((b2&4)>>1)|((b3&4)>>2);
		linew = ((w0&4)<<1)|((w1&4))|((w2&4)>>1)|((w3&4)>>2);
		newBlack |= lineb<<4;
		newWhite |= linew<<4;

		lineb = ((b0&8))|((b1&8)>>1)|((b2&8)>>2)|((b3&8)>>3);
		linew = ((w0&8))|((w1&8)>>1)|((w2&8)>>2)|((w3&8)>>3);
		newBlack |= lineb;
		newWhite |= linew;
		
		newboard.black = newBlack;
		newboard.white = newWhite;

		return newboard;
	}
	
    int2float(){
		this.temp_weights = this.weights;
		this.weights = new Float32Array(6561*this.num_phase*this.num_shape);
		this.weights.set(this.temp_weights);
	}
	
	float2int(){
		const newarr = new Int8Array(this.buffer);
		for(let i=0;i<6561*this.num_phase*this.num_shape;i++){
			newarr[i] = Math.max(Math.min(127, this.weights[i]), -128);
		}
        this.weights = newarr;
    }	
}