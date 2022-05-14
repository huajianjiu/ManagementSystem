// 公告接口
import request from "@/utils/request";

// 获取板块数据
export const reqAnnouncementList=()=>request({url:"/announcement/announcementList",method:'get'})

// 添加|修改板块数据
export const reqAddOrdUpdateAnnouncement=(data)=>request({ url: '/announcement/addOrUpdateAnnouncement',method:"post",data});

// 删除板块
export const reqDeleteAnnouncement=(data)=>request({ url: "/announcement/delAnnouncement",method:"delete",data});
