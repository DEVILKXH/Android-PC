package org.mortbay.ijetty.console;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fzu.useBean.ProrassBar;
/**
 * Created by Devil on 2016/5/16.
 */
public class ProgressBar extends HttpServlet {
    private long length;

    public long getLength() {
        return length;
    }


    public void setLength(long length) {
        this.length = length;
    }




    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request, response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        length = ProrassBar.getLength();
        PrintWriter out = response.getWriter();
        out.print(length);
    }
}
