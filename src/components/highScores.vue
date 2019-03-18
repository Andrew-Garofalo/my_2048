<template>
    <div v-if="showHighScores">
      <span v-for="row in highScores" class="score-row">
      <span v-for="(item, index) in row" :key="index" class="score-col highscores"> {{ row[index] }}</span>
    </span> 
    </div>
</template>

<script>
export default {
    name: "highScores",
    props: {
        highScores: Array,
        showHighScores: Boolean
    }

}
</script>

<style>
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
.highscores {
  width: 7em;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid;
  border-width: 5px;
  border-color: black;
}
</style>

