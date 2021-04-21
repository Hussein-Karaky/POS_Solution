using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Notif
{
    public class SourceRecipient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; } = 587;
        public int SendingLimits { get; set; } = 300;
    }
}
