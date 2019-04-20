<template>
  <div id="app">
    <span>查询用户</span>
    <el-input placeholder="请输入用户名关键词" v-model="nameKeyWord" clearable style="margin-bottom:30px;width:200px;"></el-input>
    <el-input placeholder="请输入手机号关键词" v-model="telephoneKeyWord" clearable style="margin-bottom:30px;width:200px;"></el-input>
    <el-button type="success" @click="searchByKeyWords" >搜索</el-button>
    <el-table style="width:100%;" :data="list" height="600">
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
    <div class="block" style="width:100%">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
  </div>
  
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      show: false,
      nameKeyWord: "",
      telephoneKeyWord: "",
      list: null,
      currentPage: 1,
      pageSize: 10,
      totalPage: 200,
    };
  },
  created() {
    this.getList();
    this.getCounts();
  },
  methods: {
    searchByKeyWords(){
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // console.log(this.pageSize);
      // console.log(`每页 ${val} 条`);
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // console.log(`当前页: ${val}`);
      this.getList();
    },
    getCounts(){
      var that = this;
       axios
        .get("/api/user/getCounts")
        .then(function(response) {

          // console.log(response.data)
          var j = parseInt(response.data)
          that.totalPage = j
          // console.log(that.stationInfoTotal[0].names);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageSize", this.pageSize);
      params.append("currentPage", this.currentPage);
       params.append("telephoneKeyWord", this.telephoneKeyWord);
       params.append("nameKeyWord", this.nameKeyWord);
      axios
        .post("/api/user/getUserInfo",params)
        .then(function(response) {
          // console.log(response.data);
          that.list = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    serachUserInfo(){
      var that = this
      var params = new URLSearchParams;
      params.append("nameKeyWord",this.nameKeyWord);
      params.append("telephoneKeyWord",this.telephoneKeyWord);
    },
    deleteUser(row) {
      var that = this;
      var id = row.id;
      var params = new URLSearchParams();
      params.append("id", id);
      // console.log(id);
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