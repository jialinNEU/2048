/** 游戏初始化 */

var board = new Array();
var score = 0;
var hasConflicted = new Array();

// 主函数
$(document).ready(function(){
    newgame();
});

// 开始一个新游戏
// 1. UI初始化
// 2. 随机生成2和4
function newgame() {
    init();
    // 随机生成2和4
    generateOneNumber();
    generateOneNumber();
}

// UI初始化
function init(){
    for( var i = 0 ; i < 4 ; i ++ ) {
        for( var j = 0 ; j < 4 ; j ++ ){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top', getPosTop(i , j ));
            gridCell.css('left', getPosLeft(i , j ));
        }
    }

    for(var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();

        for(var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    // 初始化Score
    score = 0;
}

// 根据Board值，对number-cell进行操作，更新UI
function updateBoardView() {

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ ) {
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] === 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                // 置于grid-cell中间
                theNumberCell.css('top', getPosTop(i, j) + 50 + 'px');
                theNumberCell.css('left', getPosLeft(i, j) + 50 + 'px');
            } else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j) + 'px');
                theNumberCell.css('left', getPosLeft(i, j) + 'px');
                // 不同数对应不同的背景色
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }
}


// 随机生成一个数

function generateOneNumber(){
    if(nospace(board)){
        return false;
    }

    // 随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while(times < 50) {
        if(board[randx][randy] === 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if(times === 50) {
        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                if(board[i][j] === 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    // 随机一个数字(2或者4)
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    // 在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    
    return true;
}



/** 基于玩家响应的游戏循环 */

$(document).keydown(function(event) {
    switch(event.keyCode) {
        case 37:    // left
            if(moveLeft()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38:    // up
            if(moveUp()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39:    // right
            if(moveRight()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40:    // down
            if(moveDown()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()", 300);
            }
            break;
        default:
            break;
    }
});


function moveLeft() {
    if(!canMoveLeft(board)) {
        return false;
    }

    // 向左移动

    for(var i = 0; i < 4; i++) {
        for(var j = 1; j < 4; j++) {
            if(board[i][j] !== 0) {
                for(var k = 0; k < j; k++) {
                    
                    // 可以移动的条件：该位置为0，且中间没有障碍物
                    // noBlockHorizontal(row, col1, col2, board), 从col1到col2是否有障碍物
                    if(board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
                        // 移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        // 移动
                        showMoveAnimation(i, j, i, k);
                        // 叠加
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // 加分
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);

    return true;
}

function moveRight() {
    if(!canMoveRight(board)) {
        return false;
    }

    for(var i = 0; i < 4; i++) {
        for(var j = 2; j >= 0; j--) {
            if(board[i][j] !== 0) {
                for(var k = 3; k > j; k--) {

                    // noBlockHorizontal(row, col1, col2, board), 从col1到col2是否有障碍物
                    if(board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
                        // 移动
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);

    return true;
}

function moveUp() {
    if(!canMoveUp(board)) {
        return false;
    }

    for( var j = 0 ; j < 4 ; j ++ ) {
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        // 移动
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j] ){
                        // 移动
                        showMoveAnimation( i , j , k , j );
                        // 叠加
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        // 计算分数
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);

    return true;
}


function moveDown() {
    if(!canMoveDown(board)) {
        return false;
    }

    for( var j = 0 ; j < 4 ; j ++ ) {
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        // 移动
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ){
                        // 移动
                        showMoveAnimation( i , j , k , j );
                        // 叠加
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        // 计算分数
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200);

    return true;
}




function isgameover(){
    // 结束条件：没有多余空间 且 无法移动
    if(nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert("游戏结束！");
}

