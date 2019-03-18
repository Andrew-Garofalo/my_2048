<template>
    <div v-show="enterName">
      <label class="nameEntry" for="uName">Enter your name for the high score list:</label>
      <input v-on:keyup.enter="$emit('callAddHighScore')" class="nameBox" type="text" id="uName" key="enterName">
    </div>
</template>

<script>
export default {
    name: "enterScore",
    props: {
        enterName: Boolean
    }
}
</script>

<style>
.nameEntry {
  font-size: 2em;
  padding-right: 5px;
}
input[type=text] {
  text-align: center;
}
.nameBox {
    min-height:2em;
    border: solid;
    border-width: 1px;
    border-color: black;
}
</style>
