<template>
  <div id="app">
    <Header />
    <UploadImage />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import UploadImage from '@/components/UploadImage'

export default {
  components: {
    Header,
    UploadImage
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
