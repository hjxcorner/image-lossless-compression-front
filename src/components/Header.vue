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
      <router-link
        to="/"
        tag="div"
      >
        <el-menu-item index="1">图片压缩</el-menu-item>
      </router-link>
      <router-link
        to="/conversion"
        tag="div"
      >
        <el-menu-item index="2">格式转换</el-menu-item>
      </router-link>
      <router-link
        to="/personal"
        tag="div"
      >
        <el-menu-item
          index="3"
          @click="openDialog"
        >个人中心</el-menu-item>
      </router-link>
    </el-menu>
    <Login
      v-if="!isLogin"
      :dialogFormVisible="dialogFormVisible"
      :closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import Login from "../components/Login";

export default {
  components: {
    Login
  },
  data() {
    return {
      dialogFormVisible: false
    };
  },
  computed: {
    isLogin() {
      return false;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    openDialog() {
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.dialogFormVisible = false;
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