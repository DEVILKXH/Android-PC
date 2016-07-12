package org.mortbay.ijetty.console;
import com.fzu.utils.FileUtils;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.FileInputStream;
import java.io.FileOutputStream;

/**
 * Created by Devil on 2016/5/16.
 */
public class FolderOperation extends HttpServlet {
    private String type;
    private String name;
    private String filepath;

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doPost(request, response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        type = request.getParameter("type");
        name = request.getParameter("filename");
        filepath = request.getParameter("path");
        if(type.equals("createFolder")){
            doFolder(request,response);
        }else if(type.equals("deleteFolder")){
            doDeleteFolder(request,response);
        }else if(type.equals("renameFile")){
            doRenameFile(request,response);
        }else if(type.equals("sourcesFolder")){
            doGetSourcesFolder(request,response);
        }else if(type.equals("cutFile")){
            doCopyFile(request,response,0);
        }else if(type.equals("copyFile")){
            doCopyFile(request,response,1);
        }
    }

    public void  doFolder(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{
        response.setCharacterEncoding("utf-8");

        FileUtils fu = new FileUtils();
        File folder = fu.getFile(filepath + name);
        if(!folder.exists()){
            folder.mkdir();
            response.getWriter().println("success");
        }else{
            response.getWriter().println("文件夹已存在");
        }
    }

    public void  doDeleteFolder(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{
        response.setCharacterEncoding("utf-8");

        FileUtils fu = new FileUtils();

        name = name.substring(0,name.length()-1);
        String []file = name.split(",");

        for(int i = 0; i< file.length; i++){
            String filename = file[i].split(":")[1];
            File myfile = fu.getFile(filepath + filename);
            if(myfile.exists()){
                if(myfile.isDirectory()){
                    deleteFile(myfile);
                }
                myfile.delete();
            }
        }
    }

    public void deleteFile(File folder){
        File[] files = folder.listFiles();
        for(File file:files){
            if(file.isDirectory()){
                deleteFile(file);
            }
            file.delete();
        }
    }

    public void doRenameFile(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{
        response.setCharacterEncoding("utf-8");
        String oldfile = request.getParameter("oldfile");
        String newfile = request.getParameter("newfile");

        FileUtils fu = new FileUtils();
        File oldFile = fu.getFile(filepath + oldfile);
        File newFile = fu.getFile(filepath + newfile);

        if(!oldFile.exists()){
            response.getWriter().print("文件不存在");
            return ;
        }

        if(newFile.exists()){
            response.getWriter().print("存在相同的文件不能重命名");
            return ;
        }
        oldFile.renameTo(newFile);
    }

    public void doGetSourcesFolder(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{
        response.setCharacterEncoding("utf-8");
        FileUtils fu =new FileUtils();
        String folderPath = request.getParameter("path");
        File sourceFolder = fu.getFile(folderPath);
        File []folderlist = sourceFolder.listFiles();
        String json = fu.getFolderInfo(folderlist);
        response.getWriter().print(json);
    }



    public void doCopyFile(HttpServletRequest request, HttpServletResponse response,int copy)
            throws ServletException, IOException{
        response.setCharacterEncoding("utf-8");
        String oldPath = request.getParameter("oldpath");
        String newPath = request.getParameter("newpath");
        String filename = request.getParameter("filename");

        FileUtils fu = new FileUtils();
        File oldFile = fu.getFile(oldPath);
        File newFile = fu.getFile(newPath + "/" + filename);
;

        String mes = "";

        if(oldFile.isDirectory()){
            doCopyDirectory(oldFile,newFile);
        }else{
            mes = copyFile(oldFile,newFile);
        }


        System.out.println(copy);

        if(mes.equals("success")){
            if(copy == 0){
                File delFile = fu.getFile(oldPath);
                if(delFile.isDirectory()){
                    deleteFile(oldFile);
                }else{
                    delFile.delete();
                }
            }
        }
        response.getWriter().print(mes);

    }

    public String copyFile(File oldFile, File newFile) throws IOException{

        if(!oldFile.exists()){
            return "文件不存在";
        }

        if(newFile.exists()){
            return "存在同名文件夹";
        }else{
            newFile.createNewFile();
        }

        FileInputStream fis = new FileInputStream(oldFile);
        FileOutputStream fos = new FileOutputStream(newFile);
        byte[] buffer = new byte[1024];
        int len = 0;
        while((len = fis.read(buffer)) != -1){
            fos.write(buffer, 0, len);
        }
        fos.close();
        fis.close();
        return "success";
    }

    public void doCopyDirectory(File oldFolder,File newFolder) throws IOException{
        if(!newFolder.exists()){
            newFolder.mkdir();
        }
        File []files = oldFolder.listFiles();
        for(File oldFile: files){
            FileUtils fu = new FileUtils();
            File newFile = fu.getFile(newFolder.getPath() + "/" + oldFile.getName());
            if(oldFile.isDirectory()){
                doCopyDirectory(oldFile, newFile);
            }else{
                copyFile(oldFile, newFile);
            }
        }
    }
}
