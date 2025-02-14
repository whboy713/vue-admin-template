/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/sysRole'

export default {
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`, method: `delete`, data: idList
    })
  },
  //编辑
  edit(id) {
    this.dialogVisible = true
    api.getById(id).then(response => {
      this.sysRole = response.data
    })
  },
  // 更新
  update() {
    api.updateById(this.sysRole).then(response => {
      this.$message.success(response.message || '操作成功')
      this.fetchData(this.page)
    })
  },
  // 编辑
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`, method: 'get'
    })
  },

  // 更新
  updateById(role) {
    return request({
      url: `${api_name}/update`, method: 'put', data: role
    })
  }, save(role) {
    return request({
      url: `${api_name}/save`, method: 'post', data: role
    })
  }, removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`, method: 'delete'
    })
  },

  // 获取角色分页列表(带搜索)
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`, method: 'get', params: searchObj
    })
  },
  //根据用户id查询用户已分配的角色
  getRolesByUserId(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`, method: 'get'
    })
  },

  // 分配角色
  assignRoles(assginRoleVo) {
    return request({
      url: `${api_name}/doAssign`, method: 'post', data: assginRoleVo
    })
  }
}
