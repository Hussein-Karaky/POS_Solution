using BLL.Shared;
using System.ComponentModel.DataAnnotations;

namespace INTO.Models
{
    public class LoginViewModel
    {
        public string Username { get; set; }

        [DataType(DataType.Password)]
        public string Password { get; set; }
        public EntityType Type { get; set; }

        [Display(Name = "Remember Me")]
        public bool RememberMe { get; set; }
        public string ReturnUrl { get; set; }
        public User User { get; set; }
    }
}
