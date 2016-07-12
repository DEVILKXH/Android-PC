package com.fzu.useBean;

public class Filename {

	private static String filename;
	private static String filepath;

	public static String getFilepath() {
		return filepath;
	}

	public static void setFilepath(String filepath) {
		Filename.filepath = filepath;
	}


	public static String getFilename() {
		return filename;
	}

	public static void setFilename(String filename) {
		Filename.filename = filename;
	}


}
