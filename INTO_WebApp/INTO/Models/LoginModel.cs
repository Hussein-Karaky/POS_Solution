using BLL.Home;
using BLL.Shared;
using BLL.Shared.Auth;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace INTO.Models
{
    public class LoginModel
    {
        public IDictionary<string, string> Resources = new Dictionary<string, string>();
        public IDictionary<string, string> Globals = new Dictionary<string, string>();
        public static IList<Country> AllCountries = new List<Country>();//TODO: to be changed
        public static IList<LookUpDetails> InstituteTypes = new List<LookUpDetails>();
        public static IList<LookUpDetails> Curriculums = new List<LookUpDetails>();
        public static IList<LookUpDetails> Classes = new List<LookUpDetails>();
        public static IList<LookUpDetails> AcademicLevel = new List<LookUpDetails>();
        public static IList<Subject> SubjectsClass = new List<Subject>();
        public static IList<Language> AllLanguages = new List<Language>();
        public static IList<LookUpDetails> Subjects = new List<LookUpDetails>();
        public static IList<LookUpDetails> TutorService = new List<LookUpDetails>();
        public LoginModel()
        {
            this.User = new User();
        }
        public object Params { get; set; }
        public DateTime Date { get; set; }
        //[DataType(DataType.EmailAddress)]
        [Required(ErrorMessage = "Please Enter Email or Phone Number !")]
        [MaxLength(100)]
        [JsonIgnore]
        public string Email { get { return User != null ? User.Email : ""; } set { if (User != null) { User.Email = value; } } }

        [DataType(DataType.Password)]
        [Required]
        [MaxLength(512)]
        [JsonIgnore]
        public string Password { get { return User != null ? User.Password : ""; } set { if (User != null) { User.Password = value; } } }
        [JsonIgnore]
        //public EntityType Type { get { return User != null ? User.Type : EntityType.Student; } set { if (User != null) { User.Type = value; } } }
        public EntityType Type
        {
            get
            {
                return User != null ? User.Type : EntityType.Anonymous;
            }
            set
            {
                if (User != null)
                {
                    User.Type = value;
                }
            }
        }
        public byte IntType
        {
            get
            {
                return User != null ? (byte)User.Type : (byte)EntityType.Anonymous;
            }
            set
            {
                if (User != null) { User.Type = (EntityType)value; }
            }
        }
        [Display(Name = "Remember Me")]
        public bool RememberMe { get; set; }
        public string RedirectAction { get; set; }
        public string RedirectController { get; set; }
        public AccessToken Token { get; set; }
        public IList<Language> Languages = new List<Language>();
        public int Language = 1;
        public bool SecurityDiscarded { get; set; }
        public User User { get; set; }
        //Start Nabih
        public IList<Review> Reviews = new List<Review>();

        public DataTable Stats = new DataTable();
        //End Nabih
        public LoginModel DiscardSecurity()
        {
            this.SecurityDiscarded = true;
            return this;
        }
    }
}
