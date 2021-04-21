using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Tutor.TutorDashboard
{
    public class BoardItem
    {
        public long  Id { get; set; }
        public string Type { get; set; }
        public string Data { get; set; }
        public string DataTitle { get; set; }
        public string  icon { get; set; }
        public string link { get; set; }
    }
}
