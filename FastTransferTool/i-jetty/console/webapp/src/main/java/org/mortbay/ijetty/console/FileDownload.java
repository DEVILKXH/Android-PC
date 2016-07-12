package org.mortbay.ijetty.console;

import com.fzu.utils.FileUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FileDownload extends HttpServlet {

    private String filepath;
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        String filename = request.getParameter("filename");
        String type = request.getParameter("type");
        filepath = request.getParameter("filepath");
        if(filepath == null){
            filepath = "";
        }
        doDownload(filename,type,request,response);
    }

    public void doDownload(String filename,String type,HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setCharacterEncoding("utf-8");
        FileUtils fu = new FileUtils();
        File file = fu.getFile(filepath + filename);
        if(file.exists()){
            //设置相应类型application/octet-stream
            response.setContentType("application/octec-stream");
            //设置头信息
            response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(filename, "UTF-8") + "");
            response.setHeader("Content-Length",file.length() + "");
            InputStream inputStream = new FileInputStream(file);
            ServletOutputStream ouputStream = response.getOutputStream();
            byte b[] = new byte[1024];
            int n ;
            while((n = inputStream.read(b)) != -1){
                ouputStream.write(b,0,n);
            }
            //关闭流、释放资源
            ouputStream.close();
            inputStream.close();

            if(type.equals("2")){
                file.delete();
            }
        }else{
            System.out.println("error");
        }
    }

}
