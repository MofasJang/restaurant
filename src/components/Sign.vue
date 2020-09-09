<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>服务管理</el-breadcrumb-item>
      <el-breadcrumb-item>签单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="addBook-card" shadow="hover">
      <el-alert title="请确定订单的内容" center type="info" show-icon></el-alert>
      <el-divider></el-divider>
        <el-table stripe max-height="1000" :data="booklist">
        <el-table-column label="订单编号" prop="order_id" align="center">
        </el-table-column>
        <el-table-column label="桌号" prop="tablenumber" align="center">
        </el-table-column>
        <el-table-column label="就餐人数" prop="peoplenum" align="center">
        </el-table-column>
        <el-table-column label="用户编号" prop="userid" align="center">
        </el-table-column>
        <el-table-column label="菜品编号" prop="food_id" align="center">
        </el-table-column>
        <el-table-column label="菜品名称" prop="food_name" align="center">
        </el-table-column>
        <el-table-column label="菜品价格" prop="food_price" align="center">
        </el-table-column>
        <el-table-column label="菜品数量" prop="food_num" align="center">
        </el-table-column>
        <el-table-column prop="state" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="modifyState(scope.row.tablenumber,scope.row.userid,scope.row.food_price)"
                :loading="modifyLoading"
              >确定签单</el-button>
              <el-button
                type="danger"
                :loading="modifyLoading"
                @click="deleteOrder(scope.row.order_id)"
              >取消订单</el-button>
            </template>
          </el-table-column>
      </el-table>
      <div>总价：￥{{totalPrice}}</div>
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :total="total-1"
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
      numlist: [],
      pagenum: 1,
      total: 0,
      totalPrice:0,
      addBookForm: {
        tablenumber: "",
        peoplenum: 1,
        userid: "",
        food_id: "",
        food_name: "",
        food_price: "",
        food_num: ""
      },
      addBookFormRules: {
        peoplenum: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        tablenumber: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        userid: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        food_id: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        food_price: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        food_num: [
          {
            required: true,
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
              this.totalPrice += table[i].food_num*table[i].food_price ;
            }
            console.log(res);
        });
      this.$message.success("已取得订单列表");
    },
    confirm()
    {
//        for(var i=index;i<this.total&& i<index+5;i++){
//              this.$axios.get("https://cdn.guoshaocong.cn/getorderinfo",{
//          }).then((res) =>  {
//            var table = res.data.result;
            
//        });
//            }
        this.$message.success("开单成功！");
    },
    send()
    {
        this.$message.success("已发送给顾客！");
    },
    cancel()
    {
        this.$message.success("已取消订单！");
        this.$router.push({ path:'/Home/Order'})
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
    modifyState(tablenumber,userid,food_price) {
      this.$axios
            .post("https://cdn.guoshaocong.cn/addbill", {
              tablenumber: tablenumber,
              username:userid,
              amounttotal:food_price
            })
            .then(response => {
              if (response.data.state == 200) {
                this.$message.success("签单成功");
                this.modifyLoading = false;
              } 
            })
            .catch(function(error) {
              console.log(error);
            });
    },
    deleteOrder(theorder_id)
    {
       this.$axios
            .post("https://cdn.guoshaocong.cn/deleteorder", {
              order_id: theorder_id
            })
            .then(response => {
              if (response.data.state == 200) {
                this.$message.success("订单已取消");
                this.modifyLoading = false;
              } 
            })
            .catch(function(error) {
              console.log(error);
            });
            this.$message.success("已取得订单列表");
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
        this.$axios.post("https://cdn.guoshaocong.cn/addorder",{
                  customer_name: this.addBookForm.customer_name,
                  food_id: this.addBookForm.food_id,
                  food_name: this.addBookForm.food_name,
                  food_num: this.addBookForm.food_num,
                }).then((res) => {
                  console.log(res);
               });
        this.$message.success("Add an Order successfully");
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
.btns {
  display: flex;
  margin-top: 20px;
  padding-right: 35px;
  justify-content: flex-end;
  margin-bottom: 40px;
}
</style>


