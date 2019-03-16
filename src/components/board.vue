<template>
  <div class="board">
    <div id="score">Score: {{score}}</div>

    <div v-show="enterName">
      <label class="nameEntry" for="uName">Enter your name for the high score list:</label>
      <input v-on:keyup.enter="addHighScore" class="nameBox" type="text" id="uName">
    </div>

    <div v-show="playAgain">
      <label class="playAgainLabel" for="uName">Hope you had fun! Would you like to play again?</label>
      <input v-on:keyup.enter="playAgainFn" class="playAgainInput" type="text" id="uName">
    </div>

    <div v-if="!showHighScores">
    <div v-for="row in stringifyBoard" class="row">
      <div v-for="item in row" class="col">{{ item }}</div>
    </div>
    </div>

    <div v-if="showHighScores">
      <span v-for="row in highScores" class="score-row">
      <span v-for="(item, index) in row" class="score-col"> {{ row[index] }}</span>
    </span> 
    </div>
  </div>
</template>

<script>
// import cell from './cell.vue'
const fb = require('../firebaseConfig.js')

export default {
  name: 'board',
//   components: { cell },
  data () {
    return {
      board: [
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
      ],
      highScores: [],
      boardChanged: false,
      score: 0,
      name: "",
      showHighScores: false,
      enterName: false,
      playAgain: false,
      dateCreated: new Date().toISOString().slice(0,10)
    }
  },

  computed: {
    stringifyBoard() {
      const this_board = this
      return this_board.board.map(row => {
        return row.map(item => {
          return item.value
        })
      })
    },
    top3 () { 
      return this.highScores.splice(1, 3) 
      }
  },

  mounted() {
    const this_board = this
    this_board.showHighScores = false
    this_board.enterName = false
    this_board.highScores = []
    this_board.dateCreated = new Date().toISOString().slice(0,10)
    this_board.placeTwo()
    this_board.placeTwo()
    document.addEventListener("keyup", this_board.keypress)
  },

  methods: {
    keypress (event) {
      const this_board = this

      if (event.which === 40) {
        // down arrow
        this_board.moveDown()
      } else if (event.which === 38) {
        // up arrow
        this_board.moveUp()
      } else if (event.which === 37) {
        // left arrow
        this_board.moveLeft()
      } else if (event.which === 39) {
        // right arrow
        this_board.moveRight()
      } else {
        return
      }
      if (this_board.boardChanged) {
        this_board.placeTwo()
        this_board.boardChanged = false
      }
    },

    playAgainFn() {
      let pAgainEntry = document.getElementsByClassName("playAgainInput").value
      if(pAgainEntry == "No" || pAgainEntry == "n") {}
      else {
        const this_board = this
        this_board.board= [
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        ],
        this_board.highScores= [],
        this_board.boardChanged= false,
        this_board.score= 0,
        this_board.name= "",
        this_board.showHighScores= false,
        this_board.enterName= false,
        this_board.playAgain= false,
        this_board.dateCreated= new Date().toISOString().slice(0,10)
        this_board.placeTwo()
        this_board.placeTwo()
        document.addEventListener("keyup", this_board.keypress)
      }
    },

    addHighScore() {
      //detect if user hits enter after entering their name
      if(event.which == 13) {
        const this_board = this  

        this_board.highScores = []
        this_board.name = "" 
      
        //update user's name
        this_board.name = document.getElementsByClassName("nameBox")[0].value

        //don't allow multiple name entries
        document.removeEventListener("keyup", this_board.keypress)
        document.getElementsByClassName("nameBox")[0].removeEventListener("keyup", this_board.addHighScore)

        //add user's information to database of high scores
        fb.db.collection("high_score").add({
            score: this_board.score,
            name: this_board.name,
            date: this_board.dateCreated
        });

        //display High Scores
        this_board.getHighScores()
        this_board.playAgain = true
      }

    },

    getHighScores() {
      const this_board = this
      
        // retrieve top 2 high scores
        fb.db.collection("high_score").orderBy("score", "desc").limit(3).onSnapshot(
          snapshot => {
            
            snapshot.forEach(change => {
              let obj = {
                        dateCreated : change.data().date,
                        name : change.data().name,
                        score : change.data().score}
              this_board.highScores.push(obj)
            })
      })

      // this_board.highScores.slice(0, 1)
      console.log(this_board.highScores)

      //Show the high scores list and hide the game board
      this_board.showHighScores = true
      this_board.enterName = false
    },

    placeTwo() {
      const this_board = this

      let getRandomIndex = function() {
        let row = this_board.board[Math.floor(Math.random()*this_board.board.length)]
        return row[Math.floor(Math.random()*row.length)]
      }

      let randomItem = getRandomIndex()

      while (randomItem.value != 0) {
        randomItem = getRandomIndex()
      }

      randomItem.value = 2

    },

    moveRight() {
      const this_board = this

      let board = this_board.board
      for (var a = 0; a < board.length; a++) {
        let i = this_board.board.length - 2
        let j = this_board.board.length - 1

        while (i >= 0) {
          if (board[a][i].value === board[a][j].value) {
            //When values of adjacent squares are equal, combine and update score
            this.score = this.score + board[a][i].value + board[a][j].value

            board[a][j].value = board[a][i].value + board[a][j].value
            board[a][i].value = 0
            this_board.boardDidChange()
            j--
            i--
          } else if ((board[a][j].value === 0 && board[a][j].value === 0) || 
            (board[a][j].value === 0 || 
            (board[a][i].value != 0 && board[a][j].value != 0 && (i + 1 == j)))) {
            j--
            i--
          } else if (board[a][i].value != 0 && board[a][j].value != 0) {
            j--
          } else if (board[a][i].value === 0) {
            i--
          }
        }
        for (var x = 0; x < board.length; x++) {
          for (var y = board.length - 1; y > 0; y--) {
            if (board[a][y].value === 0) {
              let temp = board[a][y - 1].value
              board[a][y - 1].value = 0
              board[a][y].value = temp
              this_board.boardDidChange()
            }
          }
        }
      }
      //If no tiles can be moved, Game is over

      //loop over  board, check if no zeros exist, hopefully the above code already checks if any
        //merges can be made. Else, also check if any 2 adjacent squares have same value
      if(!this_board.boardChanged) { this_board.enterName = true }
    },

    moveLeft() {
      const this_board = this
      let board = this_board.board
      for (var a = 0; a < board.length; a++) {
        let i = 1
        let j = 0

        while (i < 4) {
          if (board[a][i].value === board[a][j].value) {
            //When values of adjacent squares are equal, combine and update score
            this.score = this.score + board[a][i].value + board[a][j].value

            board[a][j].value = board[a][i].value + board[a][j].value
            board[a][i].value = 0
            this_board.boardDidChange()
            j++
            i++
          } else if ((board[a][j].value === 0 && board[a][j].value === 0) || 
            (board[a][j].value === 0 || 
            (board[a][i].value != 0 && board[a][j].value != 0 && (i - 1 == j)))) {
            j++
            i++
          } else if (board[a][i].value != 0 && board[a][j].value != 0) {
            j++
          } else if (board[a][i].value === 0) {
            i++
          }
        }
        for (var x = 0; x < board.length; x++) {
          for (var y = 0; y < board.length - 1; y++) {
            if (board[a][y].value === 0) {
              let temp = board[a][y + 1].value
              board[a][y + 1].value = 0
              board[a][y].value = temp
              this_board.boardDidChange()
            }
          }
        }
      }
      //If no tiles can be moved, Game is over
      if(!this_board.boardChanged) { 

        //loop over  board, check if no zeros exist, hopefully the above code already checks if any
        //merges can be made. Else, also check if any 2 adjacent squares have same value
        this_board.enterName = true }
    },

    moveDown() {
      const this_board = this
      let board = this_board.board
      for (var a = 0; a < board.length; a++) {
        let i = this_board.board.length - 2
        let j = this_board.board.length - 1

        while (i >= 0) {
          if (board[i][a].value === board[j][a].value) {
            //When values of adjacent squares are equal, combine and update score
            this.score = this.score + board[j][a].value + board[i][a].value

            board[j][a].value = board[i][a].value + board[j][a].value
            board[i][a].value = 0
            this_board.boardDidChange()
            j--
            i--
          } else if ((board[j][a].value === 0 && board[j][a].value === 0) || 
            (board[j][a].value === 0 || 
            (board[i][a].value != 0 && board[j][a].value != 0 && (i + 1 == j)))) {
            j--
            i--
          } else if (board[i][a].value != 0 && board[j][a].value != 0) {
            j--
          } else if (board[i][a].value === 0) {
            i--
          }
        }
        for (var x = 0; x < board.length; x++) {
          for (var y = board.length - 1; y > 0; y--) {
            if (board[y][a].value === 0) {
              let temp = board[y - 1][a].value
              board[y - 1][a].value = 0
              board[y][a].value = temp
              this_board.boardDidChange()
            }
          }
        }
      }
      //If no tiles can be moved, Game is over

      //loop over  board, check if no zeros exist, hopefully the above code already checks if any
        //merges can be made. Else, also check if any 2 adjacent squares have same value
      if(!this_board.boardChanged) { this_board.enterName = true }
    },

    moveUp() {
      const this_board = this
      let board = this_board.board
      for (var a = 0; a < board.length; a++) {
        let i = 1
        let j = 0

        while (i < 4) {
          if (board[i][a].value === board[j][a].value) {
            //When values of adjacent squares are equal, combine and update score
            this.score = this.score + board[j][a].value + board[i][a].value

            board[j][a].value = board[i][a].value + board[j][a].value
            board[i][a].value = 0
            this_board.boardDidChange()
            j++
            i++
          } else if ((board[j][a].value === 0 && board[j][a].value === 0) || 
            (board[j][a].value === 0 || 
            (board[i][a].value != 0 && board[j][a].value != 0 && (i - 1 == j)))) {
            j++
            i++
          } else if (board[i][a].value != 0 && board[j][a].value != 0) {
            j++
          } else if (board[i][a].value === 0) {
            i++
          }
        }
        for (var x = 0; x < board.length; x++) {
          for (var y = 0; y < board.length - 1; y++) {
            if (board[y][a].value === 0) {
              let temp = board[y + 1][a].value
              board[y + 1][a].value = 0
              board[y][a].value = temp
              this_board.boardDidChange()
            }
          }
        }
      }

      //If no tiles can be moved, Game is over

      //loop over  board, check if no zeros exist, hopefully the above code already checks if any
        //merges can be made. Else, also check if any 2 adjacent squares have same value
      if(!this_board.boardChanged) { this_board.enterName = true }
      
    },

    boardDidChange() {
      const this_board = this
      this_board.boardChanged = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  width: 100vw;
  background-color: #C1ABA6;
}
.row {
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  font-size: 5em;
  background-color: #34495e;
	color: #fff;
}
.col {
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid;
  border-width: 5px;
  border-color: black;
}

.score-row {
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  font-size: 5em;
  background-color: #34495e;
	color: #fff;
  border-collapse: collapse;
  border-width: 5px;
  border-color: black;
}
.score-col {
  width: 6em;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid;
  border-width: 5px;
  border-color: black;
}

#score {
    font-size:5em;
    border: solid;
    border-width: 5px;
    border-color: black;
    margin-bottom: 2%;
    padding: 10px;
}
.nameEntry {
  font-size: 2em;
  padding-right: 5px;
}
.nameBox {
    min-height:2em;
    border: solid;
    border-width: 1px;
    border-color: black;
}
.playAgainLabel {
  font-size: 2em;
  padding-right: 5px;
}
.playAgainInput {
  min-height:2em;
  border: solid;
  border-width: 1px;
  border-color: black;
}
</style>
