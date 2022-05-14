// 板块api接口
import request from "@/utils/request";

// 获取板块数据
export const reqSectionList=()=>request({url:"/section/sectionList",method:'get'})

// 添加|修改板块数据
export const reqAddOrdUpdateSection=(data)=>request({ url: '/section/addOrUpdateSection',method:"post",data});

// 删除板块
export const reqDeleteSection=(data)=>request({ url: "/section/delSection",method:"delete",data});
