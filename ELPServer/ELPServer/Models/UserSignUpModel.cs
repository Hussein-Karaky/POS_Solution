using BLL.Shared;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Into.Models
{
    public class UserSignUpModel
    {
        
        public IList<LookUpDetails> Countries = new List<LookUpDetails>();
        [DataType(DataType.EmailAddress)]
        [Required]
        [MaxLength(100)]
        public string Email { get; set; }


        [DataType(DataType.Text)]
        [MaxLength(50)]
        [Required]
        public string LegalFN { get; set; }

        [DataType(DataType.Text)]
        [Required]
        [MaxLength(50)]
        public string LegalLN { get; set; }

        [DataType(DataType.Password)]
        [Required]
        [MaxLength(512)]
        public string Password { get; set; }
        //public int LanguageId { get; set; }
        public int CountryId { get; set; }
    }
}
