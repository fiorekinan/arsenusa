const GameDifficulty = [40];

class Game {
    cols = 3;
    rows = 3;
    count;
    blocks;
    emptyBlockCoords = [2, 2];
    indexes = [];

    constructor(difficultyLevel = 1) {
        this.difficulty = GameDifficulty[difficultyLevel - 1];
        this.count = this.cols * this.rows;
        this.blocks = document.getElementsByClassName("puzzle_block"); 
        this.init();
    }

    init() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let blockIdx = x + y * this.cols;
                if (blockIdx + 1 >= this.count) break;
                let block = this.blocks[blockIdx];
                this.positionBlockAtCoord(blockIdx, x, y);
                block.addEventListener('click', (e) => this.onClickOnBlock(blockIdx));
                this.indexes.push(blockIdx);
            }
        }
        this.indexes.push(this.count - 1);
        this.randomize(this.difficulty);
    }

    randomize(iterationCount) {
        for (let i = 0; i < iterationCount; i++) {
            let randomBlockIdx = Math.floor(Math.random() * (this.count - 1));
            let moved = this.moveBlock(randomBlockIdx);
            if (!moved) i--;
        }
    }

    moveBlock(blockIdx) {
        let block = this.blocks[blockIdx];
        let blockCoords = this.canMoveBlock(block);
        if (blockCoords != null) {
            this.positionBlockAtCoord(blockIdx, this.emptyBlockCoords[0], this.emptyBlockCoords[1]);
            this.indexes[this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols];
            this.emptyBlockCoords[0] = blockCoords[0];
            this.emptyBlockCoords[1] = blockCoords[1];
            return true;
        }
        return false;
    }

    canMoveBlock(block) {
        let blockPos = [parseInt(block.style.left), parseInt(block.style.top)];
        let blockWidth = block.clientWidth;
        let blockCoords = [blockPos[0] / blockWidth, blockPos[1] / blockWidth];
        let diff = [Math.abs(blockCoords[0] - this.emptyBlockCoords[0]), Math.abs(blockCoords[1] - this.emptyBlockCoords[1])];
        let canMove = (diff[0] == 1 && diff[1] == 0) || (diff[0] == 0 && diff[1] == 1);
        if (canMove) return blockCoords;
        else return null;
    }

    positionBlockAtCoord(blockIdx, x, y) {
        let block = this.blocks[blockIdx];
        block.style.left = (x * block.clientWidth) + "px";
        block.style.top = (y * block.clientWidth) + "px";
    }

    onClickOnBlock(blockIdx) {
        if (this.moveBlock(blockIdx)) {
            if (this.checkPuzzleSolved()) {
                setTimeout(() => alert("YAAY!! Kamu Berhasil!! 🎉"), 600);

                let emptyBlock = document.getElementById("empty_block");
                emptyBlock.style.display = "block";
                emptyBlock.style.left = (this.emptyBlockCoords[0] * this.blocks[0].clientWidth) + "px";
                emptyBlock.style.top = (this.emptyBlockCoords[1] * this.blocks[0].clientHeight) + "px";
            }
        }
    }

    checkPuzzleSolved() {
        for (let i = 0; i < this.indexes.length; i++) {
            if (i == this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols) continue;
            if (this.indexes[i] != i) return false;
        }
        return true;
    }

    setDifficulty(difficultyLevel) {
        this.difficulty = GameDifficulty[difficultyLevel - 1];
        this.randomize(this.difficulty);
    }
}

var game = new Game(1);