using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Student
{
    public class StudentCache : UserCache
    {
        public long? FacebookId { set; get; }
        public long? TwitterId { set; get; }
        public long? GoogleId { set; get; }
        public long? LinkedInId { set; get; }
        public string SchoolName { set; get; }
        public int? SchoolYear { set; get; }
        public string Ambition { set; get; }
        public override User Extract(User user = null)
        {
            Student studentCache = new Student
            {
                Id = this.Id,
                FacebookId = this.FacebookId,
                TwitterId = this.TwitterId,
                GoogleId = this.GoogleId,
                LinkedInId = this.LinkedInId,
                SchoolName = this.SchoolName,
                SchoolYear = this.SchoolYear,
                Ambition = this.Ambition
            };

            return base.Extract(studentCache);
        }
    }
}
