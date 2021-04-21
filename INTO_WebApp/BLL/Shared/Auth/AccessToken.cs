using System;

namespace BLL.Shared.Auth
{
    public class AccessToken
    {
        public bool Approved { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
