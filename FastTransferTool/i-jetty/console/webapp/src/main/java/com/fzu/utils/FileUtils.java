package com.fzu.utils;

import android.content.*;
import java.text.DecimalFormat;
import android.os.Environment;

import java.io.*;
import java.util.List;
import java.util.ArrayList;

import android.database.Cursor;
import android.provider.MediaStore;

/**
 * Created by Devil on 2016/5/13.
 */
public class FileUtils {


    private String path;
    private File externalDir;
    private File sdcarddir;
    private List<File> classifyfile;

    public File getExternalDir() {
        return externalDir;
    }

    public void setExternalDir(File externalDir) {
        this.externalDir = externalDir;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public FileUtils(){
        externalDir = Environment.getExternalStorageDirectory();
        sdcarddir = new File(externalDir,"/");
    }
    public void createFolder(){
        // Create file upload directory if it doesn't exist
        if (!sdcarddir.exists()) {
            sdcarddir.mkdir();
        }
    }

    public File getFile(String filename){
        if(filename.equals("null")){
            return sdcarddir;
        }else {
            File file = new File(externalDir,"/"+filename);
            return file;
        }
    }

    public String getFolderInfo(File []folderlist){
        String Json = "{\"files\":[" ;

        for(File folder: folderlist){
            if(folder.isDirectory()){
                Json = Json + "{\"itemName\":" + "\""+folder.getName() + "\",";

                String hasChild = hasChild(folder.listFiles());

                if(folder.listFiles().length == 0){
                    Json = Json + "\"itemChild\":" + "\""+ hasChild+"\"},";
                }else{
                    Json = Json + "\"itemChild\":" + "\""+ hasChild +"\"},";
                }
            }
        }

        int index = Json.lastIndexOf(",");
        if(index > 0){
            Json = Json.substring(0,index);
        }
        Json +="]}";
        return Json;
    }


    public String hasChild(File []files){
        String hasChild = "1";
        for(File file: files){
            if(file.isDirectory()){
                hasChild = "0";
                break;
            }
        }
        return hasChild;
    }



    public String getFilesInfo(File []files){
        String Json = "{\"files\":[";
        for(File file:files){
            String size = "-";
            if(file.isDirectory()){
                Json = Json + "{\"itemType\":" + "\"folder\",";
            }else{
                Json = Json + "{\"itemType\":" + "\"file\",";
                size = doSize(file);
            }
            Json = Json + "\"itemTime\":\""+file.lastModified() + "\",";
            Json = Json + "\"itemName\":\"" + file.getName() + "\",";
            Json = Json + "\"itemSize\":\"" + size;
            Json += "\"},";
        }

        int index = Json.lastIndexOf(",");
        if(index > 0){
            Json = Json.substring(0,index);
        }
        Json +="]}";
        return Json;
    }

    public String getFilesClassifyInfo(){
        String Json = "{\"files\":[";
        for(File file:classifyfile){
            String mypath = file.getAbsolutePath().split("上传的文件")[1];
            String path = mypath.replaceAll("\\\\", "/");
            int index = path.lastIndexOf("/");
            path = path.substring(1,index+1);
            String size = "-";
            Json = Json + "{\"itemType\":" + "\"file\",";
            size = doSize(file);
            Json = Json + "\"itemTime\":\""+file.lastModified() + "\",";
            Json = Json + "\"itemName\":\"" + file.getName() + "\",";
            Json = Json + "\"itemSize\":\"" + size;
            Json += "\"},";
        }
        int index = Json.lastIndexOf(",");
        if(index > 0){
            Json = Json.substring(0,index);
        }
        Json +="]}";
        return Json;
    }

    public String doSize(File file){
        double length = 0;
        if(file.isDirectory()){
            length = getLength(file,length);
        }else{
            length = file.length();
        }
        int i = 0;
        while(length > 1024){
            i++;
            length /= 1024;
            //length = (double) Math.ceil(length);
        }
        if (length > 1000){
            length /= 1024;
            i++;
        }
        String size = "";
        DecimalFormat df = new DecimalFormat("##.00");
        size = df.format(length);
        int index = size.indexOf(".");
        if(index == 0){
            size = "0"+size;
        }
        switch(i){
            case 0:
                size = "1 KB";
                break;
            case 1:
                size = size +  " KB";
                break;
            case 2:
                size = size + " MB";
                break;
            case 3:
                size = size + " GB";
                break;
        }
        return size;
    }

    public double getLength(File files,double length){
        File []filelist = files.listFiles();
        for(File file:filelist){
            if(file.isDirectory()){
                length = getLength(file, length);
            }else{
                length += file.length();
            }
        }
        return length;
    };
}
