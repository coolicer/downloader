# Downloader 一个下载中转者

## 你 <---> vps <---> 文件

## 说明
1. 下载完成的文件会通过邮件发送
2. aria2这个库有点问题，需要手动解绑监听事件

## 部署  
你可以使用pm2，或者nohup node index &，本程序依赖arai2，请安装arai2并且把download的目录作为你下载的目录。
