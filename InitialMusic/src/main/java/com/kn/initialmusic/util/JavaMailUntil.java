package com.kn.initialmusic.util;


import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import java.util.Properties;

public final class JavaMailUntil {
    private JavaMailUntil() {
    }

    public static Session createSession() {

        //	账号信息
        String username = "2254990841@qq.com";//	邮箱发送账号
        String password = "oyakttnzplztdiba";//	邮箱授权码

        //	创建一个配置文件，并保存
        Properties props = new Properties();

        //	SMTP服务器连接信息
        //  126——smtp.126.com
        //  163——smtp.163.com
        //  qq——smtp.qq.com"
        props.put("mail.smtp.host", "smtp.qq.com");//	SMTP主机名

        //  126——25
        //  163——645
        props.put("mail.smtp.port", "25");//	主机端口号
        props.put("mail.smtp.auth", "true");//	是否需要用户认证
        props.put("mail.smtp.starttls.enale", "true");//	启用TlS加密

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        //  控制台打印调试信息
        session.setDebug(true);
        return session;

    }
}
