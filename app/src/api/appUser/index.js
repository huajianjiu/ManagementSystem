// app用户接口
import request from "@/utils/request";

// 获取用户数据
export const reqUserList=(data)=>request({url:"/appUser/userList",method:'get',params:data})

// 添加|修改用户
export const reqAddOrUpdateUser=(data)=>request({url:"/appUser/addOrUpdateUserInfo",method:'post',data});

// 解封|封禁用户
export const reqbanOrLetOfUser=(data)=>request({url:"/appUser/banOrLetOfUser",method:'put',data});
