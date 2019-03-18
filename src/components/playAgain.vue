<template>
    <div v-show="playAgain">
      <br><br>
      <label class="playAgainLabel" for="uName">Hope you had fun! Would you like to play again?</label>
      <input v-on:keyup.enter="$emit('playAgainFunc')" class="playAgainInput" type="text" id="uName" key="playAgain">
    </div>
</template>

<script>
export default {
    name: "playAgain",
    props: {
        playAgain: Boolean
    }
    
}
</script>

<style>
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
input[type=text] {
  text-align: center;
}
</style>
