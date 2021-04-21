using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Test
{
    public class Question
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int CatId { get; set; }
        public int FieldTypeId { get; set; }
        public string FieldTypeName { get; set; }
        public int DisplayId { get; set; }
        public string DisplayName { get; set; }
        public float Points { get; set; }
        public IList<Answer> answer = new List<Answer>();
    }
}
