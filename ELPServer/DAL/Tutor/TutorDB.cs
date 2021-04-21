using BLL.Tutor;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Tutor
{
    public class TutorDB
    {
        public static TutorProfile FetchProfile(long id)
        {

            return new TutorProfile
            {
                Id = 1,
                LegalFirstName = "Hussein",
                LegalLastName = "Ibrahim"
            };
        }
    }
}
