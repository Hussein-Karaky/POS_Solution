using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared
{
    public class BackgroundCheck
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string OrigName { get; set; }
        public string Path { get; set; }
        public long Size { get; set; }
        public string Description { get; set; }
        public DateTime DateUploaded { get; set; }
    }
}
