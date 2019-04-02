<template>
  <div id="app">
    <span>查询用户</span>
    <el-input placeholder="请输入内容" v-model="input10" clearable style="margin-bottom:30px;width:30%;"></el-input>
    <el-table style="width:100%;" :data="list" height="500">
      <el-table-column align="center" label="#">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="id" v-if="show">
        <template slot-scope="scope">
          <span>{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码">
        <template slot-scope="scope">
          <span>{{ scope.row.loginPassword}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.telephone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      show: false,
      input10: "",
      list: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var that = this;
      axios
        .get("/api/user/getUserInfo", {})
        .then(function(response) {
          console.log(response.data);
          that.list = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    deleteUser(row) {
      var that = this;
      var id = row.id;
      var params = new URLSearchParams();
      params.append("id", id);
      console.log(id);
      axios
        .post("/api/user/deleteUser", params)
        .then(function(response) {
          var result = response.data;
          if (result) {
            that.getList();
            that.$notify.success({
              title: 'Info',
            message: '删除成功',
            showClose: false
            })
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>