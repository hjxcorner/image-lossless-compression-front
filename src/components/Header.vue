<template>
  <div class="header">
    <el-menu
      default-active="1"
      class="header-menu"
      mode="horizontal"
      @select="handleSelect"
      background-color="#ffffff"
      active-text-color="#409EFF"
    >
      <el-menu-item index="1">图片压缩</el-menu-item>
      <el-menu-item index="2">格式转换</el-menu-item>
      <el-menu-item index="3" class="personal-center">个人中心</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang='scss' scoped>
.header {

  .header-menu {
    display: flex;
    justify-content: center;
    border: 0;
    .personal-center {
      align-self: flex-end !important;
    }
    .is-active {
      
    }
  }
}

</style>