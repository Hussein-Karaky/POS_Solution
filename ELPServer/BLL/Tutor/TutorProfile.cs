using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Tutor
{
    public class TutorProfile:User
    {
        public TutorProfile():base(EntityType.Tutor) { }
        public long Id { set; get; }
        public string LegalFirstName { set; get; }
        public string LegalLastName { set; get; }
        public string PrivateEmail { set; get; }
        public bool? Gender { set; get; }
        public DateTime? DOB { set; get; }
        public string Title { set; get; }
        public bool? Visible { set; get; }
        public Byte[] Photo { set; get; }
        public decimal InPersonHourRate { set; get; }
        public Currency InPersonCurId { set; get; }
        public decimal OnlineHourRate { set; get; }
        public Currency OnlineCurId { set; get; }
        public int CancellationPolicyId { set; get; }
        public string RateDetails { set; get; }
        public DateTime Datestamp { set; get; }
        public string TeachingCertification { set; get; }
        public string Personal { set; get; }
        public IList<Education> Educations {set; get;}
    }
}
