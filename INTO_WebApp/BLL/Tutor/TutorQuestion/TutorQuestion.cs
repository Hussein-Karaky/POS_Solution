using System;
using System.Collections.Generic;
using System.Text;
using BLL.Shared;
namespace BLL.Tutor.TutorQuestion
{
    public class TutorQuestion
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IList<Tags> tags { get; set; }
        public bool Status { get; set; }
        public DateTime PostTime { get; set; }
        public long TutorId { get; set; }
        public long ImageId { get; set; }
        public bool Answered { get; set; }
        public bool IsFollowing { get; set; }
        public bool Followed { get; set; }
        public IList<TQuestionAnswer> tQuestionAnswers { get; set; }
        public IList<TQuestionComment> tQuestionComments { get; set; }
        public int FollowsNumber { get; set; }
        public int AnswersNumber { get; set; }
        public int CommentsNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserImg { get; set; }
        public bool ClosedVisible { get; set; }

    }
}
