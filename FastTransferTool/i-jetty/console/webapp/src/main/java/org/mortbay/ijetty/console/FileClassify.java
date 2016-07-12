package org.mortbay.ijetty.console;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;;
import android.content.ContentResolver;
import android.content.Context;
import com.fzu.utils.FileUtils;
/**
 * Created by Devil on 2016/5/25.
 */
public class FileClassify extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        String type = request.getParameter("filetype");
        FileUtils fu = new FileUtils();
        File directory = fu.getFile("null");
        ContentResolver resolver = (ContentResolver)getServletContext().getAttribute("org.mortbay.ijetty.contentResolver");
        Context context = (Context)getServletContext().getAttribute("org.mortbay.ijetty.context");
        //String json = fu.getFileClassify(type,directory,context);
       // response.getWriter().println(json);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}
