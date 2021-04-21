<template>
  <div class="login">
    <el-dialog
      :title="curTitle"
      :visible.sync="visible"
      width="30%"
      @close="close"
    >
      <div
        class="loginForm"
        v-if="type"
      >
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
        >
          <el-form-item
            label="账号"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model="loginForm.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="pass"
          >
            <el-input
              v-model="loginForm.pass"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
          <Identify
            :identifyCode="identifyCode"
            @updateCode="updateCode"
          />
          <el-form-item
            label="验证码"
            :label-width="formLabelWidth"
            prop="verifiCode"
          >
            <el-input
              v-model="loginForm.verifiCode"
              autocomplete="off"
            ></el-input>

          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="closeDialog()">取 消</el-button>
          <el-button
            type="success"
            @click="login"
          >登 录</el-button>
        </div>
      </div>
      <div
        class="registeredForm"
        v-else
      >
        <el-form
          :model="registeredForm"
          :rules="rules"
          ref="registerForm"
        >
          <el-form-item
            label="账号"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model="registeredForm.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="pass"
          >
            <el-input
              v-model="registeredForm.pass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            :label-width="formLabelWidth"
            prop="repass"
          >
            <el-input
              v-model="registeredForm.repass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <Identify
            :identifyCode="identifyCode"
            @updateCode="updateCode"
          />
          <el-form-item
            label="验证码"
            :label-width="formLabelWidth"
            prop="verifiCode"
          >
            <el-input
              v-model="registeredForm.verifiCode"
              autocomplete="off"
            ></el-input>

          </el-form-item>

        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="closeDialog()">取 消</el-button>
          <el-button
            type="primary"
            @click="register"
          >注 册</el-button>
        </div>
      </div>
      <div class="select">
        <span @click="changeType">点击 <span class="goText">{{toTitle}}</span></span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Identify from "@/components/Identify";
import { mapMutations } from "vuex";

export default {
  components: {
    Identify
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    closeDialog: {
      type: Function
    }
  },
  data() {
    return {
      type: true,
      loginForm: {
        name: "",
        pass: "",
        verifiCode: ""
      },
      registeredForm: {
        name: "",
        pass: "",
        repass: "",
        verifiCode: ""
      },
      formLabelWidth: "80px",
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "不支持特殊字符",
            trigger: "blur"
          }
        ],
        pass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur"
          }
        ],
        repass: [
          {
            required: true,
            validator: this.checkRePass,
            trigger: "blur"
          }
        ],
        verifiCode: [
          {
            required: true,
            validator: this.checkVerifiCode,
            trigger: "blur"
          }
        ]
      },
      identifyCode: `${(Math.random() * 10000).toFixed(0)}`,
      visible: this.dialogFormVisible
    };
  },
  watch: {
    dialogFormVisible() {
      this.visible = this.dialogFormVisible;
    }
  },
  computed: {
    curTitle() {
      return this.type ? "登录" : "注册";
    },
    toTitle() {
      return this.type ? "注册" : "登录";
    }
  },
  methods: {
    ...mapMutations(["updateUserData"]),
    getRandom() {
      return `${(Math.random() * 10000).toFixed(0)}`;
    },
    updateCode() {
      this.identifyCode = this.getRandom();
    },
    changeType() {
      this.type = !this.type;
      if (this.type) this.$refs.registerForm.resetFields();
      else this.$refs.loginForm.resetFields();
    },
    close() {
      this.closeDialog();
      this.type = true;
      this.initFormData();
    },
    initFormData() {
      this.updateCode();
      this.loginForm = {
        name: "",
        pass: "",
        verifiCode: ""
      };
      this.registeredForm = {
        name: "",
        pass: "",
        repass: "",
        verifiCode: ""
      };
    },
    register() {
      console.log(this.registeredForm);
      let isPass = true;
      this.$refs.registerForm.validate(valid => {
        isPass = valid;
      });
      if (isPass) {
        this.$http
          .post("/users/register", this.registeredForm)
          .then(data => {
            if (data.data.success) {
              this.$message({
                showClose: true,
                message: data.data.data.msg,
                type: "success"
              });
              this.close();
            } else {
              this.$message({
                showClose: true,
                message: data.data.data.msg,
                type: "error"
              });
            }
          })
          .catch(err => console.log(err));
      }
    },
    login() {
      let isPass = true;
      this.$refs.loginForm.validate(valid => {
        isPass = valid;
      });
      if (isPass) {
        this.$http
          .post("/users/login", this.loginForm)
          .then(data => {
            console.log(data.data.success);
            if (data.data.success) {
              this.$message({
                showClose: true,
                message: `登录成功`,
                type: "success"
              });
              this.close();
            }
            const token = data.data.data.token;
            const userData = data.data.data.userData;
            this.updateUserData(userData);
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("userData", JSON.stringify(userData));
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err,
              type: "error"
            });
          });
      }
    },
    checkVerifiCode(rule, value, callback) {
      if (!value) callback(new Error("请输入验证码"));
      else if (value !== this.identifyCode) {
        callback(new Error("验证码有误"));
        this.updateCode();
      }
    },
    checkRePass(rule, value, callback) {
      if (!value) callback(new Error("请再次输入密码"));
      else if (value !== this.registeredForm.pass)
        callback(new Error("两次输入密码不一致"));
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
.select {
  position: absolute;
  bottom: 10px;
  right: 10px;
  .goText {
    color: #409eff;
    cursor: pointer;
  }
}
</style>