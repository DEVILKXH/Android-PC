package org.mortbay.ijetty.console;

import com.fzu.utils.FileUtils;
import java.io.File;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;

/**
 * Created by Devil on 2016/6/5.
 */
public class SearchFile extends HttpServlet {
    private String filename;
    private File filedown;


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setCharacterEncoding("utf-8");
        request.setCharacterEncoding("utf-8");
        filename = request.getParameter("filename");
        FileUtils fu = new FileUtils();
        File file = fu.getFile("null");
        dogetFile(file,request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }

    protected void  dogetFile(File file,HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
        File[] files = file.listFiles();
        for(File myfile:files){
            if(myfile.isDirectory()){
                dogetFile(myfile,request,response);
            }else{
                if(myfile.getName().equals(filename)){
                    response.setContentType("application/octec-stream");
                    //设置头信息
                    response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(myfile.getName(), "UTF-8") + "");
                    response.setHeader("Content-Length",myfile.length() + "");
                    InputStream inputStream = new FileInputStream(myfile);
                    ServletOutputStream ouputStream = response.getOutputStream();
                    byte b[] = new byte[1024];
                    int n ;
                    while((n = inputStream.read(b)) != -1){
                        ouputStream.write(b,0,n);
                    }
                    //关闭流、释放资源
                    ouputStream.close();
                    inputStream.close();
                    return ;
                }
            }
        }
    }
}
