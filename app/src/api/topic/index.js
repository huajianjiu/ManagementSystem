// 帖子管理api接口
import request from "@/utils/request";

// 查询|搜索帖子列表
export const reqTopicList=(data)=>request({url:"/topic/topicList",method:'get',params:data})

// 通过帖子
export const reqPassTopic=(data)=>request({url:"/topic/passTopic",method:'put',data})

// 删除帖子
export const reqDeleteTopic=(data)=>request({url:"/topic/deleteTopic",method:'delete',data})

// 获取下拉选项
export const reqSelectList=()=>request({url:"/topic/selectList",method:'get'})

// 获取帖子tupian
export const reqImgList=(data)=>request({url:"/topic/imgList",method:'get',params:data});

// 获取评论
export const reqReplyList=(data)=>request({url:"/topic/replyList",method:'get',params:data});

// 删除评论
export const reqDeleteReply=(data)=>request({url:"/topic/deleteReply",method:'delete',data});
