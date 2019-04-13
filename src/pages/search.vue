<template>
  <div class="main">
    <div id="container" style="margin-bottom:30px">
      <el-input v-model="input" placeholder="请输入关键词" clearable style="width:30%;"></el-input>
      <el-button type="success" @click="search">搜索</el-button>
    </div>
    <div>
      <el-table :data="lineInfo" style="width:100%" height="600">
        <!-- <el-table-column type="selection" align="left" width="40px"></el-table-column> -->
        <el-table-column type="expand" width="30px">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="首发站:">
                <span>{{ props.row.start_stop }}</span>
              </el-form-item>
              <el-form-item label="终点站:">
                <span>{{ props.row.end_stop }}</span>
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
                <span>{{ props.row.basic_price }}～{{ props.row.total_price }}元</span>
              </el-form-item>
              <el-form-item label="站点名称:" style="width:100%">
                <span style="margin-left:90px;">{{ props.row.via_stops }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="公交ID" prop="id" align="center"></el-table-column>
        <el-table-column label="公交名称" prop="name" align="center"></el-table-column>
        <el-table-column label="公交类型" prop="type" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="addLineInfo">添加到数据库</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>


<script >
import axios from "axios";
export default {
  data() {
    return {
      input: "",
      lineInfo: null
    };
  },
  methods: {
    search() {
      var that = this;
      if (this.input == "") {
        this.$message({
          message: "请输入关键词",
          type: "warning"
        });
        return;
      }
      AMap.plugin(["AMap.LineSearch"], function() {
        //实例化公交线路查询类
        var linesearch = new AMap.LineSearch({
          pageIndex: 1, //页码，默认值为1
          pageSize: 1, //单页显示结果条数，默认值为20，最大值为50
          city: "南京", //限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
          extensions: "all" //是否返回公交线路详细信息，默认值为『base』
        });
        //执行公交路线关键字查询
        linesearch.search(that.input, function(status, result) {
          //打印状态信息status和结果信息result
          // console.log(status, result);
          that.lineInfo = result.lineInfo;
          var stops = result.lineInfo[0].via_stops;
          var stationInfo = "";
          var length = stops.length;
          for (var i = length - 1; i >= 0; i--) {
            stationInfo = stops[i].name + "," + stationInfo;
          }
          // console.log(stationInfo);
          that.lineInfo[0].via_stops = stationInfo.substring(
            0,
            stationInfo.length - 1
          );
          if (that.lineInfo[0].etime != null && that.lineInfo[0].etime != "") {
            that.lineInfo[0].etime =
              that.lineInfo[0].etime.substring(0, 2) +
              ":" +
              that.lineInfo[0].etime.substring(2);
          } else {
            that.lineInfo[0].etime = "暂无";
          }
          if (that.lineInfo[0].stime != null && that.lineInfo[0].stime != "") {
            that.lineInfo[0].stime =
              that.lineInfo[0].stime.substring(0, 2) +
              ":" +
              that.lineInfo[0].stime.substring(2);
          } else {
            that.lineInfo[0].stime = "暂无";
          }
          console.log(that.lineInfo);
        });
      });
    },
    addLineInfo() {
      var that = this;
      var infos = JSON.parse(JSON.stringify(this.lineInfo[0]));
      // console.log(JSON.stringify(this.lineInfo[0]))
      // console.log(infos)
      axios
        .post("/api/bus/addLineInfo", infos, {})
        .then(function(response) {
          console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="">
#container {
  display: flex;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>