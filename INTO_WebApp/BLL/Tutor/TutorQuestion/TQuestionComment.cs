
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Tutor.TutorQuestion
{
    public class TQuestionComment
    {
        public long Id { get; set; }
        public string Description { get; set; }
        public long TQuestionId { get; set; }
        public long UID { get; set; }
        public long ObjEntityId { get; set; }
        public DateTime CommentTime { get; set; }
         public string FirstName  { get; set; }
        public string LastName  { get; set; }
        public string UserImg { get; set; }


    }
}
