const size = 40;
let counter = 0;
let clickDisabled = false;
const canvas = new Object();

const backup = new Array();


class CONSTANTS{
    constructor(){
		this.num_phase = 61;
		this.num_shape = 11;
		this.learning_rate = 1/2/4;
		this.colorOfCpu = -1;
        this.num_readnode = 0;
        this.depth = 14;
    }
}

const createElement = (element='',className='', id='')=>{
    if(element===''){
        element = 'div';
    }
    const div = document.createElement(element);
    if(className!==''){
        div.className = className;
    }
    if(id!==''){
        div.id = id;
    }
    return div;
};

const container = document.body;
const black_score = createElement('div', '', 'black_score');
const white_score = createElement('div', '', 'white_score');
const comment = createElement('div', '', 'comment');
const board = createElement('div', '', 'board');




const squares = new Array();
const circles = new Array();
const package = createElement('div');

(()=>{


	// generate board table
    const table = createElement('table');
	for(let i=0;i<4;i++){
		const tr = createElement('tr');
		for(let j=0;j<4;j++){
			const td = createElement('td');
			const div = createElement('div', 'blank');
			// on mouse click
			td.addEventListener('mousedown', ()=>{
				const e = 1<<(15-i*4+-j);
				master.play(e);
			});
			// on touch start
			td.addEventListener('touchstart', ()=>{
				const e = 1<<(15-i*4+-j);
				master.play(e);
			});

			td.appendChild(div);
			tr.appendChild(td);
			squares.push(td);
			circles.push(div);
		}
		table.appendChild(tr);
	}


    // initialize comment box
    comment.innerText = 'player turn';
	
	
    board.appendChild(table);

    // set score box
    const black_stone = createElement('div', 'black minimize', 'black_stone');
    const white_stone = createElement('div', 'white minimize', 'white_stone');
    container.appendChild(black_stone);
    container.appendChild(black_score);
    container.appendChild(white_stone);
	container.appendChild(white_score);


	// append search depth box
	const depth0 = createElement('div', '', 'depth0');
	depth0.innerText = 14;
	container.appendChild(depth0);


	
	// set click event of search depth
	document.body.addEventListener('click', (e)=>{
		const target = e.target;
		
		if(target.id==='depth0'){
			const list = ['1', '2', '4', '8', '14', '1'];
			const indexof = list.indexOf(target.innerText);
			const depth = list[indexof + 1];
			target.innerText = depth;
			master.depth = parseInt(depth, 10);
		}
	});
	
})();


container.appendChild(comment);
container.appendChild(board);