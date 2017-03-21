var nodemailer = require('nodemailer');
var config = require('./config');

function sendMail(content) {
  var smtpTransport = nodemailer.createTransport({
        service: "QQ",
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });
    //邮件选项设置
    var mailOptions = {
        from: config.email.from, // 发件人地址
        to: content['to'], //多个收件人用,分隔
        subject: content['subject'], // 主题
        html: "<div>" + content['html']+"</div>"
    }
    //发送
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent!");
        }
        smtpTransport.close();
    });
}

exports.sendMail = sendMail;