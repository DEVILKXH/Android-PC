package org.mortbay.ijetty.console;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fzu.useBean.Filename;
import com.fzu.utils.FileUtils;

import com.fzu.useBean.ProrassBar;

public class FileUpload extends HttpServlet {

    private long startposition;
    private long endposition;
    private String filename;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request, response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        String filename = Filename.getFilename();
        String filepath = Filename.getFilepath();

        //设置保存上传文件的路径
        FileUtils fu = new FileUtils();
        fu.createFolder();

        InputStream in = request.getInputStream();

        File tempfile ;
        if(filepath != null){
            tempfile = fu.getFile(filepath + filename);
        }else{
            tempfile= fu.getFile(filename);
        }

        byte[] b = new byte[1024];
        int len = 0;
        int i = 1;
        FileOutputStream fos = new FileOutputStream(tempfile);
        while((len = in.read(b)) !=-1 ){
            ProrassBar.setLength(1024*i++);
            fos.write(b,0,len);
        }
        in.close();
        fos.close();
    }
}
