<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input v-model="searchObj.roleName" style="width: 100%" placeholder="角色名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button> -->
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysRole.add')  === false">添 加</el-button>


      <el-button class="btn-add" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%;margin-top: 10px;"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称"/>
      <el-table-column prop="roleCode" label="角色编码"/>
      <el-table-column prop="createTime" label="创建时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除"
                     @click="removeDataById(scope.row.id)"/>
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)"
                     title="分配权限"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination :current-page="page" :total="total" :page-size="limit" style="padding: 30px 0; text-align: center"
                   layout="total, prev, pager, next, jumper" @current-change="fetchData"/>
    <!-- 添加或修改的表单 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import api from '@/api/system/sysRole'

const defaultForm = {
  id: '',
  roleName: '',
  roleCode: ''
}
export default {
  // 定义数据模型
  data() {
    return {
      list: [], // 角色列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 3, // 每页记录数
      searchObj: {}, // 查询条件
      sysRole: defaultForm,
      saveBtnDisabled: false,
      dialogVisible: false,
      multipleSelection: []// 批量删除选中的记录列表
    }
  },
  // 页面渲染成功后获取数据
  created() {
    this.fetchData()
  },
  // 定义方法
  methods: {
    // 重置表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.fetchData()
    },
    fetchData(pageNum = 1) {
      this.page = pageNum
      // 调用api
      api
        .getPageList(this.page, this.limit, this.searchObj)
        .then((response) => {
          debugger
          this.listLoading = false
          this.list = response.data.records
          this.total = response.data.total
        })
    },
    //编辑
    edit(id) {
      this.dialogVisible = true
      api.getById(id).then(response => {
        this.sysRole = response.data
      })
    },
    //更新
    update() {
      api.updateById(this.sysRole).then(response => {
        this.$message.success(response.message || '操作成功')
        this.fetchData(this.page)
      })
    },
    // 根据id删除数据
    removeDataById(id) {
      // debugger
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // promise
          // 点击确定，远程调用ajax
          return api.removeById(id)
        })
        .then((response) => {
          this.fetchData(this.page)
          this.$message.success(response.message || '删除成功')
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    //弹出添加的表单
    add() {
      this.dialogVisible = true
      this.sysRole = Object.assign({}, defaultForm)
    },
    //添加或更新
    saveOrUpdate() {
      this.dialogVisible = false //隐藏表单
      if (!this.sysRole.id) {
        this.save()
      } else {
        this.update()
      }
    },

    //添加
    save() {
      api.save(this.sysRole).then(response => {
        this.$message.success(response.message || '操作成功')
        this.fetchData(this.page)
      })
    },
    // 当多选选项发生变化的时候调用的函数
    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection
    },
    // 批量删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return api.batchRemove(idList)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    showAssignAuth(row) {
      this.$router.push('/system/assignAuth?id=' + row.id + '&roleName=' + row.roleName);
    }
  }
}
</script>
