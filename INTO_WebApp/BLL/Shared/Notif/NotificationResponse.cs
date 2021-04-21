using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared.Notif
{
    public class NotificationResponse
    {
        public long NotificationId { get; set; }
        public long UserId { get; set; }
        public byte Status { get; set; }
    }
}
