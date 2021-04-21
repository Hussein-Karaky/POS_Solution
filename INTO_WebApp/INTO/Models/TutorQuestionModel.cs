using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BLL.Shared;
using BLL.Tutor.TutorQuestion;
using cloudscribe.Pagination.Models;
namespace INTO.Models
{
    public class TutorQuestionModel: LoginModel
    {
        public IList<LookUpDetails> DDL = new List<LookUpDetails>();
        public TutorQuestion tQuestion { get; set; }
        public IList<TutorQuestion> QuestionAnswered { get; set; }
        public IList<TutorQuestion> QuestionAdded { get; set; }
        public IList<TutorQuestion> QuestionFollowed { get; set; }
        public IList <TutorQuestion> Comments { get; set; }
        public IList<List<TutorQuestion>> all { get; set; }
        public IList<Tags> dataListTags { get; set; }
        public IList<TutorQuestion> allQuestionsByTag { get; set; }
        public IList<Tags> RandomTags { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public PagedResult<TutorQuestion> paging { get; set; }        
    }
}
