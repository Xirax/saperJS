
const boardGenerator = {

    HEIGHT: 0,
    WIDTH: 0,
    BOMBS: 0,
    REMAINING: 0,
    ACTIVE: true,
    ALL_FIELDS: 0, 

    BOARD: [],

    getValueAt: function(hPos, wPos) {
        
        return this.BOARD[hPos][wPos];
    },

    setValueAt: function(hPos, wPos, val){

        this.BOARD[hPos][wPos] = val;
    },

    revealBombs: function(){

        this.ACTIVE = false;

        document.getElementById('emoji-icon').src = './imgs/emoji/dead.png';
        document.getElementById('end-menu').style.display = "flex";

        for(let i=0; i<this.HEIGHT; i++){

            for(let j=0; j<this.WIDTH; j++){

                if(this.BOARD[i][j] == 10){

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

                    document.getElementById('emoji-icon').src = './imgs/emoji/uffP.png';

                    setTimeout(() => { 
                        if(this.ACTIVE) document.getElementById('emoji-icon').src = './imgs/emoji/happy.png'; 
                    }, 900);
    
                    if(val == 0){
                        this.setValueAt(hPos, wPos, 'X');
                        this.revealAllAround(hPos, wPos);
            
                        val = 'X';
                    } 
            
                    let cls = 'style' + val;
            
                    document.getElementById(ID).innerHTML = val;
                    document.getElementById(ID).classList.add(cls);
                    document.getElementById(ID).style.backgroundColor = '#e6e6e6';  
                }
            }

            this.checkReveals();
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
                    cell.classList.add('cell');

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

    checkReveals: function(){

        let ctn = 0;

        let fields = document.getElementsByClassName('cell');

        for(let i=0; i<fields.length; i++){
            if(fields[i].innerHTML != '' && fields[i].innerHTML != '?' && fields[i].innerHTML != '<img class="icon" src="./imgs/flag.png">') ctn++;
        }

        console.log(ctn);

        if(ctn == (this.ALL_FIELDS - this.BOMBS)){

            timer.stop();
           // this.revealBombs();

            this.ACTIVE = false;
            document.getElementById('emoji-icon').src = './imgs/emoji/win.png';
            document.getElementById('end-menu').style.display = "flex";
            scores.setRecord(timer.timeSpan(), this.WIDTH, this.HEIGHT, this.BOMBS);
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

        this.END_TIME = Date.now();
    },

    timeSpan: function(){
        return this.END_TIME - this.START_TIME;
    }
}


const scores = {

    getAll: function(){ 
        return document.cookie;
    },


    getSortedByTime: function(){

        let cookies = document.cookie;

        if(cookies != '') cookies = cookies.split(';');
        else cookies = [];

        let players = [];
        
        for(let i=0; i<cookies.length; i++){

            let player = cookies[i].split('=')[1].split('_');

            
            let obj = {

                nick: player[0],
                time: player[1],
                mode: player[2]
            }

            players.push(obj);
        }  

        players.sort((a, b) => { return a.time - b.time; })

        return players;
    },

    setRecord: function(time, W, H, B){

        let sorted = this.getSortedByTime();

        let ID = 'PLAYER' + sorted.length;

        let add = false;
        let moreThan10 = false;

        if(sorted.length >= 10){

            moreThan10 = true;

            for(let i=0; i<sorted.length; i++){

                if(time < sorted[i].time){
                    add = true;
                    break;
                }
            }
        }
        else add = true;

        if(add){

            let nick = prompt("Dostałeś się do tabeli rekordów! Podaj nick");

            let data = nick + '_' + time + '_' + W + 'x' + H + '(' + B + ')';

            let expDate = new Date();

            expDate.setTime(expDate.getTime() + (4*24*60*60*1000));

            let expStr = "expires="+ expDate.toUTCString();

            let coockieStr = ID + "=" + data + ";" + expStr;

            document.cookie = coockieStr;
        }
    }
}


function startGame(){

    let W = document.getElementById('W').value;
    let H = document.getElementById('H').value;
    let B = document.getElementById('B').value;

    boardGenerator.WIDTH = W == '' ? 10 : W;
    boardGenerator.HEIGHT = H == '' ? 10 : H;
    boardGenerator.BOMBS = B == '' ? 10 : B;
    boardGenerator.REMAINING = boardGenerator.BOMBS;
    boardGenerator.ALL_FIELDS = W * H;

    boardGenerator.generateHTML();
    boardGenerator.generateBombs();
    boardGenerator.calculateMap();

    boardGenerator.remainingBombs(0);

    timer.start();

    document.getElementById('menu').style.display = 'none'
    document.getElementById('board').style.display = 'block';
    document.getElementById('TOP').style.display = 'flex';
    document.getElementById('TOP').style.width = boardGenerator.WIDTH * 24 + 6 + 'px';
    document.getElementById('end-menu').style.width = boardGenerator.WIDTH * 24 + 6 + 'px';
}


function again(){ window.location.reload(); }


function showScores(){

    document.getElementById('scores').innerHTML = '';

    let sorted = scores.getSortedByTime();

    let tr = document.createElement('tr');

    let td1 = document.createElement('td');
        td1.innerHTML = 'NICK';

    let td2 = document.createElement('td');
        td2.innerHTML = 'TIME';

    let td3 = document.createElement('td');
        td3.innerHTML = 'MODE'

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    document.getElementById('scores').appendChild(tr);
    

    let max = sorted.length > 10 ? 10 : sorted.length;

    for(let i=0; i<max; i++){

        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
            td1.innerHTML = sorted[i].nick;
            td1.classList.add('scr-tab');

        let m, s, ms;

        ms = sorted[i].time;
        m = Math.floor(ms / 60000);

        ms -= (m * 60000);

        s = Math.floor(ms / 1000);

        ms -= (s * 1000);

        let timeStr = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s) + ':' + ms;
        
        let td2 = document.createElement('td');
            td2.innerHTML = timeStr;
            td2.classList.add('scr-tab');
        
        let td3 = document.createElement('td');
            td3.innerHTML = sorted[i].mode;
            td3.classList.add('scr-tab');

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        document.getElementById('scores').appendChild(tr);
    }

}

window.addEventListener('contextmenu', (ev) => { ev.preventDefault(); })


