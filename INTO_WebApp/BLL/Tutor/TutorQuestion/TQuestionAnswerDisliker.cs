using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Tutor.TutorQuestion
{
    public class TQuestionAnswerDisliker
    {
        public long Id { get; set; }
        public long TQuestionAnswerId { get; set; }
        public long UID { get; set; }
        public long ObjEntityId { get; set; }
         public string FirstName  { get; set; }
        public string LastName  { get; set; }
        public string UserImg  { get; set; }
    }
}
