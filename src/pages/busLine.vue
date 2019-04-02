<template>
  <div>
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
      <el-table-column align="center" label="线路名">
        <template slot-scope="scope">
          <span>{{ scope.row.station_line}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="站点名称">
        <template slot-scope="scope">
          <span>{{ scope.row.station_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="站点所在线路序号">
        <template slot-scope="scope">
          <span>{{ scope.row.linescount}}</span>
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
  name: "User",
  data() {
    return {
      input10:'',
      show: false,
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
          that.list = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    deleteUser(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var that = this;
          var id = row.id;
          var params = new URLSearchParams();
          params.append("id", id);
          axios
            .post("/api/user/deleteUser", params)
            .then(function(response) {
              var result = response.data;
              if (result) {
                that.getList();
              }
            })
            .catch(function(error) {
              this.$error({
                type: "info",
                message: "删除失败"
              });
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>