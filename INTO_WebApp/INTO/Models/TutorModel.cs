using BLL.Shared;
using BLL.Test;
using BLL.Tutor;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace INTO.Models
{
    public class TutorModel : LoginModel
    {
        public TutorModel()
        {
            TypeOfDegrees = new List<LookUpDetails>();
            Recognition = new List<LookUpDetails>();
            Countries = new List<LookUpDetails>();
            TutoringTypes = new List<LookUpDetails>();
            LessonTypes = new List<LookUpDetails>();
            RewardingPoints = new List<LookUpDetails>();
            InstituteTypes = new List<LookUpDetails>();
            Cycles = new List<LookUpDetails>();
            Curriculums = new List<LookUpDetails>();
        }
        //public Tutor Tutor { get; set; }
        public IList<LookUpDetails> TypeOfDegrees { get; set; }
        public IList<LookUpDetails> Recognition { get; set; }
        public IList<LookUpDetails> Countries { get; set; }
        public IList<LookUpDetails> TutoringTypes { get; set; }
        public IList<LookUpDetails> InstituteTypes { get; set; }
        public IList<LookUpDetails> Cycles { get; set; }
        public IList<LookUpDetails> Curriculums { get; set; }
        public IList<LookUpDetails> LessonTypes { get; set; }
        public IList<LookUpDetails> RewardingPoints { get; set; }
        public IList<LookUpDetails> contentStep5 { get; set; }
        public IList<LookUpDetails> contentStep4 { get; set; }
        public IList<LookUpDetails> contentStep6 { get; set; }
        public IList<LookUpDetails> contentStep2 { get; set; }
        public IList<LookUpDetails> Preferences { get; set; }
        public Test test { get; set; }
        public IList<Question> question = new List<Question>();
        public string serializedTest { get; set; }

        public DateTime todaysDate = DateTime.Now.Date;
        [JsonIgnore]
        public Tutor Tutor { get { return User != null && User.Type == EntityType.Tutor ? (Tutor)User : null; } set { User = value; } }
    }
}


