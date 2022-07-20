/*
  For Folder ID, go to the folder in which you have the files saved in Google Drive
  Look at URL, and at the end of the URL, there should be a long combination of
  numbers and letters follower(ex. https://drive.google.com/drive/u/2/folders/1AIcg-ZqrvsKvSmYDHW1r9u17RCKJ2k9O, what comes after folders is the ID)
  Copy that ID into the given areas as a String(with quotes).
  Files must be in a folder
  */
function runOCR() {
  var files = DriveApp.getFolderById(/* Insert Folder ID */).getFiles(); // get the folder containing all of the files
  var rootFolder = DriveApp.getFolderById(/* Insert Folder ID */);
  var newFolder = rootFolder.createFolder("Text Files"); // create a folder to store the text images
  
  while(files.hasNext()) { // while there are files in the folder, convert them from images to text files
    var curFile = files.next()
    var imageBlob = curFile.getBlob();
    var resource = {
      title :imageBlob.getName(),
      mimeType : imageBlob.getContentType()
    }

    var options = {
      ocr : true
    }
    var docFile = Drive.Files.insert(resource, imageBlob, options); 
    var doc = DocumentApp.openById(docFile.id);
    var text = doc.getBody().getText().replace("\n", "");
    var newDoc = DocumentApp.create(curFile);
    var docToDrive = DriveApp.getFileById(newDoc.getId()); // create the document
    newDoc.getBody().setText(text); // set the text of the document
    newFolder.addFile(docToDrive); // add it to the folder
    Drive.Files.remove(docFile.id);
  }
}
