<template>
    <div v-if="!showHighScores">
    <div v-for="(row, index) in stringifyBoard" :key="index" class="row">
      <div v-for="item in row" :key="item.id" class="col">{{ item }}</div>
    </div>
    </div>
</template>

<script>
export default {
    name: "displayBoard",
    props: {
        showHighScores: Boolean,
        board: Array
    },
computed: {
    stringifyBoard() {
      const this_board = this
      return this_board.board.map(row => {
        return row.map(item => {
          return item.value
        })
      })
    }
  },
}
</script>

<style>

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
</style>
