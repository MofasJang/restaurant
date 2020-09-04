<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>服务管理</el-breadcrumb-item>
      <el-breadcrumb-item>点菜</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="addBook-card" shadow="hover">
      <el-alert title="点击这个按钮开始点菜" center type="info" show-icon></el-alert>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button
            type="primary"
            style="width:100%"
            @click="dialogVisible = true"
          >点击此按钮开始点菜</el-button>
        </el-col>
      </el-row>
      <el-dialog
        title="点菜"
        :visible.sync="dialogVisible"
        width="50%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="addBookFormRef"
          :model="addBookForm"
          :rules="addBookFormRules"
          label-width="140px"
          style="padding-right:40px;"
        >
          <el-form-item label="顾客名称" prop="customer_name">
            <el-input
              v-model="addBookForm.customer_name"
              prefix-icon="el-icon-notebook-2"
              placeholder="请输入您的姓名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="菜品编号" prop="food_id">
            <el-input
              v-model="addBookForm.food_id"
              prefix-icon="el-icon-user"
              placeholder="请输入菜品编号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="菜品名称" prop="food_name">
            <el-input
              v-model="addBookForm.food_name"
              prefix-icon="el-icon-folder"
              placeholder="请输入菜品名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="菜品数量" prop="food_num">
            <el-input-number
              style="width:100%"
              v-model="addBookForm.food_num"
              placeholder="请输入菜品数量"
              clearable
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <div>
            <el-button @click="cancelAddBook">Cancel</el-button>
            <el-button type="success" @click="completeAddBook">Complete</el-button>
          </div>
        </span>
      </el-dialog>
      <el-divider></el-divider>
        <el-table stripe max-height="500" :data="booklist">
        <el-table-column label="订单编号" prop="order_id">
          <template slot-scope="scope">
            <el-popover placement="right" width="300" close-delay="200" trigger="hover">
              <el-link slot="reference">{{scope.row.order_id}}</el-link>
              <barcode style="text-align:center" :value="scope.row.order_id">Fail to show barcode.</barcode>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="顾客名称" prop="customer_name">
        </el-table-column>
        <el-table-column label="菜品编号" prop="food_id">
        </el-table-column>
        <el-table-column label="菜品名称" prop="food_name">
        </el-table-column>
        <el-table-column label="菜品数量" prop="food_num">
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :total="total"
        page-size="5"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      booklist: [],
      pagenum: 1,
      total: 0,
      addBookForm: {
        customer_name: "",
        food_id: "",
        food_name: "",
        food_num: ""
      },
      addBookFormRules: {
        customer_name: [
          {
            required: true,
            message: "Please enter the book title",
            trigger: "blur"
          }
        ],
        food_id: [
          {
            required: true,
            message: "Please enter the location",
            trigger: "blur"
          }
        ],
        food_num: [
          {
            required: true,
            message: "Please enter the price",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    getBookList() {
      // 修改这里以从后端调取信息
      /*
       if (this.pagenum == 1) {
        this.booklist = [
          {
            order_id: "00001",
            customer_name: "Villa in heavy snow",
            food_id: "Higashino Keigo",
            food_name: "Math",
            food_num: "23"
          },
          {
            book_id: "00002",
            bookname: "Ten Mile Peach",
            author: "Tang Qigongzi",
            category: "Geography",
            location: "3 floor, bookcase No.44",
            price: "34",
            state: "Not loaned"
          },
          {
            book_id: "00003",
            bookname: "Why Sheng Xiaomo",
            author: "Gu Man",
            category: "Science",
            location: "5 floor, bookcase No.3",
            price: "53",
            state: "Lost"
          },
          {
            book_id: "00004",
            bookname: "Brief history of humanity",
            author: "[Israel] Yuval Herali",
            category: "History",
            location: "2 floor, bookcase No.13",
            price: "46",
            state: "Not loaned"
          },
          {
            book_id: "00005",
            bookname: "Those things in the Ming Dynasty",
            author: "DangNianMingyue",
            category: "History",
            location: "1 floor, bookcase No.66",
            price: "55",
            state: "Loaned out"
          }
        ];
      }
      if (this.pagenum == 2) {
        this.booklist = [
          {
            book_id: "00006",
            bookname: "Few people",
            author: "M. Scott Parker",
            category: "Social",
            location: "4 floor, bookcase No.43",
            price: "53",
            state: "Not loaned"
          },
          {
            book_id: "00007",
            bookname: "Pursuing the meaning of life",
            author: "[Austria] Victor Frank",
            category: "Human",
            location: "3 floor, bookcase No.22",
            price: "47",
            state: "Not loaned"
          },
          {
            book_id: "00008",
            bookname: "Secret garden",
            author: "Johanna Besford",
            category: "Art",
            location: "5 floor, bookcase No.37",
            price: "75",
            state: "Not loaned"
          }
        ];
      }
      this.total = 8;
      this.$message.success("Fetching book list succeeded");
 */
 /*     this.$http.post("/api/order/search_order",{
          }).then((res) =>  {
            var table = res.data;
            console.log(res);
            this.total=table.length;   
            var pagenow=this.pagenum;
            console.log(pagenow);
            var index = (pagenow-1)*5;
            console.log(index);
            this.booklist=[];
            
            for(var i=index;i<this.total&& i<index+5;i++){
              this.booklist.push(table[i]);
            }
            console.log(res);
        });
  */     
        this.$axios.get("https://cdn.guoshaocong.cn/getorderinfo",{
          }).then((res) =>  {
            var table = res.data.result;
            console.log(res);
            this.total=table.length;   
            var pagenow=this.pagenum;
            console.log(pagenow);
            var index = (pagenow-1)*5;
            console.log(index);
            this.booklist=[];
            
            for(var i=index;i<this.total&& i<index+5;i++){
              this.booklist.push(table[i]);
            }
            console.log(res);
        });
      this.$message.success("已取得订单列表");
    },
    judgeType(state) {
      if (state == "Not loaned") return "success";
      if (state == "Lost") return "danger";
      else return "info";
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getBookList();
    },
    cancelAddBook() {
      this.dialogVisible = false;
      this.$refs.addBookFormRef.resetFields();
    },
    completeAddBook() {
      this.$refs.addBookFormRef.validate(async valid => {
        if (!valid) return false;
        // 在这里添加后端交互，下面是前端层面的新增操作
        /*
        this.booklist.unshift({
          book_id: (10000 + Math.floor(Math.random() * 90000)).toString(),
          bookname: this.addBookForm.bookname,
          author: this.addBookForm.author,
          category: this.addBookForm.category,
          location: this.addBookForm.location,
          price: this.addBookForm.price,
          state: "Not loaned"
        });
        this.booklist.pop();
        */
        // 上面是前端层面的新增操作，添加后端代码后删除上述代码并添加刷新页面操作
        this.dialogVisible = false;
 //       this.$refs.addBookFormRef.resetFields();
/*        this.$http.post("/api/order/insert_order",{
                  customer_name: this.addBookForm.customer_name,
                  food_id: this.addBookForm.food_id,
                  food_name: this.addBookForm.food_name,
                  food_num: this.addBookForm.food_num,
                }).then((res) => {
                  console.log(res);
               });
*/             
        this.$axios.post("https://cdn.guoshaocong.cn/addorder",{
                  order_id : 0,
                  customer_name: this.addBookForm.customer_name,
                  food_id: this.addBookForm.food_id,
                  food_name: this.addBookForm.food_name,
                  food_num: this.addBookForm.food_num,
                }).then((res) => {
                  console.log(res);
               });
        this.$message.success("已成功增加订单");
        this.getBookList();
      });
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.addBook-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}
.el-pagination {
  margin-top: 15px;
}
.el-alert {
  margin-bottom: 15px;
}
.booklist-expand {
  font-size: 0;
}
.booklist-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
<style>
/* <style>与<style scoped>的区别是前者会影响所有页面的样式，后者scoped属性会限制 */
/* 该组件的style的作用域，无法作用于其他element组件。通常情况，使用<style scoped> */
.booklist-expand label {
  width: 120px;
  font-weight: bold;
  color: #99a9bf;
}
</style>


