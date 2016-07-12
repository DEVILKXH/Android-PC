package org.mortbay.ijetty.console;

import com.fzu.utils.FileUtils;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FileDirectory extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request, response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setCharacterEncoding("utf-8");
        PrintWriter out = response.getWriter();
        String Directory = request.getParameter("directory");
        String Json = "";
        FileUtils fu = new FileUtils();

        fu.createFolder();
        File directory;
        if(Directory != null){
            directory = fu.getFile(Directory);
        }else{
            directory = fu.getFile("null");
        }
        File[] files = directory.listFiles();
        Json = fu.getFilesInfo(files);
        out.print(Json);
    }
}

