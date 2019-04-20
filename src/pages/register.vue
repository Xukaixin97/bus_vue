<template>
  <div>
    <div class="main">
      <div class="signin">
        <h1>创建您的账号。</h1>
      </div>
      <div class="rs-container">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          status-icon
          class="register-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" name="username" type="text" v-model="ruleForm.username"/>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="请输入密码"
              name="password"
            />
            <span class="show-pwd"></span>
          </el-form-item>

          <el-form-item prop="password2">
            <el-input
              v-model="ruleForm.password2"
              type="password"
              placeholder="请确认密码"
              name="password2"
            />
            <span class="show-pwd"></span>
          </el-form-item>

          <el-form-item prop="email">
            <div style="width: 408.33px;display:flex ">
              <el-input
                style="width: 308.33px;"
                v-model="ruleForm.email"
                type="text"
                placeholder="请输入邮箱"
                name="email"
                auto-complete="on"
              ></el-input>

              <el-button type="primary" @click="sendMsg" style="height:56.09px;">发送验证码</el-button>
            </div>
            <span class="status">{{statusMsg}}</span>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="ruleForm.code" maxlength="6" placeholder="请输入验证码" name="code"/>
          </el-form-item>
          <br>
          <el-button
            type="primary"
            style="width: 408.33px;height: 56.09px; font-size:17px"
            @click="submitForm('ruleForm')"
          >立即注册</el-button>
        </el-form>
        <br>
        <el-button type="text" @click="toLogin" style="font-size:17px;">已有账号！立即登陆。</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { error } from "util";
export default {
  name: "Register",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value != this.ruleForm.code2) {
        console.log(value + "," + this.ruleForm.code2);
        callback(new Error("验证码错误，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      statusMsg: "",
      ruleForm: {
        username: "",
        password: "",
        password2: "",
        email: "",
        code: "",
        code2: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 13, message: "长度在 6 到 13 个字符", trigger: "blur" }
        ],
        password2: [{ validator: validatePass2, trigger: "blur" }],

        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],

        // code: [
        //   {
        //     validator: validateCode,
        //     trigger: "blur"
        //   }
        // ]
      }
    };
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          axios
            .post("/api/admin/regist", this.ruleForm)
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendMsg() {
      var params = new URLSearchParams();
      params.append("email", this.ruleForm.email);
      console.log(this.ruleForm.email);
      axios
        .post("/api/admin/sendMsg", params)
        .then(response => {
          this.ruleForm.code2 = response.data; //返回的验证码
          // console.log(this.ruleForm.code2);
        })
        .catch(error => console.log("error"));
    }
  }
};
</script>

<style scoped>
.main {
  width: 100%;
  padding-left: 300px;
  padding-bottom: 60px;
}

.signin {
  padding-top: 40px;
  padding-bottom: 20px;
}

.el-input {
  width: 408.33px;
  font-size: 16px;
}
</style>

<style >
.el-input__inner {
  height: 56.09px;
}
.el-button--text {
  padding: 0;
}
</style>



