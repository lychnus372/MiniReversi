// properties
// black white turn stones


//BOARD_DATA holds stone location, current turn, sum of stones
class BOARD {
	constructor(board){
		this.black = 0b0000001001000000;
		this.white = 0b0000010000100000;
		this.turn = 1;
		this.stones = 4;
		
		if(board instanceof BOARD){
			this.black = board.black;
			this.white = board.white;
			this.turn = board.turn;
			this.stones = board.stones;
		}
	}

	
	placeAndTurnStones(hand){

	
		if(this.turn===-1){//white turn
			const temp = this.black;
			this.black = this.white;
			this.white = temp;
		}
		
		const black = this.black;
		const white = this.white;

		const horizontalMask = 0b0110011001100110 & white;
		const verticalMask = 0b0000111111110000 & white;
		const edgeMask = 0b0000011001100000 & white;

		let temp;
		
		//+1
		temp  = horizontalMask & (hand<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		if((temp<<1)&black){
			this.black ^= temp;
			this.white ^= temp;
		}

		//-1
		temp  = horizontalMask & (hand>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		if((temp>>1)&black){
			this.black ^= temp;
			this.white ^= temp;
		}

		//+8
		temp  = verticalMask & (hand<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		if((temp<<4)&black){
			this.black ^= temp;
			this.white ^= temp;
		}

		//+8
		temp  = verticalMask & (hand>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		if((temp>>4)&black){
			this.black ^= temp;
			this.white ^= temp;
		}

		//-7
		temp  = edgeMask & (hand>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		if((temp>>3)&black){
			this.black ^= temp;
			this.white ^= temp;
		}

		//-7
		temp  = edgeMask & (hand>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		if((temp>>5)&black){
			this.black ^= temp;
			this.white ^= temp;
		}

		//+7
		temp  = edgeMask & (hand<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		if((temp<<3)&black){
			this.black ^= temp;
			this.white ^= temp;
		}

		//-9
		temp  = edgeMask & (hand<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		if((temp<<5)&black){
			this.black ^= temp;
			this.white ^= temp;
		}
		
		this.black |= hand;
	
		if(this.turn===-1){//white turn
			const temp = this.black;
			this.black = this.white;
			this.white = temp;
		}
	
		
		//change turn
		this.turn*=-1;
		//add stone
		this.stones++;
		
	}

	legalHand(){

	
		if(this.turn===-1){//white turn
			const temp = this.black;
			this.black = this.white;
			this.white = temp;
		}
		
		const black = this.black;
		const white = this.white;

		const horizontalMask = 0b0110011001100110 & white;
		const verticalMask = 0b0000111111110000 & white;
		const edgeMask = 0b0000011001100000 & white;
		const blankBoard = ~(black|white);

		let temp, legalhand = 0;

		//+1
		temp  = horizontalMask & (black<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		temp |= horizontalMask & (temp<<1);
		legalhand |= blankBoard & (temp<<1);

		//-1
		temp  = horizontalMask & (black>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		temp |= horizontalMask & (temp>>1);
		legalhand |= blankBoard & (temp>>1);

		//+8
		temp  = verticalMask & (black<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		temp |= verticalMask & (temp<<4);
		legalhand |= blankBoard & (temp<<4);

		//+8
		temp  = verticalMask & (black>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		temp |= verticalMask & (temp>>4);
		legalhand |= blankBoard & (temp>>4);

		//-7
		temp  = edgeMask & (black>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		temp |= edgeMask & (temp>>5);
		legalhand |= blankBoard & (temp>>5);

		//-7
		temp  = edgeMask & (black>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		temp |= edgeMask & (temp>>3);
		legalhand |= blankBoard & (temp>>3);

		//+7
		temp  = edgeMask & (black<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		temp |= edgeMask & (temp<<3);
		legalhand |= blankBoard & (temp<<3);

		//-9
		temp  = edgeMask & (black<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		temp |= edgeMask & (temp<<5);
		legalhand |= blankBoard & (temp<<5);
		
		if(this.turn===-1){//white turn
			const temp = this.black;
			this.black = this.white;
			this.white = temp;
		}
	
		return legalhand;
	}

	expand(){
		const childNodes = [];
		const board = this;
		let legalhand = this.legalHand();

		while(legalhand){
			const bit = -legalhand & legalhand;
			const child = new BOARD(this);
			child.placeAndTurnStones(bit);
			child.hand = bit;
			legalhand ^= bit;
			childNodes.push(child);
		}
		return childNodes;
	}

	state(){
		
		const legalhand = this.legalHand();
		
		if(legalhand){
			return 1;
		}
		
		this.turn *= -1;
		const legalhand_ = this.legalHand();
		this.turn *= -1;
		
		if(legalhand_){
			return 2;
		}else{
			return 3;
		}
		
	}

	b_w(){
		let temp;

		temp = this.black;
		temp = (temp&0b0101010101010101) + ((temp>>1)&0b0101010101010101);
		temp = (temp&0b0011001100110011) + ((temp>>2)&0b0011001100110011);
		temp = (temp&0b0000111100001111) + ((temp>>4)&0b0000111100001111);
		temp = (temp&0b0000000011111111) + ((temp>>8)&0b0000000011111111);
		
		return (temp<<1) - this.stones;;
	}

	swap(){
		const temp = this.black;
		this.black = this.white;
		this.white = temp;
	}

	shape(){
		const list = new Array(8);

		const black = this.black;
		const white = this.white;

		const b0 = (black>>12)&0b1111;
		const b1 = (black>>8)&0b1111;
		const b2 = (black>>4)&0b1111;
		const b3 = (black>>0)&0b1111;
		const w0 = (white>>12)&0b1111;
		const w1 = (white>>8)&0b1111;
		const w2 = (white>>4)&0b1111;
		const w3 = (white>>0)&0b1111;

		// up
		list[0] = (b0<<4) | b1;
		list[1] = (w0<<4) | w1;

		// down
		list[2] = (b3<<4) | b2;
		list[3] = (w3<<4) | w2;

		// right
		list[4] = ((b0&1)<<7)|((b1&1)<<6)|((b2&1)<<5)|((b3&1)<<4)|((b0&2)<<2)|((b1&2)<<1)|((b2&2))|((b3&2)>>1);
		list[5] = ((w0&1)<<7)|((w1&1)<<6)|((w2&1)<<5)|((w3&1)<<4)|((w0&2)<<2)|((w1&2)<<1)|((w2&2))|((w3&2)>>1);

		// left
		list[6] = ((b0&8)<<4)|((b1&8)<<3)|((b2&8)<<2)|((b3&8)<<1)|((b0&4)<<1)|((b1&4))|((b2&4)>>1)|((b3&4)>>2);
		list[7] = ((w0&8)<<4)|((w1&8)<<3)|((w2&8)<<2)|((w3&8)<<1)|((w0&4)<<1)|((w1&4))|((w2&4)>>1)|((w3&4)>>2);

		return list;
	}
	
}
