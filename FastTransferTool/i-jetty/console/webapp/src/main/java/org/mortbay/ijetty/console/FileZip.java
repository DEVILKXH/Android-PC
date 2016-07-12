package org.mortbay.ijetty.console;

import com.fzu.utils.FileUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.CRC32;
import java.util.zip.CheckedOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FileZip extends HttpServlet {

    private FileOutputStream fos = null;
    private ZipOutputStream zos = null;
    private CheckedOutputStream  cos = null;
    byte[] buffer = new byte[1024];

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request, response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String files = request.getParameter("filename");
        String filepath = request.getParameter("filepath");
        if(filepath == null){
            filepath = "";
        }
        FileUtils fu = new FileUtils();
        File myfiles = fu.getFile(filepath + files);

        if(!myfiles.isDirectory()){
            response.setCharacterEncoding("utf-8");
            RequestDispatcher rd = request.getRequestDispatcher("/rest/filedownload/FileDownload?filepath="+ filepath + "&filename="+ myfiles.getName() +"&type=1");
            rd.forward(request, response);
            return ;
        }

        String zipFileName = files + ".zip";
        File zipFile = fu.getFile(filepath + zipFileName);
        if(!zipFile.exists()){
            zipFile.createNewFile();
        }
        File[] filelist = myfiles.listFiles();

        fos = new FileOutputStream(zipFile);
        cos = new CheckedOutputStream(fos, new CRC32());
        zos = new ZipOutputStream(cos);

        for(int i = 0; i< filelist.length ; i++){
            folderType(filelist[i],myfiles.getName());
        }
        zos.close();
        cos.close();
        fos.close();
        response.setCharacterEncoding("utf-8");
        RequestDispatcher rd = request.getRequestDispatcher("/rest/filedownload/FileDownload?filepath="+ filepath + "&filename="+ zipFileName +"&type=2");
        rd.forward(request, response);
    }

    public void folderType(File file,String filepath){
        filepath = filepath + "/" + file.getName();
        if(file.isDirectory()){
            zipFolder(file,filepath);
        }else{
            zipFile(file,filepath);
        }
    }

    public void zipFolder(File files,String filepath){
        File []filelist = files.listFiles();
        for(File file:filelist){
            folderType(file,filepath);
        }
    }

    public void zipFile(File file,String filepath){
        if(!file.exists()){
            return ;
        }
        ZipEntry entry = null;
        FileInputStream fis = null;
        try{
            entry = new ZipEntry(filepath);
            fis = new FileInputStream(file);

            zos.putNextEntry(entry);
            int read = 0;
            while((read = fis.read(buffer)) != -1){
                zos.write(buffer, 0 ,read);
            }
            zos.closeEntry();
            fis.close();
        }catch (Exception e){
        }
    }
}


