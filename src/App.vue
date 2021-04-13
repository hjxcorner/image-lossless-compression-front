<template>
  <div id="app">
    <Header />
    <UploadImage />
    <!-- <UploadInput / > -->
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import UploadImage from '@/components/UploadImage'
// import UploadInput from '@/components/UploadInput'

export default {
  components: {
    Header,
    UploadImage
    // UploadInput
  }
}
</script>

<style lang="scss">
html {
  background: rgb(241, 241, 241);
}
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
