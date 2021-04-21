using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Tutor.TutorQuestion
{
   public class TQuestionAnswer
    {
        public long  Id { get; set; }
        public long TQuestionId { get; set; }
        public string Description { get; set; }
        public DateTime PostTime { get; set; }
        public bool Status { get; set; }
        public long UID { get; set; }
        public int ObjEntityId { get; set; }
        public bool isTutor { get; set; }
        public IList<TQuestionAnswerComment> tAnswerComments { get; set; }
        public int AnswerCommentsNumber { get; set; }
        public string FirstName  { get; set; }
        public string LastName  { get; set; }
        public string UserImg  { get; set; }
        public int AnswerLikesNumber  { get; set; }
        public int AnswerDislikesNumber  { get; set; }
        public int Liked { get; set; }


    }
}
