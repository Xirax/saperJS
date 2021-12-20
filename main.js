
const boardGenerator = {

    HEIGHT: 0,
    WIDTH: 0,
    BOMBS: 0,
    REMAINING: 0,
    ACTIVE: true,

    BOARD: [],

    getValueAt: function(hPos, wPos) {
        
        return this.BOARD[hPos][wPos];
    },

    setValueAt: function(hPos, wPos, val){

        this.BOARD[hPos][wPos] = val;
    },

    revealBombs: function(){

        this.ACTIVE = false;

        for(let i=0; i<this.HEIGHT; i++){

            for(let j=0; j<this.WIDTH; j++){

                if(this.BOARD[i][j] == 10){

                    console.log('FOUND BOMB');

                    let ID = 'C_' + i + '_' + j;

                    document.getElementById(ID).style.backgroundColor = 'red';
                    document.getElementById(ID).innerHTML = '<img class="icon" src="./imgs/bomb.png">';
                }

            }
        }

    },


    revealField: function(hPos, wPos){

        if(this.ACTIVE){

            let ID = "C_" + hPos + "_" + wPos;

            if(document.getElementById(ID).innerHTML != '<img class="icon" src="./imgs/flag.png">' && document.getElementById(ID).innerHTML != '?'){
    
                let val = this.getValueAt(hPos, wPos);
    
                if(val == 10){
    
                    document.getElementById(ID).innerHTML = '<img class="icon" src="./imgs/bomb.png">';
                    document.getElementById(ID).style.backgroundColor = 'red';
    
                    timer.stop();
                    this.revealBombs();
                }
                else{
    
                    if(val == 0){
                        this.setValueAt(hPos, wPos, 'X');
                        this.revealAllAround(hPos, wPos);
            
                        val = 'X'
                    } 
            
                    let cls = 'style' + val;
            
                    document.getElementById(ID).innerHTML = val;
                    document.getElementById(ID).classList.add(cls);
                    document.getElementById(ID).style.backgroundColor = '#e6e6e6';
                }
            }
        }
    },


    generateHTML: function(){

        for(let i=0; i<this.HEIGHT; i++){

            this.BOARD.push([]);

            for(let j=0; j<this.WIDTH; j++) this.BOARD[i].push(0);
        }

        let table = document.createElement('table');

        for(let i=0; i<this.HEIGHT; i++){

            let row = document.createElement('tr');

            for(let j=0; j<this.WIDTH; j++){

                let ID = "C_" + i + "_" + j;
                let cell = document.createElement('td');
                    cell.id = ID;

                    cell.addEventListener('mousedown', (ev) => { 

                        ev.stopPropagation();
                        console.log(ev.button);

                        if(ev.button == 0) this.revealField(i, j); 
                        else if(ev.button == 2) this.mark(i, j);
                    })
                
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        document.getElementById('board').appendChild(table);
    },

    
    mark: function(hPos, wPos){

        if(this.ACTIVE){

            let ID = 'C_' + hPos + '_' + wPos;

            if(document.getElementById(ID).innerHTML == '') { 
    
                document.getElementById(ID).innerHTML = '<img class="icon" src="./imgs/flag.png">'; 
                document.getElementById(ID).style.backgroundColor = '#737373'; 
    
                this.remainingBombs(1);
            }
    
    
            else if(document.getElementById(ID).innerHTML == '?') { 
    
                document.getElementById(ID).innerHTML = ''; 
                document.getElementById(ID).style.backgroundColor = '#bfbfbf'; 
            }
            else if(document.getElementById(ID).innerHTML == '<img class="icon" src="./imgs/flag.png">') { 
    
                document.getElementById(ID).innerHTML = '?';
                document.getElementById(ID).style.backgroundColor = '#737373'; 
    
                this.remainingBombs(-1);
            }
        }
    },

    calculateMap: function(){

        for(let i=0; i<this.HEIGHT; i++){

            for(let j=0; j<this.WIDTH; j++){

                let fieldCount = 0;

                if(this.BOARD[i][j] != 10){

                    for(let iDir = -1; iDir <= 1; iDir++){

                        for(let jDir = -1; jDir <= 1; jDir++){

                            if(!(iDir == 0 && jDir == 0)){
                                if(this.BOARD[i + iDir] != undefined && this.BOARD[i + iDir][j + jDir] != undefined && this.BOARD[i + iDir][j + jDir] == 10) fieldCount++;
                            } 
                        }
                    }

                    this.setValueAt(i, j, fieldCount);
                }
            }   
        }

    },

    revealAllAround: function(hPos, wPos){

        for(let hDir = -1; hDir <= 1; hDir++){

            for(let wDir = -1; wDir <= 1; wDir++){

                if(!(hDir == 0 && wDir == 0)){
                    if(this.BOARD[hPos + hDir] != undefined && this.BOARD[hPos + hDir][wPos + wDir] != undefined) this.revealField(hPos + hDir, wPos + wDir);
                } 
            }
        }

    },

    remainingBombs: function(sub){

        this.REMAINING -= sub;

        if(this.REMAINING < 0) this.REMAINING = 0;
        if(this.REMAINING > this.BOMBS) this.REMAINING = this.BOMBS;

        document.getElementById('bombs').innerHTML = this.REMAINING;
    },

    generateBombs: function() {

        for(let i=0; i<this.BOMBS; i++){

            let randomPosW;
            let randomPosH;

            do{
                randomPosW = Math.round(Math.random() * (this.WIDTH - 1));
                randomPosH = Math.round(Math.random() * (this.HEIGHT - 1));
    
            }while(this.BOARD[randomPosH][randomPosW] == 10);

            this.BOARD[randomPosH][randomPosW] = 10;
        }   
    }
}



const timer = {

    TIME: 0,
    timer: null,
    START_TIME: null,
    END_TIME: null,

    start: function(){

        this.START_TIME = Date.now();
        
        this.timer = setInterval(() => { 

            this.TIME++; 

            let timeStr = this.TIME < 10 ? '00' + this.TIME : this.TIME < 100 ? '0' + this.TIME : this.TIME;

            document.getElementById('timer').innerHTML = timeStr;
        }, 1000)
    },

    stop: function(){
        clearInterval(this.timer);
    }
}


window.addEventListener('DOMContentLoaded', () => {



   // timer.start();
})


function startGame(){

    let W = document.getElementById('W').value;
    let H = document.getElementById('H').value;
    let B = document.getElementById('B').value;

    boardGenerator.WIDTH = W == '' ? 10 : W;
    boardGenerator.HEIGHT = H == '' ? 10 : H;
    boardGenerator.BOMBS = B == '' ? 10 : B;
    boardGenerator.REMAINING = boardGenerator.BOMBS;

    boardGenerator.generateHTML();
    boardGenerator.generateBombs();
    boardGenerator.calculateMap();

    boardGenerator.remainingBombs(0);

    timer.start();

    document.getElementById('menu').style.display = 'none'
    document.getElementById('board').style.display = 'block';
    document.getElementById('TOP').style.display = 'flex';
    document.getElementById('TOP').style.width = boardGenerator.WIDTH * 24 + 6 + 'px';
}

window.addEventListener('contextmenu', (ev) => { ev.preventDefault(); })


