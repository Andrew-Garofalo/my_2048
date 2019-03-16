<template>
  <v-app>
    <v-content>
      <div id="header">
        <h1 id="headText">Welcome to 2048</h1>
      </div>
      <board></board>
    </v-content>
  </v-app>
</template>

<script>
import board from './components/board'

export default {
  name: 'App',
  components: {
    board
  },
  data () {
    return {
      
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #34495e;
  background-color: #FAA4BD;
}

#header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 10vh;
  width: 100vw;
}
#headText {
  font-weight:bolder;
  font-size: 48px;
}
</style>
