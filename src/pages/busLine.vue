<template>
  <div>
    <span>查询用户</span>
    <el-input placeholder="请输入内容" v-model="input10" clearable style="margin-bottom:30px;width:30%;"></el-input>
    <div>
      <el-table :data="list" style="width:100%" height="620" @expand-change="expandChange">
        <!-- <el-table-column type="selection" align="left" width="40px"></el-table-column> -->
        <el-table-column align="center" label="#" width="50px">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>

        <el-table-column type="expand" width="80px">
          <template slot-scope="props">
            <el-scrollbar>
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
                style="margin-left:160px;height:300px;"
              >
                <el-form-item label="首发站:">
                  <span>{{ props.row.startstop }}</span>
                </el-form-item>
                <el-form-item label="终点站:">
                  <span>{{ props.row.endstop }}</span>
                </el-form-item>
                <el-form-item label="首班车时间:">
                  <span>{{ props.row.stime }}</span>
                </el-form-item>
                <el-form-item label="末班车时间:">
                  <span>{{ props.row.etime }}</span>
                </el-form-item>
                <el-form-item label="全程距离:">
                  <span>{{ props.row.distance }}公里</span>
                </el-form-item>
                <el-form-item label="票价:">
                  <span>{{ props.row.basicprice }}～{{ props.row.totalprice }}元</span>
                </el-form-item>
                <el-form-item label="站点名称:" style="width:100%;">
                  <el-timeline style="margin-top:25px;height:170px;width:500px;font-size:15px">
                    <el-timeline-item color="green">{{props.row.stationInfo[0].stationName}}</el-timeline-item>
                    <el-timeline-item
                      v-for="(b,index) in props.row.stationInfo"
                      v-if="index>1&&index<(props.row.stationInfo.length-1)"
                      :key="index"
                    >{{b.stationName}}</el-timeline-item>
                    <el-timeline-item
                      color="red"
                    >{{props.row.stationInfo[props.row.stationInfo.length-1].stationName}}</el-timeline-item>
                  </el-timeline>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </template>
        </el-table-column>

        <el-table-column label="公交ID" prop="id" align="center"></el-table-column>
        <el-table-column label="公交名称" prop="name" align="center" width="400px"></el-table-column>
        <el-table-column label="公交类型" prop="type" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="updateInfoForm(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="dialogFormVisible = true"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="修改收货地址" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="selectedInfo" style="padding-right:10px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公交名称" :label-width="formLabelWidth">
              <el-input v-model="selectedInfo.name" autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公交类型" :label-width="formLabelWidth">
              <el-input v-model="selectedInfo.type" autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首班车时间" :label-width="formLabelWidth">
              <el-input v-model="selectedInfo.stime" autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="末班车时间" :label-width="formLabelWidth">
              <el-input v-model="selectedInfo.etime" autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="基础票价" :label-width="formLabelWidth">
              <el-input v-model="selectedInfo.basicprice" autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全程票价" :label-width="formLabelWidth">
              <el-input v-model="selectedInfo.totalprice" autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="全程距离" :label-width="formLabelWidth">
              <el-input v-model="selectedInfo.distance" autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="站点名称" :label-width="formLabelWidth">
              <el-input :value="selectedInfo.viastops" type="textarea" autocomplete="off" :rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLineInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { error } from 'util';
export default {
  name: "User",
  data() {
    return {
      color: "#99a9bf",
      input10: "",
      show: false,
      list: [],
      selectedInfo: [],
      stationInfo: [],
      dialogFormVisible: false,
      formLabelWidth: "100px"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      var that = this;
      axios
        .get("/api/bus/getLineInfo")
        .then(function(response) {
          // console.log(response.data);
          that.list = response.data;
          var str;
          for (var i in response.data) {
            str = response.data[i].viastops.split(","); //将线路字符串转化为数组

            for (var j in str) {
              // console.log(str[j])
              that.stationInfo.push({
                stationName: str[j]
              });
            }
            // console.log(that.stationInfo);
            //洗增数组格式的station信息到list
            that.list[i].stationInfo = that.stationInfo;
            that.stationInfo = [];
          }
          // console.log(that.stationInfoTotal[0].names);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    expandChange: function(row, expandedRows) {
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    updateInfoForm(e) {
      // console.log(e);
      this.dialogFormVisible = true;
      this.selectedInfo = e;
    },
    updateLineInfo() {
      var that=this
      axios
        .post("/api/bus/updateLineInfo", this.selectedInfo)
        .then(response =>
          console.log(response.data),
          that.dialogFormVisible=false,
        )
        .catch( error =>
          console.log(error)
        );
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

<style >
#container {
  display: flex;
}
.el-timeline-item {
  padding: 1px;
}
.demo-table-expand label {
  width: 130px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 40%;
}
span {
  font-size: 15px;
}
.el-input__inner {
  height: 40px;
}
</style>

