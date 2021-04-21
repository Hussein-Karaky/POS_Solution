using BLL.Shared;
using System;
using System.Data.SqlClient;

namespace BLL.Student
{
    public class Student : User
    {
        public Student() : base(EntityType.Student) { }
        public Student(SqlDataReader reader, string prefix = null) : base(EntityType.Student, reader, prefix) { }
        public long Id { set; get; }
        public long? FacebookId { set; get; }
        public long? TwitterId { set; get; }
        public long? GoogleId { set; get; }
        public long? LinkedInId { set; get; }
        public string SchoolName { set; get; }
        public int? SchoolYear { set; get; }
        public bool RegStepsCompleted { get; set; }
        public string Ambition { set; get; }
        public override UserCache Cache(UserCache cache = null)
        {
            StudentCache studentCache = new StudentCache
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

            return base.Cache(studentCache);
        }
        public override void Set(SqlDataReader reader, string prefix = "U")
        {
            base.Set(reader);
            this.Id = Convert.ToInt64(reader["Id"]);
            this.FacebookId = reader["FacebookId"] != DBNull.Value ? Convert.ToInt64(reader["FacebookId"]) : default(long?);
            this.LinkedInId = reader["LinkedInId"] != DBNull.Value ? Convert.ToInt64(reader["LinkedInId"]) : default(long?);
            this.GoogleId = reader["GoogleId"] != DBNull.Value ? Convert.ToInt64(reader["GoogleId"]) : default(long?);
            this.TwitterId = reader["TwitterId"] != DBNull.Value ? Convert.ToInt64(reader["TwitterId"]) : default(long?);
            this.SchoolName = reader["SchoolName"] != DBNull.Value ? reader["SchoolName"].ToString() : null;
            this.SchoolYear = reader["SchoolYear"] != DBNull.Value ? Convert.ToInt32(reader["SchoolYear"]) : default(int?);
            this.Ambition = reader["Ambition"] != DBNull.Value ? reader["Ambition"].ToString() : null;
        }
    }
}