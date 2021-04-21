using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared
{
    public class AppContent
    {
        public int Id { get; set; }
        public string ContentKey { get; set; }
        public int TypeId { get; set; }
        public char translatable { get; set; }
        public int LangId { get; set; }
        public string DisplayContent { get; set; }

    }
}
