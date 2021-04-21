using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BLL;
using BLL.Shared;
using BLL.Shared.Struct;
using DAL.Shared;
using INTO.Controllers.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using static BLL.Shared.File;
using FileType = BLL.Shared.File;

namespace INTO.Controllers
{
    [DisableRequestSizeLimit]
    public class FilesController : SecureController<FilesController>
    {
        public FilesController(IConfiguration configuration, IWebHostEnvironment env) : base(configuration)
        {
            _hostingEnvironment = env;
        }
        //private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IWebHostEnvironment _hostingEnvironment;
        //public FilesController(IHostingEnvironment env)
        //{
        //    _hostingEnvironment = env;
        //}
        public IActionResult Index(int userId, int sourceType, int lang = 1)
        {
            DataList<FileType> files = FileDB.GetFiles(userId, sourceType, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return Json(files);
        }
        public IActionResult Delete(long id, int sourceType, long userId, int lang = 1)
        {
            return Json(FileDB.DeleteFile(id, sourceType, userId, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION)));
        }

        [HttpPost]
        public async Task<IActionResult> FileUpload(List<IFormFile> files, long userId, int sourceType, int lang = 1)
        {
            //long userId = 0;
            //int lang = 1;
            long size = files.Sum(f => f.Length);

            //var filePaths = new List<string>();
            IList<FileType> managedFiles = new List<FileType>();
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    // full path to file in temp location
                    var filePath = Path.GetTempFileName(); //we are using Temp file name just for the example. Add your own file path.
                    //filePaths.Add(filePath);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream).ContinueWith(t => {
                            if (t.IsCompletedSuccessfully) {
                                managedFiles.Add(new FileType
                                {
                                    UserId = userId,
                                    Name = formFile.FileName,
                                    Path = filePath, 
                                    Size = formFile.Length, 
                                    SourceType = (FileSourceType)sourceType, 
                                    Type = formFile.ContentType
                                });
                            }
                        });
                    }
                }
            }
            FileDB.AddFiles(managedFiles, sourceType, userId, lang, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            //ViewBag.Message = "Files uploaded";
            // process uploaded files
            // Don't rely on or trust the FileName property without validation.
            return Ok(new { count = files.Count, size, managedFiles });
        }

        [HttpPost(Name = nameof(UploadTutorQuestImgs))]
        public async Task<IActionResult> UploadTutorQuestImgs(List<IFormFile> images)
        {

            var task = await Task.FromResult(UploadImages(images, "TutorQuestionImages"));
            return Json(task);
        }

        public IActionResult FileRead(int id, int lang = 1)
        {
            FileStream stream = null;
            //string str = "Persist Security Info=False;User ID=sa;Initial Catalog=INTODB;Data Source=192.168.100.63";
            //string str = "Persist Security Info=False;User ID=sa;Initial Catalog=INTODB;Data Source=TOSHIBA";
            var files = FileDB.GetFile(id, lang = 1, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            var file = files.Data.First();

            if (System.IO.File.Exists(file.Path))
            {
                stream = new FileStream(file.Path, FileMode.Open);
                byte[] m_Bytes = ReadToEnd(stream);
                string pdfBase64 = Convert.ToBase64String(m_Bytes);
                stream.Close();
                int dot = file.Name.LastIndexOf(".");
                int length = file.Name.Length - dot;
                string type = file.Name.Substring(dot + 1, length - 1);
                FileSetting opFile = new FileSetting();
                opFile.Base64 = pdfBase64;
                opFile.TypeOfFile = type;
                return Json(opFile);
            }
            return Json("File Not found");
        }
        public static byte[] ReadToEnd(System.IO.Stream stream)
        {
            long originalPosition = 0;

            if (stream.CanSeek)
            {
                originalPosition = stream.Position;
                stream.Position = 0;
            }

            try
            {
                byte[] readBuffer = new byte[4096];

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = stream.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                if (stream.CanSeek)
                {
                    stream.Position = originalPosition;
                }
            }
        }

        private async Task<IActionResult> UploadImages(IList<IFormFile> Images, string FolderPath)
        {
            List<string> ImagesUrl = new List<string>();
            string[] imageExtensions = { "image/png", "image/jpg", "image/jpeg", "image/gif", "image/x-png", "image/png", "image/bmp" };
            foreach (IFormFile Image in Images)
            {
                if (imageExtensions.Contains(Image.ContentType))
                {
                    if (Image != null && Image.Length > 0)
                    {
                        var file = Image;
                        //There is an error here
                        var uploads = Path.Combine(_hostingEnvironment.WebRootPath, FolderPath);
                        if (file.Length > 0)
                        {
                            var fileName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(file.FileName);
                            using (var fileStream = new FileStream(Path.Combine(uploads, fileName), FileMode.Create))
                            {
                                await file.CopyToAsync(fileStream);
                                string filePath = FolderPath + fileName;
                                string baseUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                                //return Redirect(Path.Combine(baseUrl, filePath));
                                string path = Path.Combine(baseUrl, filePath);
                                path = path.Replace("\\", "/");
                                //path = $"<img src='{path}' class='img img-responsive'/>";
                                ImagesUrl.Add(path);
                            }
                        }
                    }
                }
            }
            return Json(ImagesUrl);
        }

        private async Task<IActionResult> UploadVideos(IList<IFormFile> Videos, string FolderPath)
        {
            List<string> VideoUrl = new List<string>();
            string[] videoExtensions =
            {
                "VIDEO/WEBM","VIDEO/MPG","VIDEO/MP2","VIDEO/MPEG","VIDEO/MPV","VIDEO/OGG",
                "VIDEO/MP4","VIDEO/M4P","VIDEO/M4V","VIDEO/AVI","VIDEO/WMV","VIDEO/MOV","VIDEO/QT",
                "VIDEO/FLV","VIDEO/SWF","VIDEO/AVCHD"
            };

            foreach (IFormFile video in Videos)
            {
                if (videoExtensions.Contains(video.ContentType.ToUpper()))
                {
                    if (video != null && video.Length > 0)
                    {
                        var file = video;
                        var uploads = Path.Combine(_hostingEnvironment.WebRootPath, FolderPath);
                        if (file.Length > 0)
                        {
                            var fileName = Guid.NewGuid().ToString().Replace("-", "") + Path.GetExtension(file.FileName);
                            using (var fileStream = new FileStream(Path.Combine(uploads, fileName), FileMode.Create))
                            {
                                await file.CopyToAsync(fileStream);
                                string filePath = FolderPath + fileName;
                                string baseUrl = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                                string path = Path.Combine(baseUrl, filePath);
                                path = path.Replace("\\", "/");
                                VideoUrl.Add(path);
                            }
                        }
                    }
                }
            }
            return Json(VideoUrl);
        }


        [HttpPost(Name = nameof(UploadFiles))]
        [Produces("application/json")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files)
        {
            // Get the file from the POST request
            var theFile = HttpContext.Request.Form.Files.GetFile("file");


            // Get the server path, wwwroot
            string webRootPath = _hostingEnvironment.WebRootPath;

            // Building the path to the uploads directory
            var fileRoute = Path.Combine(webRootPath, "TutorQuestionImages");

            // Get the mime type
            var mimeType = HttpContext.Request.Form.Files.GetFile("file").ContentType;

            // Get File Extension
            string extension = System.IO.Path.GetExtension(theFile.FileName);

            // Generate Random name.
            string name = Guid.NewGuid().ToString().Substring(0, 8) + extension;

            // Build the full path inclunding the file name
            string link = Path.Combine(fileRoute, name);

            // Create directory if it does not exist.
            FileInfo dir = new FileInfo(fileRoute);
            dir.Directory.Create();

            // Basic validation on mime types and file extension
            string[] imageMimetypes = { "image/gif", "image/jpeg", "image/pjpeg", "image/x-png", "image/png", "image/svg+xml" };
            string[] imageExt = { ".gif", ".jpeg", ".jpg", ".png", ".svg", ".blob" };

            try
            {
                if (Array.IndexOf(imageMimetypes, mimeType) >= 0 && (Array.IndexOf(imageExt, extension) >= 0))
                {
                    // Copy contents to memory stream.
                    Stream stream;
                    stream = new MemoryStream();
                    theFile.CopyTo(stream);
                    stream.Position = 0;
                    String serverPath = link;

                    // Save the file
                    using (FileStream writerFileStream = System.IO.File.Create(serverPath))
                    {
                        await stream.CopyToAsync(writerFileStream);
                        writerFileStream.Dispose();
                    }

                    // Return the file path as json
                    Hashtable imageUrl = new Hashtable();
                    imageUrl.Add("link", "/TutorQuestionImages/" + name);

                    return Json(imageUrl);
                }
                throw new ArgumentException("The image did not pass the validation");
            }

            catch (ArgumentException ex)
            {
                return Json(ex.Message);
            }
        }
    }
}
