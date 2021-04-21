using BLL.Shared;
using System;

namespace INTO.Models
{
    public class LoggedInModel
    {
        public DateTime Date { set; get; }
        public User User { set; get; }
    }
}
