using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace BLL.Test
{
    public class Test
    {
        public int Id { get; set; }
        public string  Description { get; set; }
        public string Material { get; set; }
        public long ObjEntityId { get; set; }
        public double TimeFrame { get; set; }
        public int TotalToPass { get; set; }
        public IList<Question> question = new List<Question>();
    }
}
