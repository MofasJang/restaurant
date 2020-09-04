<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>菜谱管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="hover">
      <div style="margin-top: 12px;">
        <el-button type="primary" style="width: 100%;" @click="dialogVisible = true">新增菜品</el-button>
      </div>
      <el-dialog
        title="新增菜品"
        :visible.sync="dialogVisible"
        width="50vw"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="addRecipeFormRef"
          :model="addRecipeForm"
          :rules="addRecipeFormRules"
          label-width="10vw"
          style="padding-right:2vw;"
        >
          <el-form-item label="菜品名" prop="name">
            <el-input v-model="addRecipeForm.name" placeholder="请输入菜品名" clearable></el-input>
          </el-form-item>
          <el-form-item label="菜品价格" prop="price">
            <el-input-number
              style="width:100%"
              v-model="addRecipeForm.price"
              :step="1"
              :min="1"
              :max="999"
              placeholder="请输入菜品价格"
              step-strictly
            ></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <div>
            <el-button @click="cancelAddRecipe">取消</el-button>
            <el-button type="success" @click="completeAddRecipe" :loading="modifyLoading">完成</el-button>
          </div>
        </span>
      </el-dialog>
      <div class="recipe-card" v-loading="recipeLoading">
        <el-table stripe :data="currentRecipeinfo">
          <el-table-column prop="food_id" label="餐品ID" align="center"></el-table-column>
          <el-table-column prop="food_name" label="餐品名" align="center"></el-table-column>
          <el-table-column prop="food_price" label="餐品价格" align="center">
            <template slot-scope="scope">￥ {{scope.row.food_price}}</template>
          </el-table-column>
          <el-table-column prop="state" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="medium"
                type="danger"
                :loading="modifyLoading"
                @click="deleteRecipe(scope.row.food_id,scope.row.food_name)"
              >删除餐品</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :total="totalPage"
        :hide-on-single-page="true"
        page-size="5"
      ></el-pagination>
    </el-card>
  </div>
</template>
<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-main {
  background-color: #eee;
  color: #333;
}
.box-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}
.recipe-card {
  display: flex;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>

<style>
.white-space {
  white-space: pre;
}
</style>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      totalRecipeinfo: [],
      currentRecipeinfo: [],
      totalPage: 0,
      recipeLoading: true,
      modifyLoading: false,
      dialogVisible: false,
      addRecipeForm: {
        name: "",
        price: ""
      },
      addRecipeFormRules: {
        name: [
          {
            required: true,
            message: "请输入餐品名",
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入餐品价格",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.$axios
      .get("https://cdn.guoshaocong.cn/getfoodinfo")
      .then(response => {
        this.totalRecipeinfo = response.data.result;
        this.totalPage = this.totalRecipeinfo.length;
        this.currentRecipeinfo = this.totalRecipeinfo.slice(
          (this.pagenum - 1) * 5,
          this.pagenum * 5
        );
        this.recipeLoading = false;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  beforeDestroy() {},
  methods: {
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.currentRecipeinfo = this.totalRecipeinfo.slice(
        (newPage - 1) * 5,
        newPage * 5
      );
    },
    deleteRecipe(id, name) {
      this.modifyLoading = true;
      this.$confirm("此操作将删除 " + name + " , 是否继续？", "敏感操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          this.$axios
            .post("https://cdn.guoshaocong.cn/deletefood", {
              token: window.sessionStorage.getItem("token"),
              id: id
            })
            .then(response => {
              if (response.data.state == 200) {
                this.$message.success("删除成功");
                this.modifyLoading = false;
                this.$router.go(0);
              } else {
                this.modifyLoading = false;
                this.$message.error("删除失败，请重试");
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          this.modifyLoading = false;
        });
    },
    cancelAddRecipe() {
      this.dialogVisible = false;
      this.$refs.addRecipeFormRef.resetFields();
    },
    completeAddRecipe() {
      this.modifyLoading = true;
      this.$refs.addRecipeFormRef.validate(async valid => {
        if (!valid) {
          this.modifyLoading = false;
          return false;
        }
        this.$axios
          .post("https://cdn.guoshaocong.cn/addrecipe", {
            token: window.sessionStorage.getItem("token"),
            name: this.addRecipeForm.name,
            price: this.addRecipeForm.price
          })
          .then(response => {
            if (response.data.state == 200) {
              this.$message.success("成功新增菜品");
              this.totalRecipeinfo.unshift({
                food_price: this.addRecipeForm.price,
                food_name: this.addRecipeForm.name 
              });
              this.handleCurrentChange(this.pagenum);
              this.dialogVisible = false;
              this.modifyLoading = false;
              this.$refs.addRecipeFormRef.resetFields();
            } else {
              this.dialogVisible = false;
              this.modifyLoading = false;
              this.$refs.addRecipeFormRef.resetFields();
              this.$message.error("操作失败，请重试");
            }
          })
          .catch(function(error) {
            console.log(error);
            this.modifyLoading = false;
          });
      });
    }
  }
};
</script>