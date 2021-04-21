using BLL.Tutor;
using BLL.Shared;
using System;
using System.Collections.Generic;
using DAL.Tutor;

namespace Into.Models
{
    public class TutorProfileModel
    {
        public TutorProfileModel()
        {
            this.TutorProfile = FetchProfile();
        }
        public TutorProfile TutorProfile { get; set; }
        public IList<LookUpDetails> TypeOfDegrees = new List<LookUpDetails>();
        public IList<LookUpDetails> Recognition = new List<LookUpDetails>();
        public IList<LookUpDetails> Countries = new List<LookUpDetails>();
        public IList<LookUpDetails> TutoringTypes = new List<LookUpDetails>();
        public IList<LookUpDetails> LessonTypes = new List<LookUpDetails>();
        public IList<LookUpDetails> RewardingPoints = new List<LookUpDetails>();
        public IList<AppContent> contentStep5 = new List<AppContent>();
        public IList<AppContent> contentStep4 = new List<AppContent>();
        public IList<AppContent> contentStep6 = new List<AppContent>();
        public IList<AppContent> contentStep2 = new List<AppContent>();
        public IList<AppContent> Questionnaire = new List<AppContent>();
        public DateTime todaysDate = DateTime.Now.Date;
        protected TutorProfile FetchProfile(long id = 1)
        {
            return TutorDB.FetchProfile(id);
        }
    }
}
   

