using System.ComponentModel.DataAnnotations;
using BLL.Shared;

namespace Into.Models
{
    public class UserLoginModel
    {        
        [Required(ErrorMessage = "Please Enter Email or Phone Number !")]
        [MaxLength(100)]
        public string Email { get; set; }
        [DataType(DataType.Password)]
        [Required]
        [MaxLength(512)]
        public string Password { get; set; }
        public User IntoUser { get; set; }




    }
}
