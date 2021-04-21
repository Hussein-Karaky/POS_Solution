using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace BLL.Tutor
{
    public class Tutor : User
    {
        public Tutor() : base(EntityType.Tutor) { }
        public Tutor(SqlDataReader reader, string prefix = null) : base(EntityType.Tutor, reader, prefix) { }
        public long Id { get; set; }
        public string LegalFN { get; set; }
        public string LegalLN { get; set; }
        public string PrivateEmail { get; set; }
        public string Title { get; set; }
        public string FreeResponse { get; set; }
        public char Visible { get; set; }
        public Currency Currency { get; set; }
        public int CancellationNotice { get; set; }
        public bool ReadyForInterview { get; set; }
        public int TaughtHours { get; set; }
        public DateTime? Datestamp { get; set; }
        public DateTime? DateAgreed { get; set; }
        public IList<TutorEducation> Education = new List<TutorEducation>();
        public IList<Material> Materials = new List<Material>();
        public IList<TutorPreferences> Preferences = new List<TutorPreferences>();

        public int TypeOfDegrees { get; set; }
        public int Recognition { get; set; }
        public bool RegStepsCompleted { get; set; }
        public override void Set(SqlDataReader reader, string prefix = null)
        {
            base.Set(reader);
            Id = Convert.ToInt64(reader["Id"]);
            Title = reader["Title"] != DBNull.Value ? reader["Title"].ToString() : null;
            FreeResponse = reader["FreeResponse"] != DBNull.Value ? reader["FreeResponse"].ToString() : null;
            LegalFN = reader["LegalFN"] != DBNull.Value ? reader["LegalFN"].ToString() : null;
            LegalLN = reader["LegalLN"] != DBNull.Value ? reader["LegalLN"].ToString() : null;
            PrivateEmail = reader["PrivateEmail"] != DBNull.Value ? reader["PrivateEmail"].ToString() : null;
            CancellationNotice = reader["CancellationNotice"] != DBNull.Value ? Convert.ToInt32(reader["CancellationNotice"]) : 0;
            FreeResponse = reader["FreeResponse"] != DBNull.Value ? reader["FreeResponse"].ToString() : null;
            DateAgreed = reader["DateAgreed"] != DBNull.Value ? Convert.ToDateTime(reader["DateAgreed"]) : default(DateTime?);
            ReadyForInterview = Convert.ToBoolean(reader["ReadyForInterview"]);
            TaughtHours = Convert.ToInt32(reader["TutoringHours"]);
        }

        public override UserCache Cache(UserCache cache = null)
        {
            TutorCache tutorCache = new TutorCache
            {
                Id = this.Id,
                LegalFN = this.LegalFN,
                LegalLN = this.LegalLN,
                PrivateEmail = this.PrivateEmail
            };

            return base.Cache(tutorCache);
        }
    }
}
