//To read data from txt file
const fs = require('fs');

const txtInputFile = 'input.txt';

const inputData = fs.readFileSync(txtInputFile, 'utf-8').split('\n');
const roomSize = inputData.slice(0, 1).toString().split(' ');
const startLoc = inputData.slice(1, 2).toString().split(' ');
const dirt = inputData.slice(2, inputData.length - 1);
const driveDirections = inputData[inputData.length - 1].split('');

class DirtDevil {
  constructor(rows, columns) {
    this.room = DirtDevil.buildRoom(rows, columns);
    this.rowsLength = rows;
    this.columnsLength = columns;
    this.dirtCounter = 0;
  }
    //builds room matrix
  static buildRoom(rows, columns) {
    let room = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
          row.push(' ');
      }
      room.push(row);
    }
    return room;
  }
    //vacuum's position in room
  vacuumPosition(xLoc, yLoc) {
    this.vacuumLoc = {
      x: xLoc,
      y: yLoc
    };
    this.room[yLoc][xLoc] = 'vacuum';
  }
  //checks for dirt patch before placing dirt in room
  checkForDirt(xLoc, yLoc) {
    let roomLoc = this.room[yLoc][xLoc];
    if (roomLoc !== 'dirt' && roomLoc !== 'vacuum') {
      this.room[yLoc][xLoc] = 'dirt';
    }
  }
    //adds dirt to room
  addDirt(dirt) {
    for (let i = 0; i < dirt.length; i++) {
      let dirtPatch = dirt[i].split(' ');
      this.checkForDirt(parseInt(dirtPatch[0]), parseInt(dirtPatch[1]));
    }
  }
  //removes dirt patch from room
  cleanDirt(xLoc, yLoc) {
    if (this.room[yLoc][xLoc] === 'dirt') {
      this.dirtCounter++;
    }
    this.room[this.vacuumLoc.y][this.vacuumLoc.x] = '';
    this.vacuumPosition(xLoc, yLoc);
  }

  moveVac(direction) {
    //checks for input direction
    if (direction == 'N') {
      let xLoc = this.vacuumLoc.x;
      let yLoc = this.vacuumLoc.y + 1;
      if (yLoc <= this.rowsLength - 1) {
        this.cleanDirt(xLoc, yLoc);
      }
    }
      else if (direction == 'S') {
        let xLoc = this.vacuumLoc.x;
        let yLoc = this.vacuumLoc.y - 1;
        if (yLoc >= 0) {
          this.cleanDirt(xLoc, yLoc);
        }
      }
      else if (direction == 'W') {
        let xLoc = this.vacuumLoc.x -1;
        let yLoc = this.vacuumLoc.y;
        if (xLoc >= 0) {
          this.cleanDirt(xLoc, yLoc);
        }
      }
      else if (direction == 'E') {
        let xLoc = this.vacuumLoc.x + 1;
        let yLoc = this.vacuumLoc.y;
        if (xLoc <= this.columnsLength - 1) {
          this.cleanDirt(xLoc, yLoc);
        }
      }
  }

  driveCommands(commands) {
    for (let i = 0; i < commands.length; i++) {
      this.moveVac(commands[i]);
    }
  }
}

//Instantiation of DirtDevil class with input data from input.txt file
const robotVac = new DirtDevil(parseInt(roomSize[0]), parseInt(roomSize[1]));
robotVac.vacuumPosition(parseInt(startLoc[0]), parseInt(startLoc[1]));
robotVac.addDirt(dirt);
robotVac.driveCommands(driveDirections);

//final position of vacuum
console.log(robotVac.vacuumLoc.x, robotVac.vacuumLoc.y);
//number of patches of dirt cleaned up
console.log(robotVac.dirtCounter);



