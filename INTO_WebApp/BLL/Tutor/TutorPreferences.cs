using BLL.Shared;
using System;
using System.Data.SqlClient;

namespace BLL.Tutor
{
    public class TutorPreferences : DataEntity<DataEntityCache<TutorPreferences>, TutorPreferences>
    {
        public TutorPreferences() : base() { }
        public TutorPreferences(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
        public long Id { get; set; }
        public long? TutorId { get; set; }
        public char Relationship { get; set; }
        public char FindStudents { get; set; }
        public char PaymentMethod { get; set; }
        public char ImportantRules { get; set; }
        public char Confirmation { get; set; }
        public char TermsConditions { get; set; }
        public bool IsTeacher { get; set; }
        public string TeachingInstitute { get; set; }
        public bool HasCertification { get; set; }
        public int YearsOfExperience { get; set; }
        public string TutoringTypes { get; set; }
        public string LessonTypes { get; set; }
        public string RewardingPoints { get; set; }
        public bool HasCar { get; set; }
        public bool IsInterested { get; set; }
        public int OutsideTutoringWeekHrs { get; set; }
        public int Language { get; set; }
        public int StepId { get; set; }
        public EntityType EntityType { get; set; }
        public override DataEntityCache<TutorPreferences> Cache(DataEntityCache<TutorPreferences> cache = null)
        {
            throw new NotImplementedException();
        }

        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr, prefix);
            this.Id = Convert.ToInt64(rdr["Id"]);
            this.TutorId = rdr["TutorId"] != DBNull.Value ? Convert.ToInt64(rdr["TutorId"]) : default(long?);
            this.IsTeacher = Convert.ToBoolean(rdr["IsTeacher"]);
            this.TeachingInstitute = rdr["TeachingInstitute"] != DBNull.Value ? rdr["TeachingInstitute"].ToString() : null;
            this.HasCertification = Convert.ToBoolean(rdr["HasCertification"]);
            this.YearsOfExperience = Convert.ToByte(rdr["YearsOfExperience"]);
            this.TutoringTypes = rdr["TutoringTypes"] != DBNull.Value ? rdr["TutoringTypes"].ToString() : null;
            this.LessonTypes = rdr["LessonTypes"] != DBNull.Value ? rdr["LessonTypes"].ToString() : null;
            this.RewardingPoints = rdr["RewardingPoints"] != DBNull.Value ? rdr["RewardingPoints"].ToString() : null;
            this.HasCar = Convert.ToBoolean(rdr["HasCar"]);
            this.IsInterested = Convert.ToBoolean(rdr["IsInterested"]);
            this.OutsideTutoringWeekHrs = Convert.ToByte(rdr["OutsideTutoringWeekHrs"]);
        }
    }
}
