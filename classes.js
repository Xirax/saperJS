
export default class BoardGenerator{

    constructor(h, w, bombs){

        this.height = h;
        this.width = w;
        this.bombs = bombs;
        this.board = [];

        for(let i=0; i<this.height; i++){

            this.board.push([]);
            for(let j=0; j<this.width; j++) this.board[i].push(0);
        }
    }


    generateBombs(){

        for(let i=0; i<this.bombs; i++){

            let randomPosW;
            let randomPosH;

            do{
                randomPosW = Math.round(Math.random() * (this.width - 1));
                randomPosH = Math.round(Math.random() * (this.height - 1));
    
            }while(this.board[randomPosH][randomPosW] == 10);

            this.board[randomPosH][randomPosW] = 10;
        }   
    }


    getValueAt(hPos, wPos){

        return this.board[hPos][wPos];
    }

    calculateMap(){

        for(let i=0; i<this.height; i++){

            for(let j=0; j<this.width; j++){

                let fieldCount = 0;

                if(this.board[i][j] != 10){

                    for(let iDir = -1; iDir <= 1; iDir++){

                        for(let jDir = -1; jDir <= 1; jDir++){

                            if(!(iDir == 0 && jDir == 0)){
                                if(i + iDir > 0 && i + iDir < this.height - 2 && j + jDir > 0 && j + jDir < this.width - 2 && this.board[i + iDir][j + jDir] == 10) fieldCount++;
                            } 
                        }
                    }

                    this.board[i][j] = fieldCount;
                }
            }   
        }

    }

    generateHTML(){

        for(let i=0; i<this.height; i++){

            this.board.push([]);
            for(let j=0; j<this.width; j++) this.board[i].push(0);
        }

        let table = document.createElement('table');

        for(let i=0; i<this.height; i++){

            let row = document.createElement('tr');

            for(let j=0; j<this.width; j++){

                let ID = "C_" + i + "_" + j;
                let cell = document.createElement('td');
                    cell.id = ID;

                    cell.addEventListener('mousedown', (ev) => {

                        cell.innerHTML = this.getValueAt(i, j);

                        let cls = 'style' + this.getValueAt(i, j);

                        cell.classList.add(cls);
                    })
                
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        document.getElementById('board').appendChild(table);
    }

}