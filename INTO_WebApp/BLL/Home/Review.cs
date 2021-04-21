using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace BLL.Home
{
    public class Review
    {
        public long UId { set; get; }
        public string FullName { set; get; }
        public string Photo { get; set; }
        public int languageId { get; set; }
        public string review { get; set; }

    }
}