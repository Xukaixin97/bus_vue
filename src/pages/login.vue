<template>
  <div id="app">
    <div class="main">
      <div class="signin">
        <h1>请登陆。</h1>
      </div>
      <div class="rs-container">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input class="modinput"
              placeholder="请输入账号"
              name="username"
              type="text"
              v-model="ruleForm.username"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="modinput"
              v-model="ruleForm.password"
              placeholder="请输入密码"
              name="password"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span style="font-size:14px;padding-bottom: 100px;">账号可以是你的电子邮件地址或手机号码。</span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 408.33px;height: 56.09px; font-size:17px"
              @click="submitForm('ruleForm')"
            >登陆</el-button>
          </el-form-item>
        </el-form>
        <br>
        <el-button type="text" style="font-size:17px">忘记了账号或者密码？</el-button>
        <br>
        <el-button
          type="text"
          @click="toRegister"
          style="font-size:17px;padding-top: 10px;"
        >没有账号？立即创建一个。</el-button>
      </div>
    </div>
    <hr>
    <span style="font-size:17px;padding-left: 300px;">
      需要更多帮助？立即
      <el-button type="text" style="font-size:17px">在线交流</el-button>，或拨打 100-666-8800。
    </span>
  </div>
</template>

<script>
import axios from "axios";
import { error } from "util";

export default {
  name: "Login",
  data() {
    var validateUsernameIfExit = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        // console.log(value)
        var params = new URLSearchParams();
        params.append("username", value);
        axios
          .post("/api/admin/checkUsernameIfExit", params)
          .then(function(response) {
            var result = response.data;
            // console.log(result)
            if (result == false) {
              callback(new Error("用户不存在"));
            } else {
              callback();
            }
          })
          .catch(error => console.log(error));
      }
    };
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          // { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: validateUsernameIfExit, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },

  methods: {
    toRegister() {
      this.$router.push("/register");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var that = this;
          var param = new URLSearchParams();
          param.append("username", this.ruleForm.username);
          param.append("password", this.ruleForm.password);
          axios
            .post("/api/admin/login", param)
            .then(function(response) {
              console.log(response.data)
              if (response.data) {
                localStorage.setItem("token", "token123");
                localStorage.setItem("username",response.data.username)
                that.$router.push({
                  path: "/index",
                });
              } else {
                that.$message.error("用户名与密码不匹配");
              }
            })
            .catch(error => console.log(error));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
  padding-left: 300px;
  padding-bottom: 60px;
}
.signin {
  padding-top: 70px;
  padding-bottom: 20px;
}

.el-input {
  width: 408.33px;
  font-size: 16px;
}

</style>

<style >
.modinput .el-input__inner{
  height: 56.09px;
}
.el-button--text {
  padding: 0;
}
</style>

