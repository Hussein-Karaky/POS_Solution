using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Tutor
{
    public class TutorCache : UserCache
    {
        public string LegalFN { get; set; }
        public string LegalLN { get; set; }
        public string PrivateEmail { get; set; }
        public override User Extract(User user = null)
        {
            Tutor tutorCache = new Tutor
            {
                Id = this.Id,
                LegalFN = this.LegalFN,
                LegalLN = this.LegalLN,
                PrivateEmail = this.PrivateEmail,
                AgreedOnTerms = this.AgreedOnTerms
            };

            return base.Extract(tutorCache);
        }
    }
}
