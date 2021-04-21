using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Test
{
    public class Answer
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public string AnswerDescription { get; set; }
        public bool Correct { get; set; }

    }
}
