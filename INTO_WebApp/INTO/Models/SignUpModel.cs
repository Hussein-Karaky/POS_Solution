using BLL.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace INTO.Models
{
    public class SignUpModel : LoginModel //TODO: to be changed to basemodel later
    {
        public IList<LookUpDetails> Countries = new List<LookUpDetails>();
        //[DataType(DataType.EmailAddress)]
        //[Required]
        //[MaxLength(100)]
        //public string Email { get; set; }

        [DataType(DataType.Text)]
        [MaxLength(50)]
        [Required]
        public string FirstName { get { return this.User != null ? this.User.FirstName : ""; } set { if (this.User != null) { this.User.FirstName = value; } } }

        [DataType(DataType.Text)]
        [Required]
        [MaxLength(50)]
        public string LastName { get { return this.User != null ? this.User.LastName : ""; } set { if (this.User != null) { this.User.LastName = value; } } }

        //[DataType(DataType.Password)]
        //[Required]
        //[MaxLength(512)]
        //public string Password { get; set; }
        //public int LanguageId { get; set; }
        public int CountryId
        {
            get
            {
                return this.User != null && this.User.LocationSettings.Country != null ? this.User.LocationSettings.Country.Id : 0;
            }
            set { if (this.User != null) { this.User.LocationSettings.Country = new Country { Id = value }; } }
        }
        public string Phone { get { return this.User != null ? this.User.Phone : ""; } set { if (this.User != null) { this.User.Phone = value; } } }

        public string TermsAndConditions { get; set; }
        public SignUpModel()
        {
            this.User = new User();
        }
    }
}
