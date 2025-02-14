import store from '@/store'

export default function hasBtnPermission(permission) {
  // 得到当前用户的所有按钮权限
  const myBtns = store.getters.buttons
  // 如果指定的功能权限在myBtns中, 返回true ==> 这个按钮就会显示, 否则隐藏
  return myBtns.indexOf(permission) !== -1
}
