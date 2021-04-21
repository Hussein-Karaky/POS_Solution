using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared
{
    public class UserCache : DataEntityCache<User>
    {
        internal UserCache() { }
        public long Id { get; set; }
        public long UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool Gender { get; set; }
        public DateTime? DOB { get; set; }
        public string SecondaryEmail { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public Language Language { get; set; }
        public bool Active { get; set; }
        public bool? Internal { get; set; }
        public byte Type { get; set; }
        public RegistrationStep CurrentStep { get; set; }
        public bool AgreedOnTerms { get; set; }

        public override User Extract(User user = null)
        {
            if (user == null)
            {
                user = new User();
            }
            user.UserId = this.UserId;
            user.Email = this.Email;
            user.Phone = this.Phone;
            user.Password = this.Password;
            user.FirstName = this.FirstName;
            user.LastName = this.LastName;
            user.Gender = this.Gender;
            user.DOB = this.DOB;
            user.SecondaryEmail = this.SecondaryEmail;
            user.Language = this.Language;
            user.Active = this.Active;
            user.Internal = this.Internal;
            user.JsonType = this.Type;
            user.CurrentStep = this.CurrentStep;
            user.AgreedOnTerms = this.AgreedOnTerms;
            return user;
        }
    }
}
