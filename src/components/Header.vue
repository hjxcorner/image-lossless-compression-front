<template>
  <div class="header">
    <el-menu
      :default-active="defaultActive"
      class="header-menu"
      mode="horizontal"
      @select="handleSelect"
      background-color="#ffffff"
      active-text-color="#409EFF"
    >
      <router-link
        to="/compression"
        tag="div"
      >
        <el-menu-item index="0">图片压缩</el-menu-item>
      </router-link>
      <!-- <router-link
        to="/conversion"
        tag="div"
      >
        <el-menu-item index="1">格式转换</el-menu-item>
      </router-link> -->
      <router-link
        to="/personal"
        tag="div"
      >
        <el-menu-item index="2">个人中心</el-menu-item>
      </router-link>
      <el-dropdown
        :hide-on-click="false"
        trigger="click"
        @command="selectDropMenu"
      >
        <div class="avatarBox">
          <div class="avatar">
            <img
              v-if="userData"
              :src="userData.avatar"
            >
          </div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in dropdownOption"
            :key="item"
            :command="item"
          >{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="feedback">
        <span @click="feedBack">意见反馈</span>
        <el-dialog
          title="意见反馈"
          :visible.sync="dialogVisible"
          width="50%"
        >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="feedbackText"
            maxlength="100"
            show-word-limit
            height="200"
          >
          </el-input>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="submitOpinion"
            >提 交</el-button>
          </span>
        </el-dialog>
      </div>
    </el-menu>
    <Login
      v-if="!isLogin()"
      :dialogFormVisible="dialogFormVisible"
      :closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import Login from "../components/Login";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    Login
  },
  data() {
    return {
      dialogFormVisible: false,
      routeList: ["/compression", "/conversion", "/personal"],
      defaultActive: "0",
      notloggedOption: ["登录/注册"],
      loggedOption: ["退出登录"],
      dialogVisible: false,
      feedbackText: ""
    };
  },
  computed: {
    ...mapGetters(["userData"]),
    dropdownOption() {
      return this.userData ? this.loggedOption : this.notloggedOption;
    }
  },
  mounted() {
    this.defaultActive = this.routeList.indexOf(this.$route.path).toString();
    if (this.$route.path === "/") this.defaultActive = "0";
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.updateUserData(userData);
  },
  methods: {
    ...mapMutations(["updateUserData"]),
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    openDialog() {
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.dialogFormVisible = false;
    },
    isLogin() {
      return this.userData;
    },
    selectDropMenu(command) {
      if (command === "退出登录") {
        this.logout();
      } else if (command === "登录/注册") {
        this.openDialog();
      }
    },
    logout() {
      this.updateUserData(null);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
    submitOpinion() {
      if (this.feedbackText.length < 10) {
        this.$message({
          showClose: true,
          message: "文字长度至少为10",
          type: "warning"
        });
        return;
      }
      const data = {
        userId: this.userData._id,
        content: this.feedbackText
      };
      this.$http
        .post("/opinion/feedback", data)
        .then(data => {
          if (data.data.success) {
            this.$message({
              showClose: true,
              message: "提交成功",
              type: "success"
            });
            this.feedbackText = "";
            this.dialogVisible = false;
          } else {
            this.$message({
              showClose: true,
              message: data.data.data.msg,
              type: "success"
            });
          }
        })
        .catch(err => console.log(err));
    },
    feedBack() {
      if(this.isLogin()) this.dialogVisible = true
      else {
        this.$message.warning('请先登录')
        this.dialogFormVisible = true
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.header {
  .header-menu {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    .personal-center {
      align-self: flex-end !important;
    }
    .avatarBox {
      height: 100%;
      outline: none;
      cursor: pointer;
      .avatar {
        width: 30px;
        height: 30px;
        background-color: #909399;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .feedback {
      font-size: 14px;
      outline: none;
      cursor: pointer;
      position: absolute;
      right: 20px;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>