<template>
  <div class="main">
    <div id="container" style="margin-bottom:30px">
      <el-cascader
        expand-trigger="hover"
        :options="options"
        @change="handleChange"
        style="width:200px;margin-right:20px"
        placeholder="请选择城市"
        :show-all-levels="false"
      ></el-cascader>
      <!-- <v-distpicker
        :province="this.province"
        :city="this.city"
        hide-area
        @province="onChangeProvince"
        @city="onChangeCity"
        style="margin-right:10px"
      ></v-distpicker> -->
      <el-input
        v-model="input"
        placeholder="请输入关键词"
        clearable
        style="width:200px;margin-right:20px"
      ></el-input>
      <el-button type="success" @click="search">搜索</el-button>
    </div>
    <div>
      <el-button type="primary" @click="batchAdd">批量添加</el-button>
    </div>
    <div>
      <el-table :data="lineInfo" style="width:100%" height="500" ref="multipleTable" @expand-change="expandChange">
        <!-- <el-table-column type="selection" align="left" width="40px"></el-table-column> -->
        <el-table-column type="selection" width="40px"></el-table-column>
        <el-table-column align="center" label="#" width="40px">
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
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
                <span style="margin-left:90px;">{{ props.row.via_stops}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="公交ID" prop="id" align="center"></el-table-column>
        <el-table-column label="公交名称" prop="name" align="center"></el-table-column>
        <el-table-column label="公交类型" prop="type" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="addLineInfo(scope.row)">添加到数据库</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>


<script >
import axios from "axios";
import VDistpicker from "v-distpicker";
export default {
  data() {
    return {
      city: "",
      input: "",
      province: "",
      selectedOptions: "",
      lineInfo: null,
      options: []
    };
  },
  // components: { VDistpicker },
  created() {
    this.getCity();
    
  },
  methods: {
    batchAdd(){
      console.log(this.$refs.multipleTable.selection)
      var params = this.$refs.multipleTable.selection;
      params.forEach(element => {
        // console.log(element)
        this.addLineInfo(element)
      });
      // axios.post("/api/bus/batchAdd")
      // .then(res = {

      // })
      // .catch(error => console.log(error))
    },
    handleChange(value) {
        console.log(value)
       this.city = value[1];
      },
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
        console.log(that.city);
        //实例化公交线路查询类
        var linesearch = new AMap.LineSearch({
          pageIndex: 1, //页码，默认值为1
          pageSize: 50, //单页显示结果条数，默认值为20，最大值为50
          city: that.city, //限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
          extensions: "all" //是否返回公交线路详细信息，默认值为『base』
        });
        //执行公交路线关键字查询
        linesearch.search(that.input, function(status, result) {
          //打印状态信息status和结果信息result
          // console.log(status, result);
          if (result.lineInfo == null) {
            that.$message({
              message: "未查到数据",
              type: "warning"
            });
            return false;
          }
          that.lineInfo = result.lineInfo;

          // console.log(that.lineInfo.length)
          var stops = "";
          var stationInfo = "";
          for (var i = 0; i < that.lineInfo.length; i++) {
            stops = "";
            stationInfo = "";
            stops = result.lineInfo[i].via_stops;
            var length = stops.length;
            for (var j = length - 1; j >= 0; j--) {
              stationInfo = stops[j].name + "," + stationInfo;
            }
            that.lineInfo[i].via_stops = stationInfo.substring(
              0,
              stationInfo.length - 1
            );

            //转化时间的格式
            if (
              that.lineInfo[i].etime != null &&
              that.lineInfo[i].etime != ""
            ) {
              that.lineInfo[i].etime =
                that.lineInfo[i].etime.substring(0, 2) +
                ":" +
                that.lineInfo[i].etime.substring(2);
            } else {
              that.lineInfo[i].etime = "暂无";
            }
            if (
              that.lineInfo[i].stime != null &&
              that.lineInfo[i].stime != ""
            ) {
              that.lineInfo[i].stime =
                that.lineInfo[i].stime.substring(0, 2) +
                ":" +
                that.lineInfo[i].stime.substring(2);
            } else {
              that.lineInfo[i].stime = "暂无";
            }
          }

      });
      });


     
    },
    getCity(){
      var that = this
         AMap.plugin("AMap.DistrictSearch", function() {
        var districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: "country",
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 2
        });

        // 搜索所有省/直辖市信息
        districtSearch.search("中国", function(status, result) {
          // 查询成功时，result即为对应的行政区信息
          // console.log(result.districtList[0].districtList);
          // console.log(result.districtList[0].districtList.length);
          // var length = result.districtList[0].districtList.length;
          // that.options.forEach((item, index) => {
          let cityData = JSON.stringify(result.districtList[0].districtList);
          var options = JSON.parse(
            cityData.replace(/citycode/g, "value").replace(/name/g, "label")
          );
          // });
          options.map((item, index) => {
            item.children = item.districtList;
            options.push(item);
          });
          that.options = options;
          // console.log(options);
        });
      });
    },
    expandChange: function(row, expandedRows) {
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },

    addLineInfo(e) {
      console.log(e);
      var that = this;
      var infos = JSON.parse(JSON.stringify(e));
      // console.log(JSON.stringify(this.lineInfo[0]))
      // console.log(infos)
      axios
        .post("/api/bus/addLineInfo", infos, {})
        .then(function(response) {
          console.log(response.data);
          if (response.data == true) {
            that.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            that.$message({
              message: "添加失败,"+infos.name+"已经存在",
              type: "warning"
            });
          }
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