package org.mortbay.ijetty.console;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fzu.useBean.Filename;
import com.fzu.useBean.ProrassBar;

public class FileName extends HttpServlet {


    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request,response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setCharacterEncoding("utf-8");
        String file = request.getParameter("filename");
        String path = request.getParameter("filepath");

        ProrassBar.setLength(0);
        Filename.setFilename(file);
        Filename.setFilepath(path);
    }
}

