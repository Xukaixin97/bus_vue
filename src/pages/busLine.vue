<template>
  <div>
    <span>查询线路</span>
    <el-cascader
      clearable
      expand-trigger="hover"
      :options="options"
      @change="handleChange"
      style="width:200px;"
      placeholder="请选择城市"
      :show-all-levels="false"
    ></el-cascader>
    <el-select v-model="busType" multiple style="width:220px;" placeholder="请选择公交类型">
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input
      placeholder="请输入公交关键词"
      v-model="busKeyWords"
      clearable
      style="margin-bottom:30px;width:220px;"
    ></el-input>

    <el-button type="success" @click="searchByKeyWords">搜索</el-button>
    <div>
      <el-table :data="list" style="width:100%" height="600" @expand-change="expandChange">
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
import { error } from "util";

export default {
  name: "User",
  data() {
    return {
      options: [],
      typeOptions: [
        {
          value: "地铁",
          label: "地铁"
        },
        {
          value: "普通公交",
          label: "普通公交"
        }
      ],
      city: "",
      busType: "",
      color: "#99a9bf",
      busKeyWords: "",
      show: false,
      list: [],
      selectedInfo: [],
      stationInfo: [],
      dialogFormVisible: false,
      formLabelWidth: "100px",
      currentPage: 1,
      pageSize: 10,
      totalPage: 200
    };
  },
  created() {
    this.getList();
    this.getCounts();
    this.getCity();
  },
  methods: {
    searchByKeyWords() {
      // console.log(this.city + "," + this.busKeyWords + "," + this.busType);
     
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(this.pageSize);
      // console.log(`每页 ${val} 条`);
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
      this.getList();
    },
    handleChange(value) {
      if(value.length>0){
        console.log(value)
      this.city = value[1];
      }else{
        this.city=""
      }
      
    },
    getCity() {
      var that = this;
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
          console.log(options);
        });
      });
    },
    getCounts() {
      var that = this;
      axios
        .get("/api/bus/getCounts")
        .then(function(response) {
          console.log("1");
          // console.log(response.data)
          var j = parseInt(response.data);
          that.totalPage = j;
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
      params.append("city", this.city);
      params.append("busType", this.busType);
      params.append("busKeyWords", this.busKeyWords);
      axios
        .post("/api/bus/getLineInfo", params)
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
      var that = this;
      axios
        .post("/api/bus/updateLineInfo", this.selectedInfo)
        .then(
          response => console.log(response.data),
          (that.dialogFormVisible = false)
        )
        .catch(error => console.log(error));
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

