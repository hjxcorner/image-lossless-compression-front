<template>
  <div class="ImageCompression">
    <UploadImage />
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage'

export default {
  components: {
    UploadImage
  }
}
</script>

<style lang="scss" scoped>
.ImageCompression {
  margin: 100px 0;
}
</style>