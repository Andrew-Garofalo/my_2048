<template>
    <div v-if="!showHighScores">
      <div id="score">Score: {{score}}</div>
    </div>
    
</template>

<script>
export default {
    name: "score",
    props: {
        score: Number,
        showHighScores: Boolean
    }
}
</script>

<style>
#score {
    font-size:5em;
    border: solid;
    border-width: 5px;
    border-color: black;
    margin-bottom: 2%;
    padding: 10px;
}

</style>
