<template>
  <div class="board">
    <score :score="score" :showHighScores="showHighScores"></score>

    <enterScore :enterName="enterName" v-on:callAddHighScore="addHighScore"></enterScore>

    <playAgain :playAgain="playAgain" v-on:playAgainFunc="playAgainFn"></playAgain>

    <displayBoard :board="board" :showHighScores="showHighScores"></displayBoard>

    <highScores :highScores="highScores" :showHighScores="showHighScores"></highScores>
  </div>
</template>

<script>
import highScores from './highScores.vue'
import score from './score.vue'
import playAgain from './playAgain.vue'
import enterScore from './enterScore.vue'
import displayBoard from './displayBoard.vue'
const fb = require('../firebaseConfig.js')

export default {
  name: 'board',
  components: { highScores, score, playAgain, enterScore, displayBoard },
  data () {
    return {
      board: [
        [{id:0,merged:false, value:0},{id:1,merged:false, value:0},{id:2,merged:false, value:0},{id:3,merged:false, value:0}],
        [{id:4,merged:false, value:0},{id:5,merged:false, value:0},{id:6,merged:false, value:0},{id:7,merged:false, value:0}],
        [{id:8,merged:false, value:0},{id:9,merged:false, value:0},{id:10,merged:false, value:0},{id:11,merged:false, value:0}],
        [{id:12,merged:false, value:0},{id:13,merged:false, value:0},{id:14,merged:false, value:0},{id:15,merged:false, value:0}],
      ],
      highScores: [],
      boardChanged: false,
      score: 0,
      name: "",
      showHighScores: false,
      enterName: false,
      playAgain: false,
      enterNameMarker: false,
      dateCreated: new Date().toISOString().slice(0,10)
    }
  },

  mounted() {
    const this_board = this
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
      let pAgainEntry = document.getElementsByClassName("playAgainInput")[0].value
      if(pAgainEntry.toLowerCase() == "no" || pAgainEntry.toLowerCase() == "n") { return}
      else {
        const this_board = this
        this_board.board= [
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        [{merged:false, value:0},{merged:false, value:0},{merged:false, value:0},{merged:false, value:0}],
        ]
        let newarr = []
        this_board.highScores = null
        this_board.highScores = newarr
        this_board.boardChanged= false
        this_board.score= 0
        this_board.name= ""
        this_board.showHighScores= false
        this_board.enterName= false
        this_board.playAgain= false
        this_board.enterNameMarker = false
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

        // retrieve top 3 high scores
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
      //Check if any zeros are present or any merges can be made with adjacent squares
      if(!this_board.boardChanged) {         
        this_board.enterNameMarker = true 

        for(let x = 0; x < board.length; x++) {
          for(let y = 0; y < board.length; y++) {
            if(board[x][y].value == 0) {this_board.enterNameMarker = false}
            if(x-1 >= 0) {
              if(board[x][y].value == board[x-1][y].value) {this_board.enterNameMarker = false}
            }
            if(x+1 < 4) {
              if(board[x][y].value == board[x+1][y].value) {this_board.enterNameMarker = false}
            }
            if(y-1 >= 0) {
              if(board[x][y].value == board[x][y-1].value) {this_board.enterNameMarker = false}
            }
            if(y+1 < 4) {
              if(board[x][y].value == board[x][y+1].value) {this_board.enterNameMarker = false}
            }
          }
        }
        if(this_board.enterNameMarker == true) {
          this_board.enterName = true
        }
      }
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
        this_board.enterNameMarker = true 

      for(let x = 0; x < board.length; x++) {
          for(let y = 0; y < board.length; y++) {
            if(board[x][y].value == 0) {this_board.enterNameMarker = false}
            if(x-1 >= 0) {
              if(board[x][y].value == board[x-1][y].value) {this_board.enterNameMarker = false}
            }
            if(x+1 < 4) {
              if(board[x][y].value == board[x+1][y].value) {this_board.enterNameMarker = false}
            }
            if(y-1 >= 0) {
              if(board[x][y].value == board[x][y-1].value) {this_board.enterNameMarker = false}
            }
            if(y+1 < 4) {
              if(board[x][y].value == board[x][y+1].value) {this_board.enterNameMarker = false}
            }
          }
        }
        if(this_board.enterNameMarker == true) {
          this_board.enterName = true
        }
      }
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
      if(!this_board.boardChanged) { 
        this_board.enterNameMarker = true 

      for(let x = 0; x < board.length; x++) {
          for(let y = 0; y < board.length; y++) {
            if(board[x][y].value == 0) {this_board.enterNameMarker = false}
            if(x-1 >= 0) {
              if(board[x][y].value == board[x-1][y].value) {this_board.enterNameMarker = false}
            }
            if(x+1 < 4) {
              if(board[x][y].value == board[x+1][y].value) {this_board.enterNameMarker = false}
            }
            if(y-1 >= 0) {
              if(board[x][y].value == board[x][y-1].value) {this_board.enterNameMarker = false}
            }
            if(y+1 < 4) {
              if(board[x][y].value == board[x][y+1].value) {this_board.enterNameMarker = false}
            }
          }
        }
        if(this_board.enterNameMarker == true) {
          this_board.enterName = true
        }
      }
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
      if(!this_board.boardChanged) { 
        this_board.enterNameMarker = true 

      for(let x = 0; x < board.length; x++) {
          for(let y = 0; y < board.length; y++) {
            if(board[x][y].value == 0) {this_board.enterNameMarker = false}
            if(x-1 >= 0) {
              if(board[x][y].value == board[x-1][y].value) {this_board.enterNameMarker = false}
            }
            if(x+1 < 4) {
              if(board[x][y].value == board[x+1][y].value) {this_board.enterNameMarker = false}
            }
            if(y-1 >= 0) {
              if(board[x][y].value == board[x][y-1].value) {this_board.enterNameMarker = false}
            }
            if(y+1 < 4) {
              if(board[x][y].value == board[x][y+1].value) {this_board.enterNameMarker = false}
            }
          }
       }
        if(this_board.enterNameMarker == true) {
          this_board.enterName = true
        }
      }
      
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
</style>
